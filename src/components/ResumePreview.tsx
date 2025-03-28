import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ResumeData, StyleOptions } from '../types';
import { Printer } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  styleOptions: StyleOptions;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, styleOptions }) => {
  // Add print styles dynamically
  useEffect(() => {
    // Create a style element if it doesn't exist
    let style = document.getElementById('resume-print-styles');
    if (!style) {
      style = document.createElement('style');
      style.id = 'resume-print-styles';
      document.head.appendChild(style);
    }

    // Update the print styles
    style.innerHTML = `
      @media print {
        body * {
          visibility: hidden;
        }
        .resume-preview-container, .resume-preview-container * {
          visibility: visible;
        }
        .resume-preview-container {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
        }
        .print-button {
          display: none;
        }
      }
    `;

    return () => {
      // Clean up
      if (style) {
        document.head.removeChild(style);
      }
    };
  }, []);
  const getFontClass = () => {
    switch (styleOptions.fontFamily) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      default: return 'font-sans';
    }
  };

  const getFontSizeClass = () => {
    switch (styleOptions.fontSize) {
      case 'sm': return 'text-sm';
      case 'lg': return 'text-lg';
      default: return 'text-base';
    }
  };

  const getLayoutClasses = () => {
    switch (styleOptions.layout) {
      case 'classic':
        return 'max-w-4xl mx-auto p-8 bg-white shadow-md border border-slate-100';
      case 'minimal':
        return 'max-w-3xl mx-auto p-6 bg-white';
      case 'executive':
        return 'max-w-4xl mx-auto p-8 bg-white border-t-4 shadow-md';
      case 'creative':
        return 'max-w-4xl mx-auto p-8 bg-white rounded-lg shadow-md';
      default: // modern
        return 'max-w-4xl mx-auto p-8 bg-white shadow-md';
    }
  };

  const getCreativeStyles = () => {
    if (styleOptions.layout !== 'creative') return {};
    
    return {
      backgroundImage: `linear-gradient(to bottom right, ${styleOptions.primaryColor}05, ${styleOptions.primaryColor}10)`,
      borderLeft: `3px solid ${styleOptions.primaryColor}`
    };
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative resume-preview-container">
      <div className="flex justify-end mb-3 print-button">
        <button
          onClick={handlePrint}
          className="p-2 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors flex items-center gap-1.5"
          title="Print resume"
        >
          <Printer size={16} />
          <span className="text-sm">Print</span>
        </button>
      </div>

      <div 
        className={`${getLayoutClasses()} ${getFontClass()} ${getFontSizeClass()} relative print:shadow-none transition-all duration-300`}
        style={{ 
          borderColor: styleOptions.layout === 'executive' ? styleOptions.primaryColor : undefined,
          boxShadow: styleOptions.layout === 'minimal' ? 'none' : '0 4px 20px rgba(0, 0, 0, 0.08)',
          ...getCreativeStyles()
        }}
        ref={(el) => {
          if (el) {
            el.style.setProperty('--primary-color', styleOptions.primaryColor);
          }
        }}
      >
        <div className={`mb-8 ${styleOptions.layout === 'minimal' ? '' : 'text-center'} ${styleOptions.layout === 'executive' ? 'border-b pb-4' : ''}`}>
          <h1 
            className="text-3xl font-bold tracking-tight" 
            style={{ color: styleOptions.primaryColor }}
          >
            {data.personalInfo.name}
          </h1>
          {data.personalInfo.title && (
            <p className="text-xl text-gray-700 mt-2 font-medium">{data.personalInfo.title}</p>
          )}
          <div className="mt-4 text-gray-600 flex flex-wrap gap-3 justify-center">
            {data.personalInfo.email && (
              <span className="inline-flex items-center">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                {data.personalInfo.email}
              </span>
            )}
            {data.personalInfo.phone && (
              <span className="inline-flex items-center">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
                {data.personalInfo.phone}
              </span>
            )}
            {data.personalInfo.location && (
              <span className="inline-flex items-center">
                <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                </svg>
                {data.personalInfo.location}
              </span>
            )}
          </div>
        </div>

        {data.personalInfo.summary && (
          <div className="mb-7">
            <h2 
              className="text-lg font-semibold mb-3 pb-1 border-b" 
              style={{ color: styleOptions.primaryColor, borderColor: `${styleOptions.primaryColor}40` }}
            >
              Summary
            </h2>
            <p className="text-gray-700 leading-relaxed text-justify">{data.personalInfo.summary}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div className="mb-7">
            <h2 
              className="text-lg font-semibold mb-4 pb-1 border-b" 
              style={{ color: styleOptions.primaryColor, borderColor: `${styleOptions.primaryColor}40` }}
            >
              Experience
            </h2>
            {data.experience.map((exp, index) => (
              <div 
                key={index} 
                className={`mb-5 ${styleOptions.layout === 'creative' ? 'p-4 bg-white bg-opacity-60 rounded-md shadow-sm' : ''}`}
              >
                <div className="flex justify-between items-baseline flex-wrap mb-1">
                  <h3 className="text-base font-medium">{exp.position}</h3>
                  <span className="text-gray-500 text-sm font-medium">{exp.duration}</span>
                </div>
                <p className="text-gray-700 font-medium mb-2">{exp.company}</p>
                <div className="mt-2 text-gray-600 prose prose-sm max-w-none prose-p:mt-1 prose-p:mb-1">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {exp.description}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        )}

        {data.education.length > 0 && (
          <div className="mb-7">
            <h2 
              className="text-lg font-semibold mb-4 pb-1 border-b" 
              style={{ color: styleOptions.primaryColor, borderColor: `${styleOptions.primaryColor}40` }}
            >
              Education
            </h2>
            {data.education.map((edu, index) => (
              <div 
                key={index} 
                className={`mb-5 ${styleOptions.layout === 'creative' ? 'p-4 bg-white bg-opacity-60 rounded-md shadow-sm' : ''}`}
              >
                <div className="flex justify-between items-baseline flex-wrap mb-1">
                  <h3 className="text-base font-medium">{edu.degree}</h3>
                  <span className="text-gray-500 text-sm font-medium">{edu.duration}</span>
                </div>
                <p className="text-gray-700 font-medium mb-2">{edu.institution}</p>
                <div className="mt-2 text-gray-600 prose prose-sm max-w-none prose-p:mt-1 prose-p:mb-1">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {edu.description}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>
        )}

        {data.skills.length > 0 && (
          <div className="mb-5">
            <h2 
              className="text-lg font-semibold mb-4 pb-1 border-b" 
              style={{ color: styleOptions.primaryColor, borderColor: `${styleOptions.primaryColor}40` }}
            >
              Skills
            </h2>
            <div className={`flex flex-wrap gap-2.5 mt-4 ${styleOptions.layout === 'creative' ? 'justify-center' : ''}`}>
              {data.skills.map((skill, index) => (
                <span 
                  key={index} 
                  className={`px-3 py-1 rounded-full text-sm transition-all duration-200 hover:scale-105 ${
                    styleOptions.layout === 'executive' ? 'border border-current' : ''
                  }`}
                  style={{ 
                    backgroundColor: `${styleOptions.primaryColor}15`, 
                    color: styleOptions.primaryColor,
                    boxShadow: `0 0 0 1px ${styleOptions.primaryColor}30`
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
