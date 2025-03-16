import React, { useState } from 'react';
import { ResumeData } from '../types';
import { Plus, Minus, Briefcase, GraduationCap, Award, ArrowUp, ArrowDown, Linkedin, Info, ChevronDown, ChevronRight } from 'lucide-react';
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
    icon: <Info size={14} />,
    tip: 'Include contact details and a brief summary that highlights your key strengths and career objectives.'
  },
  experience: {
    id: 'experience',
    title: 'Work Experience',
    icon: <Briefcase size={14} />,
    tip: 'List your work history with the most recent position first. Focus on accomplishments and quantifiable results rather than just responsibilities.'
  },
  education: {
    id: 'education',
    title: 'Education',
    icon: <GraduationCap size={14} />,
    tip: 'Include degrees, certifications, and relevant courses. For recent graduates, this section can be more detailed than for experienced professionals.'
  },
  skills: {
    id: 'skills',
    title: 'Skills',
    icon: <Award size={14} />,
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
  const [activeTab, setActiveTab] = useState<string>('personalInfo');

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
          <div className="space-y-5 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={data.personalInfo.name}
                  onChange={(e) => updatePersonalInfo('name', e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Job Title</label>
                <input
                  type="text"
                  value={data.personalInfo.title}
                  onChange={(e) => updatePersonalInfo('title', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors duration-200"
                  placeholder="Software Engineer"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  value={data.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors duration-200"
                  placeholder="johndoe@example.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                <input
                  type="tel"
                  value={data.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors duration-200"
                  placeholder="(123) 456-7890"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Location</label>
              <input
                type="text"
                value={data.personalInfo.location}
                onChange={(e) => updatePersonalInfo('location', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors duration-200"
                placeholder="New York, NY"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Summary</label>
              <textarea
                value={data.personalInfo.summary}
                onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 h-28 resize-none transition-colors duration-200"
                placeholder="A brief summary of your professional background and career objectives..."
              />
            </div>
          </div>
        );

      case 'experience':
        return (
          <div className="space-y-6 animate-fade-in">
            {data.experience.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-lg border border-slate-100 border-dashed">
                <Briefcase size={30} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-600 font-medium">No work experience added yet</p>
                <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">Add your professional experience to showcase your career journey and achievements.</p>
                <button
                  type="button"
                  onClick={addExperience}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-sky-50 border border-sky-100 rounded-md text-sky-600 hover:bg-sky-100 transition-colors duration-200"
                >
                  <Plus size={16} className="mr-1.5" />
                  Add Work Experience
                </button>
              </div>
            ) : (
              data.experience.map((job, index) => (
                <div key={index} className="p-5 border border-slate-200 rounded-lg bg-white shadow-sm hover:shadow transition-all duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-medium text-slate-800 flex items-center">
                      <Briefcase size={15} className="mr-2 text-sky-500" />
                      <span>Position #{index + 1}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-full hover:bg-slate-100 transition-all duration-200"
                      aria-label="Remove experience"
                    >
                      <Minus size={15} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center">
                        <Briefcase size={13} className="mr-1.5 text-slate-400" />
                        Company
                      </label>
                      <input
                        type="text"
                        value={job.company}
                        onChange={(e) => updateExperience(index, 'company', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors duration-200"
                        placeholder="Company Name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Position</label>
                      <input
                        type="text"
                        value={job.position}
                        onChange={(e) => updateExperience(index, 'position', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors duration-200"
                        placeholder="Job Title"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
                    <input
                      type="text"
                      value={job.duration}
                      onChange={(e) => updateExperience(index, 'duration', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors duration-200"
                      placeholder="Jan 2020 - Present"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                    <textarea
                      value={job.description}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 h-28 resize-none transition-colors duration-200"
                      placeholder="Describe your responsibilities and achievements..."
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case 'education':
        return (
          <div className="space-y-6 animate-fade-in">
            {data.education.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-lg border border-slate-100 border-dashed">
                <GraduationCap size={30} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-600 font-medium">No education added yet</p>
                <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">Add your educational background to highlight your academic qualifications.</p>
                <button
                  type="button"
                  onClick={addEducation}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-sky-50 border border-sky-100 rounded-md text-sky-600 hover:bg-sky-100 transition-colors duration-200"
                >
                  <Plus size={16} className="mr-1.5" />
                  Add Education
                </button>
              </div>
            ) : (
              data.education.map((edu, index) => (
                <div key={index} className="p-5 border border-slate-200 rounded-lg bg-white shadow-sm hover:shadow transition-all duration-200">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-medium text-slate-800 flex items-center">
                      <GraduationCap size={15} className="mr-2 text-sky-500" />
                      <span>Education #{index + 1}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      className="text-slate-400 hover:text-rose-500 p-1 rounded-full hover:bg-slate-100 transition-all duration-200"
                      aria-label="Remove education"
                    >
                      <Minus size={15} />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5 flex items-center">
                        <GraduationCap size={13} className="mr-1.5 text-slate-400" />
                        Institution
                      </label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors duration-200"
                        placeholder="University or School Name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">Degree</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors duration-200"
                        placeholder="Bachelor of Science, Certification, etc."
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Date</label>
                    <input
                      type="text"
                      value={edu.duration}
                      onChange={(e) => updateEducation(index, 'duration', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors duration-200"
                      placeholder="2016 - 2020"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">Description</label>
                    <textarea
                      value={edu.description}
                      onChange={(e) => updateEducation(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 h-28 resize-none transition-colors duration-200"
                      placeholder="Describe your studies, achievements, GPA, etc."
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        );

      case 'skills':
        return (
          <div className="animate-fade-in">
            {data.skills.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-lg border border-slate-100 border-dashed">
                <Award size={30} className="mx-auto text-slate-300 mb-3" />
                <p className="text-slate-600 font-medium">No skills added yet</p>
                <p className="text-slate-400 text-sm mt-1 max-w-md mx-auto">Add your key skills to showcase your expertise and strengths to potential employers.</p>
                <div className="mt-4 max-w-md mx-auto">
                  <div className="flex">
                    <input
                      type="text"
                      id="newSkill"
                      placeholder="e.g. JavaScript, Project Management, etc."
                      className="flex-grow px-3 py-2 border border-slate-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors duration-200"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            addSkill();
                            updateSkill(data.skills.length, input.value.trim());
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('newSkill') as HTMLInputElement;
                        if (input.value.trim()) {
                          addSkill();
                          updateSkill(data.skills.length, input.value.trim());
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-sky-500 text-white rounded-r-md hover:bg-sky-600 transition-colors duration-200"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5 text-left">Press Enter after typing to add a skill</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-2.5 p-4 bg-slate-50 rounded-md border border-slate-100">
                  {data.skills.length > 0 ? (
                    data.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="inline-flex items-center bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm hover:shadow transition-all duration-200 group"
                      >
                        <span className="text-slate-700 text-sm font-medium mr-2">{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(index)}
                          className="text-slate-400 hover:text-rose-500 transition-colors"
                          aria-label="Remove skill"
                        >
                          <Minus size={14} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400 text-sm py-2">Add your first skill below</p>
                  )}
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Plus size={14} className="mr-1.5 text-sky-500" />
                    Add a New Skill
                  </label>
                  <div className="flex shadow-sm">
                    <input
                      type="text"
                      id="newSkill"
                      placeholder="e.g. JavaScript, Project Management, etc."
                      className="flex-grow px-3 py-2 border border-slate-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400 transition-colors duration-200"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const input = e.target as HTMLInputElement;
                          if (input.value.trim()) {
                            addSkill();
                            updateSkill(data.skills.length, input.value.trim());
                            input.value = '';
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.getElementById('newSkill') as HTMLInputElement;
                        if (input.value.trim()) {
                          addSkill();
                          updateSkill(data.skills.length, input.value.trim());
                          input.value = '';
                        }
                      }}
                      className="px-4 py-2 bg-sky-500 text-white rounded-r-md hover:bg-sky-600 transition-colors duration-200"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-1.5">Press Enter after typing to add a skill</p>
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  // Section tabs navigation
  const handleTabClick = (sectionId: string) => {
    setActiveTab(sectionId);
    setActiveSection(sectionId);
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center border-b border-slate-200 pb-3">
        <h2 className="text-lg font-semibold text-slate-800">Resume Information</h2>
        <button
          onClick={onImportLinkedIn}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md text-sky-600 bg-sky-50 hover:bg-sky-100 transition-colors border border-sky-100"
        >
          <Linkedin size={14} /> Import from LinkedIn
        </button>
      </div>
      
      {/* Enhanced Section tabs */}
      <div className="flex overflow-x-auto no-scrollbar border-b border-slate-100 mb-6">
        {sectionOrder.map((sectionId) => (
          <button
            key={sectionId}
            className={`mr-8 py-2 px-1 transition-all duration-200 relative ${
              activeTab === sectionId 
                ? 'text-sky-600' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
            onClick={() => handleTabClick(sectionId)}
          >
            <span className="flex items-center gap-2 whitespace-nowrap">
              {sectionConfigs[sectionId].icon}
              <span className="text-xs font-medium">
                {sectionId === 'personalInfo' ? 'Personal' : 
                 sectionId === 'experience' ? 'Experience' : 
                 sectionId === 'education' ? 'Education' : 'Skills'}
              </span>
            </span>
            {activeTab === sectionId && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-sky-500 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Active section content */}
      <div className="p-5 bg-white rounded-lg border border-slate-200 shadow-sm">
        {/* Section title with collapsible toggle */}
        <div
          className="flex justify-between items-center border-b border-slate-200 pb-3 mb-5 cursor-pointer group"
          onClick={() => setActiveSection(activeSection === activeTab ? '' : activeTab)}
        >
          <h3 className="flex items-center gap-2 text-slate-800 font-medium">
            {sectionConfigs[activeTab].icon}
            <span>{sectionConfigs[activeTab].title}</span>
          </h3>
          <div className="flex items-center h-6 w-6 justify-center rounded-full bg-slate-50 group-hover:bg-slate-100 transition-colors">
            {activeSection === activeTab ? (
              <ChevronDown size={16} className="text-slate-500" />
            ) : (
              <ChevronRight size={16} className="text-slate-500" />
            )}
          </div>
        </div>
        
        {/* Section tips */}
        {showTips && activeSection === activeTab && (
          <div className="bg-sky-50 border border-sky-100 text-sky-800 p-3 rounded-md mb-5 text-xs flex items-start">
            <Info size={14} className="text-sky-500 mt-0.5 mr-2 flex-shrink-0" />
            <p>{sectionConfigs[activeTab].tip}</p>
          </div>
        )}
        
        {/* Section content */}
        <div className={activeSection === activeTab ? 'block' : 'hidden'}>
          {renderSectionContent(activeTab)}
        </div>
        
        {/* Add new item button for sections that support it */}
        {activeSection === activeTab && activeTab !== 'personalInfo' && (
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => {
                if (activeTab === 'experience') addExperience();
                if (activeTab === 'education') addEducation();
                if (activeTab === 'skills') addSkill();
              }}
              className="inline-flex items-center px-5 py-2.5 bg-sky-50 border border-sky-100 rounded-md text-sky-600 hover:bg-sky-100 transition-all duration-200 shadow-sm hover:shadow font-medium"
            >
              <Plus size={16} className="mr-1.5" />
              Add {activeTab === 'experience' ? 'Work Experience' : 
                   activeTab === 'education' ? 'Education' : 'Skill'}
            </button>
          </div>
        )}
      </div>

      {/* Custom CSS for hiding scrollbars is included in global styles */}
    </div>
  );
};