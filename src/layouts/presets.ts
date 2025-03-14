import { PresetLayout } from '../types';

export const presetLayouts: PresetLayout[] = [
  {
    name: 'Modern',
    preview: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=300&h=400',
    style: {
      layout: 'modern',
      primaryColor: '#2563eb',
      fontFamily: 'sans',
      fontSize: 'base'
    }
  },
  {
    name: 'Classic',
    preview: 'https://images.unsplash.com/photo-1574347635975-22f426aa4a5e?auto=format&fit=crop&q=80&w=300&h=400',
    style: {
      layout: 'classic',
      primaryColor: '#1e3a8a',
      fontFamily: 'serif',
      fontSize: 'base'
    }
  },
  {
    name: 'Minimal',
    preview: 'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?auto=format&fit=crop&q=80&w=300&h=400',
    style: {
      layout: 'minimal',
      primaryColor: '#18181b',
      fontFamily: 'sans',
      fontSize: 'sm'
    }
  },
  {
    name: 'Executive',
    preview: 'https://images.unsplash.com/photo-1586282391129-76a6df230234?auto=format&fit=crop&q=80&w=300&h=400',
    style: {
      layout: 'executive',
      primaryColor: '#374151',
      fontFamily: 'serif',
      fontSize: 'lg'
    }
  },
  {
    name: 'Creative',
    preview: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&q=80&w=300&h=400',
    style: {
      layout: 'creative',
      primaryColor: '#059669',
      fontFamily: 'sans',
      fontSize: 'base'
    }
  }
];