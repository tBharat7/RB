import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ResumeData, StyleOptions } from '../types';

interface ResumePreviewProps {
  data: ResumeData;
  styleOptions: StyleOptions;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, styleOptions }) => {
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
        return 'max-w-4xl mx-auto p-8 bg-white';
      case 'minimal':
        return 'max-w-3xl mx-auto p-6 bg-white';
      case 'executive':
        return 'max-w-5xl mx-auto p-10 bg-white border-t-8';
      case 'creative':
        return 'max-w-4xl mx-auto p-8 bg-white rounded-xl';
      default: // modern
        return 'max-w-4xl mx-auto p-8 bg-white shadow-lg';
    }
  };

  return (
    <div 
      className={`${getLayoutClasses()} ${getFontClass()} ${getFontSizeClass()}`}
      style={{ 
        '--primary-color': styleOptions.primaryColor,
        borderColor: styleOptions.layout === 'executive' ? styleOptions.primaryColor : undefined,
      } as React.CSSProperties}
    >
      <div className={`mb-8 ${styleOptions.layout === 'minimal' ? '' : 'text-center'}`}>
        <h1 
          className="text-3xl font-bold" 
          style={{ color: styleOptions.primaryColor }}
        >
          {data.personalInfo.name}
        </h1>
        {data.personalInfo.title && (
          <p className="text-xl text-gray-700 mt-1">{data.personalInfo.title}</p>
        )}
        <div className="mt-2 text-gray-600">
          <p>{data.personalInfo.email} • {data.personalInfo.phone}</p>
          <p>{data.personalInfo.location}</p>
        </div>
      </div>

      <div className="mb-6">
        <h2 
          className="text-xl font-semibold mb-2" 
          style={{ color: styleOptions.primaryColor }}
        >
          Professional Summary
        </h2>
        <p className="text-gray-700">{data.personalInfo.summary}</p>
      </div>

      <div className="mb-6">
        <h2 
          className="text-xl font-semibold mb-4" 
          style={{ color: styleOptions.primaryColor }}
        >
          Work Experience
        </h2>
        {data.experience.map((exp, index) => (
          <div 
            key={index} 
            className={`mb-4 ${styleOptions.layout === 'creative' ? 'p-4 bg-gray-50 rounded-lg' : ''}`}
          >
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold">{exp.position}</h3>
              <span className="text-gray-600">{exp.duration}</span>
            </div>
            <p className="text-gray-700 font-semibold">{exp.company}</p>
            <div className="mt-2 text-gray-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {exp.description}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 
          className="text-xl font-semibold mb-4" 
          style={{ color: styleOptions.primaryColor }}
        >
          Education
        </h2>
        {data.education.map((edu, index) => (
          <div 
            key={index} 
            className={`mb-4 ${styleOptions.layout === 'creative' ? 'p-4 bg-gray-50 rounded-lg' : ''}`}
          >
            <div className="flex justify-between items-baseline">
              <h3 className="text-lg font-semibold">{edu.degree}</h3>
              <span className="text-gray-600">{edu.duration}</span>
            </div>
            <p className="text-gray-700 font-semibold">{edu.institution}</p>
            <div className="mt-2 text-gray-700">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {edu.description}
              </ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <h2 
          className="text-xl font-semibold mb-4" 
          style={{ color: styleOptions.primaryColor }}
        >
          Skills
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, index) => (
            <span 
              key={index} 
              className="px-3 py-1 rounded-full text-sm"
              style={{ 
                backgroundColor: `${styleOptions.primaryColor}20`, 
                color: styleOptions.primaryColor 
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
