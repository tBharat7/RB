import mongoose from 'mongoose';

const resumeSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    resumeData: {
      type: Object,
      required: true,
      default: {
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
    },
    styleOptions: {
      type: Object,
      required: true,
      default: {
        layout: 'minimal',
        primaryColor: '#0ea5e9',
        fontFamily: 'sans',
        fontSize: 'base',
      },
    },
    lastSaved: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume; 