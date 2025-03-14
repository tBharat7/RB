import React from 'react';
import { PresetLayout, StyleOptions } from '../types';
import { presetLayouts } from '../layouts/presets';

interface LayoutSelectorProps {
  onSelect: (style: StyleOptions) => void;
}

export const LayoutSelector: React.FC<LayoutSelectorProps> = ({ onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {presetLayouts.map((preset) => (
        <div
          key={preset.name}
          className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
          onClick={() => onSelect(preset.style)}
        >
          <img
            src={preset.preview}
            alt={`${preset.name} layout`}
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900">{preset.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {preset.style.fontFamily} • {preset.style.fontSize}
            </p>
            <div
              className="w-full h-2 mt-2 rounded"
              style={{ backgroundColor: preset.style.primaryColor }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};