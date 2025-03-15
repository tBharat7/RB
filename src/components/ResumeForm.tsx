import React, { useState } from 'react';
import { ResumeData } from '../types';
import { Plus, Minus, Briefcase, GraduationCap, Award, ArrowUp, ArrowDown, Linkedin, Info } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided, DropResult } from 'react-beautiful-dnd';

interface ResumeFormProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  showTips?: boolean;
  onImportLinkedIn?: () => void;
}

interface SectionConfig {
  id: string;
  title: string;
  icon: React.ReactNode;
  tip: string;
}

// Simplified to use only English
const sectionConfigs: Record<string, SectionConfig> = {
  personalInfo: {
    id: 'personalInfo',
    title: 'Personal Information',
    icon: <Info size={16} />,
    tip: 'Include contact details and a brief summary that highlights your key strengths and career objectives.'
  },
  experience: {
    id: 'experience',
    title: 'Work Experience',
    icon: <Briefcase size={16} />,
    tip: 'List your work history with the most recent position first. Focus on accomplishments and quantifiable results rather than just responsibilities.'
  },
  education: {
    id: 'education',
    title: 'Education',
    icon: <GraduationCap size={16} />,
    tip: 'Include degrees, certifications, and relevant courses. For recent graduates, this section can be more detailed than for experienced professionals.'
  },
  skills: {
    id: 'skills',
    title: 'Skills',
    icon: <Award size={16} />,
    tip: 'Include both technical skills and soft skills. Consider organizing them into categories if you have many.'
  }
};

export const ResumeForm: React.FC<ResumeFormProps> = ({ 
  data, 
  onChange, 
  showTips = false, 
  onImportLinkedIn = () => {} 
}) => {
  const [sectionOrder, setSectionOrder] = useState(['personalInfo', 'experience', 'education', 'skills']);
  const [activeSection, setActiveSection] = useState<string>('personalInfo');

  const updatePersonalInfo = (field: string, value: string) => {
    onChange({
      ...data,
      personalInfo: { ...data.personalInfo, [field]: value },
    });
  };

  const addExperience = () => {
    onChange({
      ...data,
      experience: [
        ...data.experience,
        { company: '', position: '', duration: '', description: '' },
      ],
    });
  };

  const updateExperience = (index: number, field: string, value: string) => {
    const newExperience = [...data.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    onChange({ ...data, experience: newExperience });
  };

  const removeExperience = (index: number) => {
    onChange({
      ...data,
      experience: data.experience.filter((_, i: number) => i !== index),
    });
  };

  const addEducation = () => {
    onChange({
      ...data,
      education: [
        ...data.education,
        { institution: '', degree: '', duration: '', description: '' },
      ],
    });
  };

  const updateEducation = (index: number, field: string, value: string) => {
    const newEducation = [...data.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    onChange({ ...data, education: newEducation });
  };

  const removeEducation = (index: number) => {
    onChange({
      ...data,
      education: data.education.filter((_, i: number) => i !== index),
    });
  };

  const addSkill = () => {
    onChange({
      ...data,
      skills: [...data.skills, ''],
    });
  };

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...data.skills];
    newSkills[index] = value;
    onChange({ ...data, skills: newSkills });
  };

  const removeSkill = (index: number) => {
    onChange({
      ...data,
      skills: data.skills.filter((_, i: number) => i !== index),
    });
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(sectionOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setSectionOrder(items);
  };

  const moveSectionUp = (sectionId: string) => {
    const index = sectionOrder.indexOf(sectionId);
    if (index > 0) {
      const newOrder = [...sectionOrder];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      setSectionOrder(newOrder);
    }
  };

  const moveSectionDown = (sectionId: string) => {
    const index = sectionOrder.indexOf(sectionId);
    if (index < sectionOrder.length - 1) {
      const newOrder = [...sectionOrder];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      setSectionOrder(newOrder);
    }
  };

  const renderSectionContent = (sectionId: string) => {
    const section = sectionConfigs[sectionId];
    if (!section) return null;
    
    switch (sectionId) {
      case 'personalInfo':
        return (
          <div className="space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Full Name</label>
                <input
                  type="text"
                  value={data.personalInfo.name}
                  onChange={(e) => updatePersonalInfo('name', e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Job Title</label>
                <input
                  type="text"
                  value={data.personalInfo.title}
                  onChange={(e) => updatePersonalInfo('title', e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                  placeholder="Software Engineer"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Email</label>
                <input
                  type="email"
                  value={data.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                  placeholder="johndoe@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-2">Phone</label>
                <input
                  type="tel"
                  value={data.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Location</label>
              <input
                type="text"
                value={data.personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                placeholder="New York, NY"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Summary</label>
              <textarea
                value={data.personalInfo.summary}
                onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent h-32 resize-none transition duration-200"
                placeholder="A brief summary of your professional background and career objectives..."
              />
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-8 animate-fade-in">
            {data.experience.map((job, index) => (
              <div key={index} className="p-5 border border-slate-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-slate-700">Experience #{index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeExperience(index)}
                    className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-full transition-colors duration-200"
                    aria-label="Remove experience"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Company</label>
                    <input
                      type="text"
                      value={job.company}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                      placeholder="Company Name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Position</label>
                    <input
                      type="text"
                      value={job.position}
                      onChange={(e) => updateExperience(index, 'position', e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                      placeholder="Job Title"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-600 mb-2">Date</label>
                  <input
                    type="text"
                    value={job.duration}
                    onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                    placeholder="Jan 2020 - Present"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Description</label>
                  <textarea
                    value={job.description}
                    onChange={(e) => updateExperience(index, 'description', e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent h-32 resize-none transition duration-200"
                    placeholder="Describe your responsibilities and achievements..."
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addExperience}
              className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition-colors duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Experience
            </button>
          </div>
        );

      case 'education':
        return (
          <div className="space-y-8 animate-fade-in">
            {data.education.map((edu, index) => (
              <div key={index} className="p-5 border border-slate-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-slate-700">Education #{index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeEducation(index)}
                    className="text-rose-500 hover:bg-rose-50 p-1.5 rounded-full transition-colors duration-200"
                    aria-label="Remove education"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                      placeholder="University Name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-2">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                      placeholder="Bachelor of Science"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-600 mb-2">Date</label>
                  <input
                    type="text"
                    value={edu.duration}
                    onChange={(e) => updateEducation(index, 'duration', e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                    placeholder="2016 - 2020"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">Description</label>
                  <textarea
                    value={edu.description}
                    onChange={(e) => updateEducation(index, 'description', e.target.value)}
                    className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent h-32 resize-none transition duration-200"
                    placeholder="Describe your achievements, courses, etc..."
                  />
                </div>
              </div>
            ))}
            
            <button
              type="button"
              onClick={addEducation}
              className="w-full py-3 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition-colors duration-200 flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Education
            </button>
          </div>
        );

      case 'skills':
        return (
          <div className="space-y-5 animate-fade-in">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Skills (separate with commas)</label>
              <textarea
                value={data.skills.join(', ')}
                onChange={(e) => {
                  const skillsArray = e.target.value.split(',').map(skill => skill.trim()).filter(Boolean);
                  onChange({
                    ...data,
                    skills: skillsArray,
                  });
                }}
                className="w-full p-3 border border-slate-200 rounded-lg shadow-sm focus:ring-2 focus:ring-sky-500 focus:border-transparent h-32 resize-none transition duration-200"
                placeholder="JavaScript, React, TypeScript, Node.js, HTML, CSS"
              />
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              {data.skills.map((skill, index) => (
                <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-sky-100 text-sky-800">
                  {skill}
                  <button
                    type="button"
                    onClick={() => {
                      const newSkills = [...data.skills];
                      newSkills.splice(index, 1);
                      onChange({
                        ...data,
                        skills: newSkills,
                      });
                    }}
                    className="ml-1.5 text-sky-500 hover:text-sky-700"
                    aria-label="Remove skill"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm divide-y divide-slate-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium text-slate-700">Resume Information</h2>
        <button
          onClick={onImportLinkedIn}
          className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-sky-600 transition-colors"
        >
          <Linkedin size={16} /> Import from LinkedIn
        </button>
      </div>
      
      <div className="py-4">
        <h3 className="flex items-center gap-2 text-slate-700 mb-4">
          {sectionConfigs['personalInfo'].icon}
          <span>{sectionConfigs['personalInfo'].title}</span>
        </h3>
        
        {showTips && (
          <div className="bg-sky-50 text-sky-800 p-3 rounded-lg mb-4 text-sm">
            <p>{sectionConfigs['personalInfo'].tip}</p>
          </div>
        )}
        
        {renderSectionContent('personalInfo')}
      </div>
      
      {sectionOrder.filter(s => s !== 'personalInfo').map((sectionId) => {
        const section = sectionConfigs[sectionId];
        if (!section) return null;
        
        const isActive = activeSection === sectionId;
        
        return (
          <div key={sectionId} className="py-4">
            <div
              className="flex justify-between items-center gap-2 mb-4 cursor-pointer"
              onClick={() => setActiveSection(isActive ? '' : sectionId)}
            >
              <h3 className="flex items-center gap-2 text-slate-700">
                {section.icon}
                <span>{section.title}</span>
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSectionUp(sectionId);
                  }}
                  disabled={sectionOrder.indexOf(sectionId) <= 1}
                  className={`p-1 rounded-md ${
                    sectionOrder.indexOf(sectionId) <= 1
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveSectionDown(sectionId);
                  }}
                  disabled={sectionOrder.indexOf(sectionId) >= sectionOrder.length - 1}
                  className={`p-1 rounded-md ${
                    sectionOrder.indexOf(sectionId) >= sectionOrder.length - 1
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <ArrowDown size={16} />
                </button>
              </div>
            </div>
            
            {showTips && (
              <div className={`bg-sky-50 text-sky-800 p-3 rounded-lg mb-4 text-sm ${isActive ? 'block' : 'hidden'}`}>
                <p>{section.tip}</p>
              </div>
            )}
            
            <div className={isActive ? 'block' : 'hidden'}>
              {renderSectionContent(sectionId)}
            </div>
          </div>
        );
      })}
    </div>
  );
};