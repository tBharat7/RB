import React from 'react';
import { StyleOptions } from '../types';

interface TemplateSelectorProps {
  onSelect: (template: string) => void;
  activeTemplate: string;
}

const templates = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, elegant design with refined spacing',
    color: 'sky'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional resume format suitable for most industries',
    color: 'indigo'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary layout with a professional look',
    color: 'emerald'
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated layout for senior positions',
    color: 'slate'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Distinctive design for creative industries',
    color: 'rose'
  }
];

// Helper function to get color values
const getColorValue = (colorName: string, shade: number): string => {
  const colorMap: Record<string, Record<number, string>> = {
    sky: {
      50: '#f0f9ff',
      200: '#bae6fd',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7'
    },
    indigo: {
      50: '#eef2ff',
      200: '#c7d2fe',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5'
    },
    emerald: {
      50: '#ecfdf5',
      200: '#a7f3d0',
      400: '#34d399',
      500: '#10b981',
      600: '#059669'
    },
    slate: {
      50: '#f8fafc',
      200: '#e2e8f0',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569'
    },
    rose: {
      50: '#fff1f2',
      200: '#fecdd3',
      400: '#fb7185',
      500: '#f43f5e',
      600: '#e11d48'
    }
  };
  
  return colorMap[colorName]?.[shade] || '#e2e8f0'; // Default to slate-200 if color not found
};

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect, activeTemplate }) => {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-extralight text-slate-700 mb-6">Choose a Template</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {templates.map((template) => {
          const isActive = activeTemplate === template.id;
          const colorValues = {
            main: getColorValue(template.color, 500),
            light: getColorValue(template.color, 200),
            bg: getColorValue(template.color, 50),
            text: getColorValue(template.color, 500),
            gradient1: getColorValue(template.color, 500),
            gradient2: getColorValue(template.color, 600)
          };
          
          return (
            <div
              key={template.id}
              className={`group border rounded-xl p-5 cursor-pointer transition-all duration-300 ${
                isActive 
                  ? 'shadow-md' 
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
              style={{
                borderColor: isActive ? colorValues.light : undefined,
                backgroundColor: isActive ? colorValues.bg : undefined
              }}
              onClick={() => onSelect(template.id)}
            >
              <div 
                className="h-24 mb-4 rounded-lg flex items-center justify-center bg-white border border-slate-100 overflow-hidden relative"
                style={{
                  backgroundImage: `url(/templates/${template.id}.svg)`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderColor: isActive ? colorValues.light : undefined
                }}
              >
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${colorValues.gradient1}1a, ${colorValues.gradient2}33)`
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span 
                    className="text-xs font-medium z-10 bg-white/80 px-2 py-1 rounded-full"
                    style={{ color: colorValues.text }}
                  >
                    {template.name}
                  </span>
                </div>
              </div>
              <h3 className="font-medium text-slate-700 mb-1">{template.name}</h3>
              <p className="text-xs text-slate-500">{template.description}</p>
              {isActive && (
                <div 
                  className="mt-2 text-xs font-medium animate-fade-in"
                  style={{ color: colorValues.text }}
                >
                  Active template
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-5 text-xs text-slate-500">
        <p>Select a template to see it with sample data that best showcases its unique style.</p>
      </div>
    </div>
  );
};

export default TemplateSelector; 