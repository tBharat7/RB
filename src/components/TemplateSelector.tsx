import React, { useState } from 'react';
import { StyleOptions } from '../types';
import { Check, FileText, Info } from 'lucide-react';

interface TemplateSelectorProps {
  onSelect: (template: string) => void;
  activeTemplate: string;
  onLoadSampleData?: (template: string) => void;
}

const templates = [
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Clean, elegant design with refined spacing',
    color: '#0ea5e9', // sky-500
    bestFor: 'Tech, startups, and modern industries'
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional resume format suitable for most industries',
    color: '#6366f1', // indigo-500
    bestFor: 'Corporate roles, banking, and traditional industries'
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Contemporary layout with a professional look',
    color: '#10b981', // emerald-500
    bestFor: 'Marketing, design, and business roles'
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Sophisticated layout for senior positions',
    color: '#64748b', // slate-500
    bestFor: 'Leadership roles, C-suite positions, and senior management'
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Distinctive design for creative industries',
    color: '#f43f5e', // rose-500
    bestFor: 'Design, arts, media, and entertainment roles'
  }
];

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ 
  onSelect, 
  activeTemplate,
  onLoadSampleData 
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  
  const activeTemplateData = templates.find(t => t.id === activeTemplate);
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium text-slate-700">Template</h2>
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className={`p-1 rounded-full transition-colors ${
              showInfo ? 'bg-sky-100 text-sky-600' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
            aria-label={showInfo ? "Hide template information" : "Show template information"}
          >
            <Info size={14} />
          </button>
        </div>
        
        {onLoadSampleData && (
          <button
            onClick={() => onLoadSampleData(activeTemplate)}
            className="text-xs px-2 py-1 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded flex items-center gap-1 transition-colors"
            title="Load sample data for this template"
          >
            <FileText size={10} />
            <span>Sample Data</span>
          </button>
        )}
      </div>
      
      {/* Template info panel */}
      {showInfo && activeTemplateData && (
        <div className="mb-4 p-3 bg-slate-50 rounded-md border border-slate-100">
          <h3 className="text-sm font-medium text-slate-700 mb-1">{activeTemplateData.name}</h3>
          <p className="text-xs text-slate-600 mb-2">{activeTemplateData.description}</p>
          <div className="flex items-center gap-1 text-xs">
            <span className="font-medium text-slate-600">Best for:</span>
            <span className="text-slate-500">{activeTemplateData.bestFor}</span>
          </div>
        </div>
      )}
      
      <div className="flex overflow-x-auto pb-1 no-scrollbar space-x-3">
        {templates.map((template) => {
          const isActive = activeTemplate === template.id;
          const isHovered = hoveredTemplate === template.id;
          
          return (
            <button
              key={template.id}
              onClick={() => onSelect(template.id)}
              onMouseEnter={() => setHoveredTemplate(template.id)}
              onMouseLeave={() => setHoveredTemplate(null)}
              className={`flex-shrink-0 group focus:outline-none ${isActive ? 'z-10' : ''}`}
              aria-pressed={isActive}
            >
              <div className="flex flex-col items-center">
                <div 
                  className={`
                    w-16 h-16 relative rounded border transition-all duration-200
                    ${isActive 
                      ? 'shadow-md' 
                      : isHovered
                        ? 'border-slate-200 shadow-sm'
                        : 'border-slate-100 group-hover:border-slate-200'
                    }
                  `}
                  style={{
                    borderColor: isActive ? template.color : undefined,
                    backgroundColor: isActive ? `${template.color}10` : undefined,
                    transform: isActive ? 'scale(1.05)' : undefined
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
                  className={`mt-1.5 text-xs transition-colors duration-200 ${
                    isActive ? 'text-slate-800 font-medium' : 'text-slate-500 group-hover:text-slate-700'
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
