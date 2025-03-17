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
import { Download, Save, Upload, HelpCircle, BarChart, ChevronDown, LogOut, User, Database, Clock, Settings } from 'lucide-react';
import { usePDF } from 'react-to-pdf';
import { sampleResumeData, templateSamples } from './layouts/sampleData';
import DragAndDropList from './components/DragAndDropList';
import { 
  loginUser, 
  registerUser, 
  saveUserData, 
  updateUserData,
  getUserData,
  loginWithGoogle,
  logoutUser
} from './utils/api';
import { GoogleUserData } from './utils/userStorage';

const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api' 
  : '/api'; // In production, use relative path

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
  const [settingsDropdownOpen, setSettingsDropdownOpen] = useState(false);

  // Check if user is already logged in from a previous session
  useEffect(() => {
    const savedUserJSON = localStorage.getItem('current_user');
    if (savedUserJSON) {
      const savedUser = JSON.parse(savedUserJSON);
      
      setUser({
        username: savedUser.username,
        isAuthenticated: true,
        displayName: savedUser.displayName,
        photoURL: savedUser.photoURL,
        email: savedUser.email
      });
      
      // Fetch user's resume data from API
      const fetchData = async () => {
        try {
          const data = await getUserData();
          if (data) {
            if (data.resumeData) {
              setResumeData(data.resumeData);
            }
            
            if (data.styleOptions) {
              setStyleOptions(data.styleOptions);
            }
            
            if (data.lastSaved) {
              setLastSaved(new Date(data.lastSaved));
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          showNotification('Failed to load your resume data', 'error');
        }
      };
      
      fetchData();
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
      autoSaveTimer = window.setTimeout(async () => {
        try {
          // Use PATCH method for auto-save operations
          await updateUserData(resumeData, styleOptions);
          setLastSaved(new Date());
          
          // Show notification only for the first auto-save after enabling
          const lastAutoSaveNotified = localStorage.getItem('last_autosave_notified');
          const now = new Date().getTime();
          
          if (!lastAutoSaveNotified || (now - parseInt(lastAutoSaveNotified)) > (5 * 60 * 1000)) {
            showNotification('Auto-save is active. Your changes will be saved automatically.', 'success');
            localStorage.setItem('last_autosave_notified', now.toString());
          }
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, 60000); // Auto-save every minute
    }
    
    return () => {
      if (autoSaveTimer) {
        window.clearTimeout(autoSaveTimer);
      }
    };
  }, [resumeData, styleOptions, user.isAuthenticated, autoSaveEnabled, isEditing]);

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
    
    // Load appropriate sample data for this template ONLY if the form is empty or hasn't been edited
    if (templateSamples[templateId] && !isEditing) {
      // If we're in the initial state or the form is empty, load template sample data
      const isEmpty = 
        !resumeData.personalInfo.name && 
        !resumeData.personalInfo.email && 
        resumeData.experience.length === 0 && 
        resumeData.education.length === 0 && 
        resumeData.skills.length === 0;
      
      if (isEmpty) {
        setResumeData(templateSamples[templateId]);
        showNotification(`${templateId.charAt(0).toUpperCase() + templateId.slice(1)} template applied with sample data.`);
      }
    }
  };

  const loadTemplateSampleData = (templateId: string) => {
    if (templateSamples[templateId]) {
      setResumeData(templateSamples[templateId]);
      showNotification(`${templateId.charAt(0).toUpperCase() + templateId.slice(1)} template sample data loaded`);
      // We're intentionally not setting isEditing to true here because this is template data
    }
  };

  const handleClearForm = () => {
    setResumeData(initialResumeData);
    setIsEditing(false);
  };

  const saveResume = async () => {
    try {
      // If user is authenticated, save to their profile first
      if (user.isAuthenticated) {
        await saveUserData(resumeData, styleOptions);
        setLastSaved(new Date());
        showNotification('Your resume has been saved to your account and downloaded!');
      } else {
        showNotification('Your resume has been downloaded as a file.');
      }
      
      // Always download the file
      const data = { resumeData, styleOptions };
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
    } catch (error) {
      console.error('Error saving resume:', error);
      showNotification('Failed to save your resume', 'error');
    }
  };

  // Function to save data for consistency without download
  const saveData = async () => {
    if (user.isAuthenticated) {
      try {
        // Save to user's profile
        await saveUserData(resumeData, styleOptions);
        
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
      } catch (error) {
        console.error('Error saving data:', error);
        showNotification('Failed to save your data', 'error');
      }
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

  const handleLogin = async (username: string, password: string) => {
    try {
      const userData = await loginUser(username, password);
      
      setUser({
        username: userData.username,
        isAuthenticated: true,
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        email: userData.email
      });
      
      // Fetch the user's resume data
      try {
        const data = await getUserData();
        if (data) {
          if (data.resumeData) {
            setResumeData(data.resumeData);
          }
          
          if (data.styleOptions) {
            setStyleOptions(data.styleOptions);
          }
          
          if (data.lastSaved) {
            setLastSaved(new Date(data.lastSaved));
          }
        }
      } catch (error) {
        console.error('Error fetching resume data:', error);
      }
      
      setShowAuthModal(false);
      showNotification(`Welcome, ${userData.displayName || userData.username}!`);
    } catch (error) {
      console.error('Login error:', error);
      showNotification('Invalid username or password', 'error');
    }
  };

  const handleSignup = async (username: string, password: string, email: string) => {
    try {
      const userData = await registerUser(username, email, password);
      
      setUser({
        username: userData.username,
        isAuthenticated: true,
        email: userData.email,
        displayName: userData.displayName
      });
      
      setShowAuthModal(false);
      showNotification('Account created successfully!');
    } catch (error) {
      console.error('Registration error:', error);
      showNotification('Username may already be taken. Please try another one.', 'error');
    }
  };

  const handleGoogleSignIn = async (googleData: GoogleUserData) => {
    try {
      const userData = await loginWithGoogle(googleData);
      
      setUser({
        username: userData.username,
        isAuthenticated: true,
        displayName: userData.displayName || googleData.displayName,
        photoURL: userData.photoURL || googleData.photoURL,
        email: userData.email || googleData.email
      });
      
      // Fetch the user's resume data
      try {
        const data = await getUserData();
        if (data) {
          if (data.resumeData) {
            setResumeData(data.resumeData);
          }
          
          if (data.styleOptions) {
            setStyleOptions(data.styleOptions);
          }
          
          if (data.lastSaved) {
            setLastSaved(new Date(data.lastSaved));
          }
        }
      } catch (error) {
        console.error('Error fetching resume data:', error);
      }
      
      setShowAuthModal(false);
      showNotification(`Welcome, ${userData.displayName || userData.email}!`);
    } catch (error) {
      console.error('Google sign-in error:', error);
      showNotification('Failed to sign in with Google. Please try again.', 'error');
    }
  };

  const handleLogout = () => {
    logoutUser();
    
    setUser({
      username: '',
      isAuthenticated: false
    });
    
    setResumeData(initialResumeData);
    setStyleOptions(initialStyleOptions);
    setShowAuthModal(true);
    showNotification('You have been logged out');
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
    alert('LinkedIn import functionality is coming soon!');
  };

  // Track when the user starts editing
  const handleResumeChange = (data: ResumeData) => {
    setResumeData(data);
    
    // Check if there are any meaningful changes compared to the initial state
    const hasContent = 
      data.personalInfo.name.trim() !== '' || 
      data.personalInfo.email.trim() !== '' || 
      data.personalInfo.phone.trim() !== '' ||
      data.personalInfo.summary.trim() !== '' ||
      data.experience.length > 0 ||
      data.education.length > 0 ||
      data.skills.length > 0;
    
    if (hasContent) {
      setIsEditing(true);
    }
    
    // If it's been more than 2 minutes since last save and auto-save is enabled, save now
    if (user.isAuthenticated && autoSaveEnabled && lastSaved) {
      const now = new Date();
      const diffMs = now.getTime() - lastSaved.getTime();
      const diffMin = Math.floor(diffMs / (1000 * 60));
      
      if (diffMin >= 2) {
        // Use PATCH method for auto-save operations
        updateUserData(data, styleOptions)
          .then(() => {
            setLastSaved(now);
            showNotification('Changes auto-saved');
          })
          .catch(error => {
            console.error('Auto-save failed:', error);
          });
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
          
          {/* User profile and controls section - simplified layout */}
          <div className="flex flex-wrap items-center gap-3">
            {/* User profile - more minimal */}
            {user.isAuthenticated && (
              <div className="flex items-center text-slate-600 mr-2 px-2 py-1 rounded-md hover:bg-slate-50">
                {user.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt={user.displayName || user.username} 
                    className="h-7 w-7 rounded-full mr-2"
                  />
                ) : (
                  <User className="h-5 w-5 text-sky-500 mr-2" />
                )}
                <span className="text-sm font-medium">
                  {user.displayName || user.username}
                </span>
                {autoSaveEnabled && lastSaved && (
                  <span className="ml-2 text-xs text-slate-400 hidden md:inline-block">
                    <Clock size={12} className="inline mr-1" />
                    {formatLastSaved(lastSaved)}
                  </span>
                )}
              </div>
            )}
            
            {/* Core action buttons - simplified */}
            <div className="flex gap-2">
              {/* Document dropdown with Import/Export options */}
              <div className="relative">
                <button
                  id="file-dropdown-button"
                  onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
                  className="flex items-center gap-1.5 bg-white text-slate-700 px-3 py-2 rounded-lg border border-slate-200 hover:border-sky-200 hover:text-sky-600 hover:shadow-sm transition-all duration-200"
                  aria-haspopup="true"
                  aria-expanded={exportDropdownOpen}
                >
                  <Download size={16} />
                  <span className="hidden sm:inline">Document</span> <ChevronDown size={12} className={`transition-transform duration-200 ${exportDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {exportDropdownOpen && (
                  <div 
                    id="export-dropdown"
                    className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-slate-100 z-10 animate-fade-in"
                  >
                    <div className="py-1 border-b border-slate-100">
                      <div className="px-3 py-1 text-xs font-semibold text-slate-500">Export</div>
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
                    <div className="py-1">
                      <div className="px-3 py-1 text-xs font-semibold text-slate-500">Import</div>
                      <ul className="py-1" role="menu">
                        <li role="menuitem">
                          <label className="block px-4 py-2 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 w-full text-left transition-colors duration-150 cursor-pointer">
                            Import from File
                            <input
                              type="file"
                              onChange={loadResume}
                              className="hidden"
                              accept=".json"
                            />
                          </label>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Primary action buttons */}
              <button
                onClick={saveResume}
                className="flex items-center gap-1.5 bg-sky-500 text-white px-3 py-2 rounded-lg hover:bg-sky-600 transition-all duration-200"
              >
                <Save size={16} />
                <span className="hidden sm:inline">Save</span>
              </button>
              
              {/* Settings dropdown */}
              <div className="relative">
                <button
                  id="settings-dropdown-button"
                  onClick={() => setSettingsDropdownOpen(!settingsDropdownOpen)}
                  className="flex items-center gap-1.5 bg-white text-slate-700 px-3 py-2 rounded-lg border border-slate-200 hover:border-sky-200 hover:text-sky-600 hover:shadow-sm transition-all duration-200"
                  aria-haspopup="true"
                  aria-expanded={settingsDropdownOpen}
                >
                  <Settings size={16} />
                  <ChevronDown size={12} className={`transition-transform duration-200 ${settingsDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {settingsDropdownOpen && (
                  <div 
                    id="settings-dropdown"
                    className="absolute right-0 mt-2 w-52 bg-white rounded-lg shadow-lg border border-slate-100 z-10 animate-fade-in"
                  >
                    <ul className="py-1" role="menu">
                      <li role="menuitem">
                        <button
                          onClick={() => {
                            const newState = !autoSaveEnabled;
                            setAutoSaveEnabled(newState);
                            if (newState) {
                              showNotification('Auto-save enabled', 'success');
                            } else {
                              showNotification('Auto-save disabled', 'error');
                            }
                            setSettingsDropdownOpen(false);
                          }}
                          className="flex items-center justify-between px-4 py-2 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 w-full text-left transition-colors duration-150"
                        >
                          <span>Auto-Save</span>
                          <div className={`w-8 h-4 rounded-full ${autoSaveEnabled ? 'bg-sky-400' : 'bg-slate-300'} relative`}>
                            <div 
                              className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transform transition-transform ${
                                autoSaveEnabled ? 'translate-x-4' : 'translate-x-0.5'
                              }`} 
                            />
                          </div>
                        </button>
                      </li>
                      <li role="menuitem">
                        <button
                          onClick={() => {
                            setShowTips(!showTips);
                            setSettingsDropdownOpen(false);
                          }}
                          className="flex items-center justify-between px-4 py-2 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 w-full text-left transition-colors duration-150"
                        >
                          <span>Show Tips</span>
                          <div className={`w-8 h-4 rounded-full ${showTips ? 'bg-sky-400' : 'bg-slate-300'} relative`}>
                            <div 
                              className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transform transition-transform ${
                                showTips ? 'translate-x-4' : 'translate-x-0.5'
                              }`} 
                            />
                          </div>
                        </button>
                      </li>
                      <li role="menuitem">
                        <button
                          onClick={() => {
                            handleClearForm();
                            setSettingsDropdownOpen(false);
                          }}
                          className="block px-4 py-2 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 w-full text-left transition-colors duration-150"
                        >
                          Clear Form
                        </button>
                      </li>
                      {user.isAuthenticated && (
                        <li role="menuitem">
                          <button
                            onClick={() => {
                              handleLogout();
                              setSettingsDropdownOpen(false);
                            }}
                            className="block px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 w-full text-left transition-colors duration-150"
                          >
                            <LogOut size={16} className="inline mr-1" />
                            Logout
                          </button>
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <TemplateSelector 
          onSelect={handleTemplateSelect} 
          activeTemplate={styleOptions.layout} 
          onLoadSampleData={loadTemplateSampleData}
        />

        {showAnalytics && (
          <div className="mb-8 animate-fade-in">
            <ResumeAnalytics data={sampleAnalyticsData} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              <ResumeForm 
                data={resumeData} 
                onChange={handleResumeChange} 
                showTips={showTips}
                onImportLinkedIn={importFromLinkedIn}
              />
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5">
              <StyleControls options={styleOptions} onChange={setStyleOptions} />
            </div>
          </div>
          
          <div className="sticky top-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-5" ref={targetRef}>
              <ResumePreview data={resumeData} styleOptions={styleOptions} />
            </div>
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