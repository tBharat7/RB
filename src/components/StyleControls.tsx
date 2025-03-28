import React from 'react';
import { StyleOptions } from '../types';
import { Palette, Type, Text } from 'lucide-react';

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
    <div>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-medium text-slate-700">Style</h2>
      </div>
      
      <div className="space-y-4">
        {/* Color selector */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Palette size={12} className="text-slate-400" />
            <label className="text-xs text-slate-500">Color</label>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {colorPalette.map((color) => (
              <button
                key={color.value}
                className={`w-6 h-6 rounded-full transition-all duration-200 ${
                  options.primaryColor === color.value 
                    ? 'ring-1 ring-offset-1' 
                    : 'hover:scale-105'
                }`}
                style={{ 
                  backgroundColor: color.value,
                  boxShadow: options.primaryColor === color.value ? `0 0 0 1px white, 0 0 0 1px ${color.value}` : 'none'
                }}
                onClick={() => handleChange('primaryColor', color.value)}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Font Family selector */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Type size={12} className="text-slate-400" />
            <label className="text-xs text-slate-500">Font</label>
          </div>
          <div className="flex gap-1.5">
            <button
              className={`px-2.5 py-1 text-xs rounded transition-all duration-200 ${
                options.fontFamily === 'sans'
                  ? 'bg-slate-100 text-slate-700'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
              onClick={() => handleChange('fontFamily', 'sans')}
            >
              <span className="font-sans">Sans</span>
            </button>
            <button
              className={`px-2.5 py-1 text-xs rounded transition-all duration-200 ${
                options.fontFamily === 'serif'
                  ? 'bg-slate-100 text-slate-700'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
              onClick={() => handleChange('fontFamily', 'serif')}
            >
              <span className="font-serif">Serif</span>
            </button>
            <button
              className={`px-2.5 py-1 text-xs rounded transition-all duration-200 ${
                options.fontFamily === 'mono'
                  ? 'bg-slate-100 text-slate-700'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
              onClick={() => handleChange('fontFamily', 'mono')}
            >
              <span className="font-mono">Mono</span>
            </button>
          </div>
        </div>

        {/* Font Size selector */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Text size={12} className="text-slate-400" />
            <label className="text-xs text-slate-500">Size</label>
          </div>
          <div className="flex gap-1.5">
            <button
              className={`px-2.5 py-1 text-xs rounded transition-all duration-200 ${
                options.fontSize === 'sm'
                  ? 'bg-slate-100 text-slate-700'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
              onClick={() => handleChange('fontSize', 'sm')}
            >
              Small
            </button>
            <button
              className={`px-2.5 py-1 text-xs rounded transition-all duration-200 ${
                options.fontSize === 'base'
                  ? 'bg-slate-100 text-slate-700'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
              onClick={() => handleChange('fontSize', 'base')}
            >
              Medium
            </button>
            <button
              className={`px-2.5 py-1 text-xs rounded transition-all duration-200 ${
                options.fontSize === 'lg'
                  ? 'bg-slate-100 text-slate-700'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
              onClick={() => handleChange('fontSize', 'lg')}
            >
              Large
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
