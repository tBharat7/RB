import React from 'react';
import { StyleOptions } from '../types';

interface StyleControlsProps {
  options: StyleOptions;
  onChange: (options: StyleOptions) => void;
}

export const StyleControls: React.FC<StyleControlsProps> = ({ options, onChange }) => {
  const colorPalette = [
    { name: 'Sky', value: '#0ea5e9' },
    { name: 'Indigo', value: '#6366f1' },
    { name: 'Emerald', value: '#10b981' },
    { name: 'Rose', value: '#f43f5e' },
    { name: 'Amber', value: '#f59e0b' },
    { name: 'Violet', value: '#8b5cf6' },
    { name: 'Slate', value: '#475569' },
    { name: 'Teal', value: '#14b8a6' },
  ];

  const handleChange = (field: keyof StyleOptions, value: string) => {
    onChange({
      ...options,
      [field]: value,
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <h2 className="text-xl font-extralight text-slate-700 mb-6">Appearance Settings</h2>
      
      <div className="space-y-8">
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-4">Primary Color</label>
          <div className="flex flex-wrap gap-3">
            {colorPalette.map((color) => (
              <button
                key={color.value}
                className={`w-9 h-9 rounded-full transition-all duration-200 ${
                  options.primaryColor === color.value 
                    ? 'ring-2 ring-offset-2 ring-slate-300 scale-110' 
                    : 'hover:scale-110'
                }`}
                style={{ 
                  backgroundColor: color.value,
                  boxShadow: options.primaryColor === color.value ? `0 0 0 2px white, 0 0 0 4px ${color.value}` : 'none'
                }}
                onClick={() => handleChange('primaryColor', color.value)}
                title={color.name}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-4">Font Family</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              className={`px-4 py-3 border text-sm rounded-lg transition-all duration-200 ${
                options.fontFamily === 'sans'
                  ? 'bg-sky-50 border-sky-200 text-sky-800 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:border-sky-200 hover:text-sky-600'
              }`}
              onClick={() => handleChange('fontFamily', 'sans')}
            >
              <span className="font-sans">Sans Serif</span>
            </button>
            <button
              className={`px-4 py-3 border text-sm rounded-lg transition-all duration-200 ${
                options.fontFamily === 'serif'
                  ? 'bg-sky-50 border-sky-200 text-sky-800 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:border-sky-200 hover:text-sky-600'
              }`}
              onClick={() => handleChange('fontFamily', 'serif')}
            >
              <span className="font-serif">Serif</span>
            </button>
            <button
              className={`px-4 py-3 border text-sm rounded-lg transition-all duration-200 ${
                options.fontFamily === 'mono'
                  ? 'bg-sky-50 border-sky-200 text-sky-800 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:border-sky-200 hover:text-sky-600'
              }`}
              onClick={() => handleChange('fontFamily', 'mono')}
            >
              <span className="font-mono">Monospace</span>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-4">Font Size</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              className={`px-4 py-3 border text-sm rounded-lg transition-all duration-200 ${
                options.fontSize === 'sm'
                  ? 'bg-sky-50 border-sky-200 text-sky-800 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:border-sky-200 hover:text-sky-600'
              }`}
              onClick={() => handleChange('fontSize', 'sm')}
            >
              <span className="text-sm">Small</span>
            </button>
            <button
              className={`px-4 py-3 border text-sm rounded-lg transition-all duration-200 ${
                options.fontSize === 'base'
                  ? 'bg-sky-50 border-sky-200 text-sky-800 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:border-sky-200 hover:text-sky-600'
              }`}
              onClick={() => handleChange('fontSize', 'base')}
            >
              <span className="text-base">Medium</span>
            </button>
            <button
              className={`px-4 py-3 border text-sm rounded-lg transition-all duration-200 ${
                options.fontSize === 'lg'
                  ? 'bg-sky-50 border-sky-200 text-sky-800 shadow-sm'
                  : 'border-slate-200 text-slate-600 hover:border-sky-200 hover:text-sky-600'
              }`}
              onClick={() => handleChange('fontSize', 'lg')}
            >
              <span className="text-lg">Large</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};