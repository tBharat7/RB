import asyncHandler from 'express-async-handler';
import Resume from '../models/resumeModel.js';

// @desc    Create/update a user's resume
// @route   POST /api/resumes
// @access  Private
const saveResume = asyncHandler(async (req, res) => {
  const { resumeData, styleOptions } = req.body;

  // Find if user already has a resume
  let resume = await Resume.findOne({ user: req.user._id });

  if (resume) {
    // Update existing resume
    resume.resumeData = resumeData;
    resume.styleOptions = styleOptions;
    resume.lastSaved = Date.now();

    const updatedResume = await resume.save();
    res.json(updatedResume);
  } else {
    // Create new resume
    resume = await Resume.create({
      user: req.user._id,
      resumeData,
      styleOptions,
    });

    res.status(201).json(resume);
  }
});

// @desc    Update an existing resume (for auto-save)
// @route   PATCH /api/resumes
// @access  Private
const updateResume = asyncHandler(async (req, res) => {
  const { resumeData, styleOptions } = req.body;

  // Find user's resume
  const resume = await Resume.findOne({ user: req.user._id });

  if (!resume) {
    res.status(404);
    throw new Error('Resume not found. Create a resume first before updating.');
  }

  // Update existing resume
  resume.resumeData = resumeData;
  resume.styleOptions = styleOptions;
  resume.lastSaved = Date.now();

  const updatedResume = await resume.save();
  res.json(updatedResume);
});

// @desc    Get logged in user's resume
// @route   GET /api/resumes
// @access  Private
const getResume = asyncHandler(async (req, res) => {
  const resume = await Resume.findOne({ user: req.user._id });

  if (resume) {
    res.json(resume);
  } else {
    // If no resume exists, return empty default data
    res.json({
      resumeData: {
        personalInfo: {
          name: '',
          title: '',
          email: '',
          phone: '',
          location: '',
          summary: '',
        },
        experience: [],
        education: [],
        skills: [],
      },
      styleOptions: {
        layout: 'minimal',
        primaryColor: '#0ea5e9',
        fontFamily: 'sans',
        fontSize: 'base',
      },
      lastSaved: null,
    });
  }
});

export { saveResume, updateResume, getResume }; 