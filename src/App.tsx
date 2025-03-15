import React, { useState, useEffect } from 'react';
import { ResumeForm } from './components/ResumeForm';
import { StyleControls } from './components/StyleControls';
import { ResumePreview } from './components/ResumePreview';
import { LayoutSelector } from './components/LayoutSelector';
import TemplateSelector from './components/TemplateSelector';
import ResumeAnalytics from './components/ResumeAnalytics';
import { Auth } from './components/Auth';
import { useNotification } from './components/Notification';
import { ResumeData, StyleOptions } from './types';
import { Download, Save, Upload, HelpCircle, BarChart, ChevronDown, LogOut, User, Database, Clock } from 'lucide-react';
import { usePDF } from 'react-to-pdf';
import { sampleResumeData, templateSamples } from './layouts/sampleData';
import DragAndDropList from './components/DragAndDropList';
import { 
  authenticateUser, 
  registerUser, 
  saveUserData, 
  getUserData,
  loginWithGoogle,
  GoogleUserData,
} from './utils/userStorage';

const initialResumeData: ResumeData = {
  personalInfo: {
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    summary: '',
  },
  experience: [],
  education: [],
  skills: [],
};

const initialStyleOptions: StyleOptions = {
  layout: 'minimal',
  primaryColor: '#0ea5e9',
  fontFamily: 'sans',
  fontSize: 'base',
};

// Sample analytics data - in a real app this would come from a backend
const sampleAnalyticsData = {
  views: 245,
  downloads: 32,
  viewsByDay: [
    { date: '05/01', count: 12 },
    { date: '05/02', count: 8 },
    { date: '05/03', count: 15 },
    { date: '05/04', count: 22 },
    { date: '05/05', count: 18 },
    { date: '05/06', count: 27 },
    { date: '05/07', count: 14 },
  ],
  downloadsByDay: [
    { date: '05/01', count: 2 },
    { date: '05/02', count: 3 },
    { date: '05/03', count: 5 },
    { date: '05/04', count: 4 },
    { date: '05/05', count: 6 },
    { date: '05/06', count: 8 },
    { date: '05/07', count: 4 },
  ],
  topLocation: 'United States',
  averageViewTime: '2m 34s',
};

interface UserState {
  username: string;
  isAuthenticated: boolean;
  displayName?: string;
  photoURL?: string;
  email?: string;
}

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [styleOptions, setStyleOptions] = useState<StyleOptions>(initialStyleOptions);
  const [showTips, setShowTips] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [user, setUser] = useState<UserState>({
    username: '',
    isAuthenticated: false
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { toPDF, targetRef } = usePDF({
    filename: 'resume.pdf',
  });
  const { showNotification, NotificationComponent } = useNotification();
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  // Check if user is already logged in from a previous session
  useEffect(() => {
    const savedUser = localStorage.getItem('current_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      
      // Load user profile data along with saved resume
      const { 
        resumeData: savedResumeData, 
        styleOptions: savedStyleOptions,
        displayName,
        photoURL,
        email
      } = getUserData(userData.username);
      
      setUser({
        username: userData.username,
        isAuthenticated: true,
        displayName,
        photoURL,
        email
      });
      
      if (savedResumeData) {
        setResumeData(savedResumeData);
      }
      
      if (savedStyleOptions) {
        setStyleOptions(savedStyleOptions);
      }
    } else {
      // Not logged in, show auth modal
      setShowAuthModal(true);
    }
  }, []);

  // Auto-save functionality
  useEffect(() => {
    let autoSaveTimer: number | undefined;
    
    // Only auto-save if user is authenticated, auto-save is enabled, and there have been edits
    if (user.isAuthenticated && autoSaveEnabled && isEditing) {
      autoSaveTimer = window.setTimeout(() => {
        saveUserData(user.username, resumeData, styleOptions);
        setLastSaved(new Date());
        
        // Show notification only for the first auto-save after enabling
        const lastAutoSaveNotified = localStorage.getItem('last_autosave_notified');
        const now = new Date().getTime();
        
        if (!lastAutoSaveNotified || (now - parseInt(lastAutoSaveNotified)) > (5 * 60 * 1000)) {
          showNotification('Auto-save is active. Your changes will be saved automatically.', 'success');
          localStorage.setItem('last_autosave_notified', now.toString());
        }
      }, 60000); // Auto-save every minute
    }
    
    return () => {
      if (autoSaveTimer) {
        window.clearTimeout(autoSaveTimer);
      }
    };
  }, [resumeData, styleOptions, user.isAuthenticated, autoSaveEnabled, isEditing, user.username]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('export-dropdown');
      const button = document.getElementById('export-dropdown-button');
      
      if (dropdown && button && !dropdown.contains(event.target as Node) && !button.contains(event.target as Node)) {
        setExportDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLayoutSelect = (style: StyleOptions) => {
    setStyleOptions(style);
    // Only set sample data if the form is empty
    if (!resumeData.personalInfo.name) {
      setResumeData(sampleResumeData);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    // Update the style options
    setStyleOptions({
      ...styleOptions,
      layout: templateId as StyleOptions['layout'],
    });
    
    // Load appropriate sample data for this template
    if (templateSamples[templateId]) {
      // If the user hasn't started editing, or if they're just previewing
      if (!isEditing) {
        setResumeData(templateSamples[templateId]);
      }
    }
  };

  const handleClearForm = () => {
    setResumeData(initialResumeData);
    setIsEditing(false);
  };

  const saveResume = () => {
    // Always prepare data for download
    const data = {
      resumeData,
      styleOptions,
    };
    
    // If user is authenticated, save to their profile first
    if (user.isAuthenticated) {
      saveUserData(user.username, resumeData, styleOptions);
      setLastSaved(new Date());
      showNotification('Your resume has been saved to your account and downloaded!');
    } else {
      showNotification('Your resume has been downloaded as a file.');
    }
    
    // Always download the file
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = resumeData.personalInfo.name 
      ? `resume_${resumeData.personalInfo.name.toLowerCase().replace(/\s+/g, '_')}.json` 
      : 'my-resume.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to save data for consistency without download
  const saveData = () => {
    if (user.isAuthenticated) {
      // Save to user's profile
      saveUserData(user.username, resumeData, styleOptions);
      
      // Update last saved timestamp
      setLastSaved(new Date());
      
      // Show a more detailed notification
      if (resumeData.personalInfo.name) {
        showNotification(`Resume for ${resumeData.personalInfo.name} saved successfully!`);
      } else {
        showNotification('Your resume data has been saved to your account!');
      }
      
      // Set editing state to track changes
      setIsEditing(true);
    } else {
      showNotification('Please log in to save your data', 'error');
      setShowAuthModal(true);
    }
  };

  // Format the last saved time
  const formatLastSaved = (date: Date | null): string => {
    if (!date) return 'Not saved yet';
    
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    
    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin} min${diffMin === 1 ? '' : 's'} ago`;
    if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
    
    return date.toLocaleString();
  };

  const loadResume = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          setResumeData(data.resumeData);
          setStyleOptions(data.styleOptions);
          setIsEditing(true);
        } catch (error) {
          console.error('Error loading resume:', error);
          alert('There was an error loading your resume. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleLogin = (username: string) => {
    // Get user data including profile info
    const { 
      resumeData: savedResumeData, 
      styleOptions: savedStyleOptions,
      displayName,
      photoURL,
      email 
    } = getUserData(username);
    
    setUser({
      username,
      isAuthenticated: true,
      displayName,
      photoURL,
      email
    });
    
    // Save current user to localStorage
    localStorage.setItem('current_user', JSON.stringify({ username }));
    
    if (savedResumeData) {
      setResumeData(savedResumeData);
    }
    
    if (savedStyleOptions) {
      setStyleOptions(savedStyleOptions);
    }
    
    setShowAuthModal(false);
  };

  const handleSignup = (username: string, password: string, email: string) => {
    const success = registerUser(username, password, email);
    
    if (success) {
      setUser({
        username,
        isAuthenticated: true,
        email
      });
      
      // Save current user to localStorage
      localStorage.setItem('current_user', JSON.stringify({ username }));
      
      setShowAuthModal(false);
      showNotification('Account created successfully!');
    } else {
      showNotification('Username already taken. Please choose another one.', 'error');
    }
  };

  const handleGoogleSignIn = (googleData: GoogleUserData) => {
    const result = loginWithGoogle(googleData);
    
    if (result.success && result.username) {
      // Get the full user data after Google sign-in
      const { 
        displayName, 
        photoURL, 
        email,
        resumeData: savedResumeData,
        styleOptions: savedStyleOptions
      } = getUserData(result.username);
      
      setUser({
        username: result.username,
        isAuthenticated: true,
        displayName: displayName || googleData.displayName,
        photoURL: photoURL || googleData.photoURL,
        email: email || googleData.email
      });
      
      // Save current user to localStorage
      localStorage.setItem('current_user', JSON.stringify({ 
        username: result.username,
        displayName: googleData.displayName,
        photoURL: googleData.photoURL
      }));
      
      // If the user has saved data, load it
      if (savedResumeData) {
        setResumeData(savedResumeData);
      }
      
      if (savedStyleOptions) {
        setStyleOptions(savedStyleOptions);
      }
      
      setShowAuthModal(false);
      showNotification(`Welcome, ${googleData.displayName || googleData.email}!`);
    } else {
      showNotification('Failed to sign in with Google. Please try again.', 'error');
    }
  };

  const handleLogout = () => {
    setUser({
      username: '',
      isAuthenticated: false
    });
    
    localStorage.removeItem('current_user');
    setResumeData(initialResumeData);
    setStyleOptions(initialStyleOptions);
    setShowAuthModal(true);
  };

  const exportAsDocx = () => {
    // This is a placeholder for DOCX export functionality
    // In a real implementation, you would use a library like docx-js
    alert('DOCX export functionality would be implemented here');
  };

  const exportAsPlainText = () => {
    let text = `${resumeData.personalInfo.name}\n`;
    text += `${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location}\n\n`;
    text += `SUMMARY\n${resumeData.personalInfo.summary}\n\n`;
    
    text += `EXPERIENCE\n`;
    resumeData.experience.forEach(exp => {
      text += `${exp.position} at ${exp.company} (${exp.duration})\n${exp.description}\n\n`;
    });
    
    text += `EDUCATION\n`;
    resumeData.education.forEach(edu => {
      text += `${edu.degree} at ${edu.institution} (${edu.duration})\n${edu.description}\n\n`;
    });
    
    text += `SKILLS\n${resumeData.skills.join(', ')}`;
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importFromLinkedIn = () => {
    // This is a placeholder for LinkedIn import functionality
    // In a real implementation, you would use LinkedIn's API
    alert('LinkedIn import functionality would be implemented here');
  };

  // Track when the user starts editing
  const handleResumeChange = (data: ResumeData) => {
    setResumeData(data);
    setIsEditing(true);
    
    // If it's been more than 2 minutes since last save and auto-save is enabled, save now
    if (user.isAuthenticated && autoSaveEnabled && lastSaved) {
      const now = new Date();
      const diffMs = now.getTime() - lastSaved.getTime();
      const diffMin = Math.floor(diffMs / (1000 * 60));
      
      if (diffMin >= 2) {
        saveUserData(user.username, data, styleOptions);
        setLastSaved(now);
        showNotification('Changes auto-saved');
      }
    }
  };

  // Show auth modal if user is not authenticated
  if (showAuthModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 py-10 flex items-center justify-center">
        <Auth 
          onLogin={handleLogin} 
          onSignup={handleSignup} 
          onGoogleSignIn={handleGoogleSignIn}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 py-10">
      {NotificationComponent}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <h1 className="text-3xl font-extralight text-slate-800 tracking-tight">
            <span className="text-sky-500 font-normal">Resume</span> Builder
          </h1>
          <div className="flex flex-wrap gap-2 items-center">
            {user.isAuthenticated && (
              <div className="flex items-center text-slate-600 mr-4">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || user.username} 
                    className="h-8 w-8 rounded-full mr-2 border border-sky-200"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-sky-100 flex items-center justify-center mr-2">
                    <User className="h-4 w-4 text-sky-500" />
                  </div>
                )}
                <span className="font-medium">
                  {user.displayName || user.username}
                </span>
              </div>
            )}
            <button
              onClick={() => setShowTips(!showTips)}
              className="flex items-center gap-1.5 bg-white text-slate-600 px-3 py-2 rounded-lg border border-slate-200 hover:border-sky-200 hover:text-sky-600 hover:shadow-sm transition-all duration-200"
            >
              <HelpCircle size={16} />
              {showTips ? 'Hide Tips' : 'Show Tips'}
            </button>
            <button
              onClick={handleClearForm}
              className="flex items-center gap-1.5 bg-white text-slate-600 px-3 py-2 rounded-lg border border-slate-200 hover:border-sky-200 hover:text-sky-600 hover:shadow-sm transition-all duration-200"
            >
              Clear Form
            </button>
            <div className="relative">
              <button
                id="export-dropdown-button"
                onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                className="flex items-center gap-1.5 bg-white text-slate-600 px-3 py-2 rounded-lg border border-slate-200 hover:border-sky-200 hover:text-sky-600 hover:shadow-sm transition-all duration-200"
                aria-haspopup="true"
                aria-expanded={exportDropdownOpen}
              >
                <Download size={16} />
                Export <ChevronDown size={12} className={`transition-transform duration-200 ${exportDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {exportDropdownOpen && (
                <div 
                  id="export-dropdown"
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 z-10 animate-fade-in"
                >
                  <ul className="py-1" role="menu">
                    <li role="menuitem">
                      <button
                        onClick={() => {
                          toPDF();
                          setExportDropdownOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 w-full text-left transition-colors duration-150"
                      >
                        Export as PDF
                      </button>
                    </li>
                    <li role="menuitem">
                      <button
                        onClick={() => {
                          exportAsDocx();
                          setExportDropdownOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 w-full text-left transition-colors duration-150"
                      >
                        Export as DOCX
                      </button>
                    </li>
                    <li role="menuitem">
                      <button
                        onClick={() => {
                          exportAsPlainText();
                          setExportDropdownOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 w-full text-left transition-colors duration-150"
                      >
                        Export as Plain Text
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
            
            <label
              className="flex items-center gap-1.5 bg-white text-slate-600 px-3 py-2 rounded-lg border border-slate-200 hover:border-sky-200 hover:text-sky-600 hover:shadow-sm transition-all duration-200 cursor-pointer"
            >
              <Upload size={16} />
              Import
              <input
                type="file"
                onChange={loadResume}
                className="hidden"
                accept=".json"
              />
            </label>
            
            <button
              onClick={saveResume}
              className="flex items-center gap-1.5 bg-sky-500 text-white px-3 py-2 rounded-lg hover:bg-sky-600 transition-all duration-200"
            >
              <Save size={16} />
              Save & Download
            </button>
            
            {user.isAuthenticated && (
              <>
                <button
                  onClick={() => {
                    const newState = !autoSaveEnabled;
                    setAutoSaveEnabled(newState);
                    if (newState) {
                      showNotification('Auto-save enabled. Your changes will be saved automatically.', 'success');
                    } else {
                      showNotification('Auto-save disabled. Remember to save your work manually.', 'error');
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border transition-colors duration-200 ${
                    autoSaveEnabled 
                      ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-sky-200 hover:text-sky-600'
                  }`}
                  title={autoSaveEnabled ? "Auto-save is on. Your work is saved automatically every minute." : "Auto-save is off. Remember to save manually."}
                >
                  <Clock size={16} />
                  {autoSaveEnabled ? 'Auto-Save On' : 'Auto-Save Off'}
                </button>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-white text-slate-600 px-3 py-2 rounded-lg border border-slate-200 hover:border-red-200 hover:text-red-600 hover:shadow-sm transition-all duration-200 ml-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        <TemplateSelector onSelect={handleTemplateSelect} activeTemplate={styleOptions.layout} />

        {showAnalytics && (
          <div className="mb-8 animate-fade-in">
            <ResumeAnalytics data={sampleAnalyticsData} />
          </div>
        )}

        {user.isAuthenticated && (
          <div className="mb-4 text-sm text-slate-500 flex items-center justify-end">
            <Clock size={14} className="mr-1" />
            <span>
              {autoSaveEnabled ? (
                <>
                  {lastSaved ? `Auto-save enabled · Last saved: ${formatLastSaved(lastSaved)}` : 'Auto-save enabled · No changes saved yet'}
                </>
              ) : (
                <>
                  Auto-save disabled {lastSaved && `· Last saved: ${formatLastSaved(lastSaved)}`}
                </>
              )}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <ResumeForm 
              data={resumeData} 
              onChange={handleResumeChange} 
              showTips={showTips}
              onImportLinkedIn={importFromLinkedIn}
            />
            <StyleControls options={styleOptions} onChange={setStyleOptions} />
          </div>
          
          <div className="sticky top-8" ref={targetRef}>
            <ResumePreview data={resumeData} styleOptions={styleOptions} />
          </div>
        </div>
      </div>
      
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.2s ease-out;
          }
        `}
      </style>
    </div>
  );
}

export default App;