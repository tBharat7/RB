import { ResumeData } from '../types';

export const sampleResumeData: ResumeData = {
  personalInfo: {
    name: "Alex Morgan",
    title: "Senior Software Engineer",
    email: "alex.morgan@example.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    summary: "Experienced software engineer with a proven track record in developing scalable web applications and leading technical teams. Specialized in React, Node.js, and cloud architecture with a focus on delivering high-quality, user-centric solutions.",
  },
  experience: [
    {
      company: "TechCorp Solutions",
      position: "Senior Software Engineer",
      duration: "2020 - Present",
      description: "- Led development of a microservices-based e-commerce platform\n- Mentored junior developers and conducted code reviews\n- Implemented CI/CD pipelines reducing deployment time by 40%",
    },
    {
      company: "Innovation Labs",
      position: "Full Stack Developer",
      duration: "2018 - 2020",
      description: "- Developed and maintained multiple client-facing web applications\n- Collaborated with UX team to improve user experience\n- Reduced application load time by 60% through optimization",
    }
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "BS in Computer Science",
      duration: "2014 - 2018",
      description: "Focus on Software Engineering and Data Structures",
    }
  ],
  skills: [
    "JavaScript/TypeScript",
    "React",
    "Node.js",
    "AWS",
    "Docker",
    "GraphQL"
  ]
};

// Collection of sample data for different templates
export const templateSamples: { [key: string]: ResumeData } = {
  minimal: {
    personalInfo: {
      name: "Emma Johnson",
      title: "UX/UI Designer",
      email: "emma.johnson@example.com",
      phone: "(555) 987-6543",
      location: "Portland, OR",
      summary: "Creative UX/UI designer with 5+ years of experience crafting intuitive digital experiences. Passionate about user-centered design and accessibility. Proven track record of increasing user engagement and satisfaction through thoughtful design solutions.",
    },
    experience: [
      {
        company: "Design Forward Agency",
        position: "Senior UX Designer",
        duration: "2021 - Present",
        description: "- Redesigned client's e-commerce platform resulting in 35% increase in conversions\n- Led user research and testing for 5 major client projects\n- Mentored junior designers and established design system guidelines",
      },
      {
        company: "TechStart Inc.",
        position: "UI Designer",
        duration: "2018 - 2021",
        description: "- Created intuitive interfaces for mobile and web applications\n- Collaborated with development team to implement responsive designs\n- Conducted usability testing and iterated based on user feedback",
      }
    ],
    education: [
      {
        institution: "School of Visual Arts",
        degree: "BFA in Graphic Design",
        duration: "2014 - 2018",
        description: "Concentration in Digital Media and Interactive Design",
      }
    ],
    skills: [
      "UI/UX Design",
      "Figma",
      "Adobe Creative Suite",
      "Prototyping",
      "User Research",
      "Design Systems",
      "Accessibility"
    ]
  },
  
  classic: {
    personalInfo: {
      name: "Michael Chen",
      title: "Marketing Director",
      email: "michael.chen@example.com",
      phone: "(555) 234-5678",
      location: "Chicago, IL",
      summary: "Results-driven marketing professional with over 10 years of experience developing and executing comprehensive marketing strategies. Proven ability to increase brand awareness and drive revenue growth across diverse markets and industries.",
    },
    experience: [
      {
        company: "Global Brands Inc.",
        position: "Marketing Director",
        duration: "2019 - Present",
        description: "- Developed and executed marketing strategies resulting in 45% growth in market share\n- Managed $2M annual marketing budget and team of 8 marketing professionals\n- Launched successful rebranding initiative that increased brand recognition by 60%",
      },
      {
        company: "Innovative Marketing Group",
        position: "Senior Marketing Manager",
        duration: "2015 - 2019",
        description: "- Led digital marketing campaigns for Fortune 500 clients\n- Increased client ROI by an average of 30% through data-driven campaign optimization\n- Established social media strategies that doubled engagement metrics",
      },
      {
        company: "MarketWise Solutions",
        position: "Marketing Specialist",
        duration: "2012 - 2015",
        description: "- Executed multi-channel marketing campaigns for B2B clients\n- Analyzed campaign performance metrics to optimize future strategies\n- Collaborated with creative team to develop compelling content",
      }
    ],
    education: [
      {
        institution: "Northwestern University",
        degree: "MBA, Marketing",
        duration: "2010 - 2012",
        description: "Graduated with honors, Marketing Strategy focus",
      },
      {
        institution: "University of Illinois",
        degree: "BS in Business Administration",
        duration: "2006 - 2010",
        description: "Minor in Communications",
      }
    ],
    skills: [
      "Strategic Planning",
      "Brand Management",
      "Digital Marketing",
      "Market Research",
      "Team Leadership",
      "Budget Management",
      "Data Analytics"
    ]
  },
  
  modern: {
    personalInfo: {
      name: "Olivia Wilson",
      title: "Data Scientist",
      email: "olivia.wilson@example.com",
      phone: "(555) 345-6789",
      location: "Austin, TX",
      summary: "Innovative data scientist with expertise in machine learning, predictive modeling, and data visualization. Passionate about transforming complex datasets into actionable insights that drive business decisions and create measurable impact.",
    },
    experience: [
      {
        company: "TechData Analytics",
        position: "Senior Data Scientist",
        duration: "2020 - Present",
        description: "- Developed predictive models that increased customer retention by 25%\n- Created automated data pipelines reducing analysis time by 70%\n- Led team of 4 data analysts in developing comprehensive business intelligence solutions",
      },
      {
        company: "Insight AI",
        position: "Data Scientist",
        duration: "2018 - 2020",
        description: "- Built and deployed machine learning models for fraud detection\n- Implemented NLP solutions for customer sentiment analysis\n- Collaborated with product teams to integrate data-driven features",
      },
      {
        company: "QuantumMetrics",
        position: "Data Analyst",
        duration: "2016 - 2018",
        description: "- Analyzed customer behavior data to identify trends and opportunities\n- Created interactive dashboards for executive reporting\n- Optimized SQL queries improving database performance",
      }
    ],
    education: [
      {
        institution: "Stanford University",
        degree: "MS in Statistics",
        duration: "2014 - 2016",
        description: "Focus on Machine Learning and Computational Statistics",
      },
      {
        institution: "University of Texas",
        degree: "BS in Mathematics",
        duration: "2010 - 2014",
        description: "Minor in Computer Science",
      }
    ],
    skills: [
      "Python",
      "Machine Learning",
      "SQL",
      "TensorFlow",
      "Data Visualization",
      "Statistical Analysis",
      "Big Data",
      "R"
    ]
  },
  
  executive: {
    personalInfo: {
      name: "Jonathan Reynolds",
      title: "Chief Financial Officer",
      email: "jonathan.reynolds@example.com",
      phone: "(555) 456-7890",
      location: "New York, NY",
      summary: "Strategic financial executive with 15+ years of experience in financial planning, operations management, and corporate strategy. Proven track record of optimizing financial performance, driving growth, and increasing shareholder value for global organizations.",
    },
    experience: [
      {
        company: "Global Enterprises Inc.",
        position: "Chief Financial Officer",
        duration: "2018 - Present",
        description: "- Led financial restructuring that resulted in $15M annual cost savings\n- Oversaw successful acquisition and integration of three companies valued at $50M\n- Improved cash flow by 30% through optimization of working capital management",
      },
      {
        company: "Industry Leaders Corp.",
        position: "VP of Finance",
        duration: "2014 - 2018",
        description: "- Managed financial operations for North American division with $500M annual revenue\n- Implemented financial systems that improved reporting accuracy by 40%\n- Developed 5-year financial strategy aligned with corporate growth objectives",
      },
      {
        company: "PricewaterhouseCoopers",
        position: "Senior Financial Consultant",
        duration: "2008 - 2014",
        description: "- Advised Fortune 500 clients on financial strategy and risk management\n- Led due diligence teams for mergers and acquisitions\n- Developed financial models for strategic planning initiatives",
      }
    ],
    education: [
      {
        institution: "Harvard Business School",
        degree: "MBA, Finance",
        duration: "2006 - 2008",
        description: "Graduated with high distinction",
      },
      {
        institution: "Columbia University",
        degree: "BS in Finance and Economics",
        duration: "2002 - 2006",
        description: "Summa Cum Laude, Phi Beta Kappa",
      }
    ],
    skills: [
      "Financial Strategy",
      "M&A",
      "Risk Management",
      "Strategic Planning",
      "Investor Relations",
      "Corporate Finance",
      "Capital Markets",
      "Financial Analysis"
    ]
  },
  
  creative: {
    personalInfo: {
      name: "Sofia Martinez",
      title: "Creative Director",
      email: "sofia.martinez@example.com",
      phone: "(555) 567-8901",
      location: "Los Angeles, CA",
      summary: "Award-winning creative director with a passion for storytelling and brand identity. Versatile design professional with experience spanning digital, print, and experiential mediums. Known for creating distinctive visual languages for emerging and established brands.",
    },
    experience: [
      {
        company: "Visionary Studios",
        position: "Creative Director",
        duration: "2019 - Present",
        description: "- Directed rebranding projects for 3 major clients resulting in industry recognition\n- Led team of 12 designers, copywriters, and multimedia artists\n- Established creative direction for campaigns with combined reach of 20M+ consumers",
      },
      {
        company: "Design Evolution Agency",
        position: "Art Director",
        duration: "2016 - 2019",
        description: "- Created visual identity systems for startups and Fortune 500 companies\n- Produced award-winning campaigns for major consumer brands\n- Mentored junior designers and led creative workshops",
      },
      {
        company: "Spark Creative",
        position: "Senior Graphic Designer",
        duration: "2013 - 2016",
        description: "- Designed brand identities, packaging, and marketing materials\n- Collaborated with UX team on digital product design\n- Created motion graphics for digital marketing campaigns",
      }
    ],
    education: [
      {
        institution: "Rhode Island School of Design",
        degree: "BFA in Graphic Design",
        duration: "2009 - 2013",
        description: "Recipient of Presidential Scholarship, Honors Thesis in Brand Identity",
      }
    ],
    skills: [
      "Brand Strategy",
      "Art Direction",
      "Typography",
      "Visual Identity",
      "Adobe Creative Suite",
      "Motion Design",
      "Team Leadership",
      "Client Presentation"
    ]
  }
};