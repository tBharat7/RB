import React, { useState, useEffect } from 'react';
import { ResumeForm } from './components/ResumeForm';
import { StyleControls } from './components/StyleControls';
import { ResumePreview } from './components/ResumePreview';
import { LayoutSelector } from './components/LayoutSelector';
import TemplateSelector from './components/TemplateSelector';
import ResumeAnalytics from './components/ResumeAnalytics';
import { ResumeData, StyleOptions } from './types';
import { Download, Save, Upload, HelpCircle, BarChart, ChevronDown } from 'lucide-react';
import { usePDF } from 'react-to-pdf';
import { sampleResumeData, templateSamples } from './layouts/sampleData';
import DragAndDropList from './components/DragAndDropList';

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

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [styleOptions, setStyleOptions] = useState<StyleOptions>(initialStyleOptions);
  const [showTips, setShowTips] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { toPDF, targetRef } = usePDF({
    filename: 'resume.pdf',
  });

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
    const data = {
      resumeData,
      styleOptions,
    };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-resume.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-sky-50 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <h1 className="text-3xl font-extralight text-slate-800 tracking-tight">
            <span className="text-sky-500 font-normal">Resume</span> Builder
          </h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowTips(!showTips)}
              className="flex items-center gap-1.5 bg-white text-slate-600 px-3 py-2 rounded-lg border border-slate-200 hover:border-sky-200 hover:text-sky-600 hover:shadow-sm transition-all duration-200"
            >
              <HelpCircle size={16} />
              {showTips ? 'Hide Tips' : 'Show Tips'}
            </button>
            <select 
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white border border-slate-200 text-slate-600 px-3 py-2 rounded-lg hover:border-sky-200 focus:border-sky-300 focus:ring-1 focus:ring-sky-200 transition-all duration-200"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
            </select>
            <button
              onClick={handleClearForm}
              className="flex items-center gap-1.5 bg-white text-slate-600 px-3 py-2 rounded-lg border border-slate-200 hover:border-sky-200 hover:text-sky-600 hover:shadow-sm transition-all duration-200"
            >
              Clear Form
            </button>
            <div className="relative group">
              <button
                className="flex items-center gap-1.5 bg-white text-slate-600 px-3 py-2 rounded-lg border border-slate-200 hover:border-sky-200 hover:text-sky-600 hover:shadow-sm transition-all duration-200"
              >
                <Download size={16} />
                Export <ChevronDown size={12} />
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 hidden group-hover:block z-10 animate-fade-in">
                <ul className="py-1">
                  <li>
                    <button
                      onClick={() => toPDF()}
                      className="block px-4 py-2 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 w-full text-left transition-colors duration-150"
                    >
                      Export as PDF
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={exportAsDocx}
                      className="block px-4 py-2 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 w-full text-left transition-colors duration-150"
                    >
                      Export as DOCX
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={exportAsPlainText}
                      className="block px-4 py-2 text-sm text-slate-600 hover:text-sky-600 hover:bg-sky-50 w-full text-left transition-colors duration-150"
                    >
                      Export as Plain Text
                    </button>
                  </li>
                </ul>
              </div>
            </div>
            <button
              onClick={saveResume}
              className="flex items-center gap-1.5 bg-white text-slate-600 px-3 py-2 rounded-lg border border-slate-200 hover:border-sky-200 hover:text-sky-600 hover:shadow-sm transition-all duration-200"
            >
              <Save size={16} />
              Save
            </button>
            <div className="relative">
              <input
                type="file"
                id="load-resume"
                accept=".json"
                onChange={loadResume}
                className="hidden"
              />
              <label
                htmlFor="load-resume"
                className="flex items-center gap-1.5 bg-white text-slate-600 px-3 py-2 rounded-lg border border-slate-200 hover:border-sky-200 hover:text-sky-600 hover:shadow-sm transition-all duration-200 cursor-pointer"
              >
                <Upload size={16} />
                Load
              </label>
            </div>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              className="flex items-center gap-1.5 bg-white text-slate-600 px-3 py-2 rounded-lg border border-slate-200 hover:border-sky-200 hover:text-sky-600 hover:shadow-sm transition-all duration-200"
            >
              <BarChart size={16} />
              Analytics
            </button>
          </div>
        </div>

        <TemplateSelector onSelect={handleTemplateSelect} activeTemplate={styleOptions.layout} />

        {showAnalytics && (
          <div className="mb-8 animate-fade-in">
            <ResumeAnalytics data={sampleAnalyticsData} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <ResumeForm 
              data={resumeData} 
              onChange={handleResumeChange} 
              showTips={showTips}
              language={language}
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