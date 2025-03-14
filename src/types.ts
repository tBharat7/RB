export interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
    title: string;
  };
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    duration: string;
    description: string;
  }[];
  skills: string[];
}

export interface StyleOptions {
  layout: 'modern' | 'classic' | 'minimal' | 'executive' | 'creative';
  primaryColor: string;
  fontFamily: string;
  fontSize: string;
}

export interface PresetLayout {
  name: string;
  preview: string;
  style: StyleOptions;
}