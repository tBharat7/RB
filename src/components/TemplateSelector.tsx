import React from 'react';
import { StyleOptions } from '../types';
import { Check } from 'lucide-react';

interface TemplateSelectorProps {
  onSelect: (template: string) => void;
  activeTemplate: string;
}

const templates = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, elegant design with refined spacing',
    color: '#0ea5e9' // sky-500
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional resume format suitable for most industries',
    color: '#6366f1' // indigo-500
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary layout with a professional look',
    color: '#10b981' // emerald-500
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated layout for senior positions',
    color: '#64748b' // slate-500
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Distinctive design for creative industries',
    color: '#f43f5e' // rose-500
  }
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ onSelect, activeTemplate }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-medium text-slate-700">Template</h2>
        <div className="text-xs text-slate-500">Select a template style</div>
      </div>
      
      <div className="flex overflow-x-auto pb-2 scrollbar-hide space-x-3">
        {templates.map((template) => {
          const isActive = activeTemplate === template.id;
          
          return (
            <button
              key={template.id}
              onClick={() => onSelect(template.id)}
              className={`flex-shrink-0 group focus:outline-none ${isActive ? 'z-10' : ''}`}
              aria-pressed={isActive}
            >
              <div className="flex flex-col items-center">
                <div 
                  className={`
                    w-16 h-16 relative rounded-lg border transition-all duration-200
                    ${isActive 
                      ? 'shadow-md' 
                      : 'border-slate-200 group-hover:border-slate-300 group-hover:shadow-sm'
                    }
                  `}
                  style={{
                    borderColor: isActive ? template.color : undefined,
                    backgroundColor: isActive ? `${template.color}10` : undefined
                  }}
                >
                  {/* Template preview image */}
                  <div 
                    className="absolute inset-0 m-1 rounded"
                    style={{
                      backgroundImage: `url(/templates/${template.id}.svg)`,
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  ></div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div 
                      className="absolute -right-1 -top-1 rounded-full w-5 h-5 flex items-center justify-center"
                      style={{ backgroundColor: template.color }}
                    >
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </div>
                
                {/* Template name */}
                <span 
                  className={`mt-2 text-xs font-medium transition-colors duration-200 ${
                    isActive ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-900'
                  }`}
                >
                  {template.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TemplateSelector; 