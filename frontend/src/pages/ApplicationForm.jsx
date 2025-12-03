import React, { useState, useEffect } from 'react';
import './ApplicationForm.css';
import '../pages/Dashboard.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser, UserButton, useAuth, useClerk } from '@clerk/clerk-react';
import Button from '../components/Button';
import Input from '../components/Input';
import CountdownTimer from '../components/CountdownTimer';
import { applicationAPI } from '../services/api';



const ROLE_CONTENT = {
  'swe-chief': {
    title: 'SOFTWARE CHIEF APPLICATION',
    branch: 'Software',
    description: {
      intro: 'Thank you for your interest in applying for the Software Chief role!',
      beforeApplying: 'Before applying, please review the Missions, Values, & Priorities document.',
      semester: 'These roles are for a single semester.',
      sections: [
        {
          title: 'Software',
          content: 'Student-led Software teams build projects for our clients in a fast-paced and engaging environment. Students receive experiential opportunities to work with real clients, collaborate with a tight-knit team to solve complex problems, and engage with a strong and high-achieving community.'
        },
        {
          title: 'Chiefs Team',
          content: 'The Chiefs Team is a group of leaders with unique areas of expertise, united by the shared goal of developing Software, its members, and themselves. Members of the Chief team are individuals whose diverse experiences empower them with knowledge required to guide and mentor Software\'s teams. Chiefs are looked to as leaders who teach and empower the next generation of builders and innovators.'
        }
      ],
      responsibilities: [
        'Working alongside project leads to scope projects and build development timelines',
        'Assist in hiring tech leads in respective domains',
        'Offering technical support to project teams',
        'Designing and presenting bootcamps and technical workshops',
        'Collaborate with other Chiefs to emphasize each others\' strengths and overcome weaknesses',
        'Helping cultivate Generate\'s warm community by forging personal connections with team members',
        'Take end-to-end ownership of new branch proposals and process changes',
        'Facilitating branch-wide events to uplift project velocity'
      ]
    },
    deadline: 'November 7th at 11:59pm'
  },

  
  'mech-chief': {
    title: 'MECHANICAL CHIEF APPLICATION',
    branch: 'Hardware',
    description: {
      intro: 'Thank you for your interest in applying for the Mechanical Chief role!',
      beforeApplying: 'Before applying, please review the documents Missions, Values, & Priorities and How Hardware Hires - Chiefs on how Hardware hires Chiefs',
      semester: 'These roles are for a single semester. To see how each role fits into our current organization structure, please see the chart below.',
      sections: [
        {
          title: 'Hardware',
          content: 'Student-led Hardware teams build projects for our clients in a fast-paced and engaging environment. Students receive experiential opportunities to work with real clients, collaborate with a tight-knit team to solve complex problems, and engage with a strong and high-achieving community.'
        },
        {
          title: 'Chiefs Team',
          content: 'The Chiefs Team is a group of leaders with unique areas of expertise, united by the shared goal of developing Hardware, its members, and themselves. Members of the Chief team are individuals whose diverse experiences empower them with knowledge required to guide and mentor Hardware\'s teams. Chiefs are looked to as leaders who teach and empower the next generation of builders and innovators.'
        }
      ],
      responsibilities: [
        'Working alongside project leads to scope projects and build development timelines',
        'Assist in hiring tech leads in respective domains',
        'Offering technical support to project teams',
        'Hosting design reviews at major project milestones',
        'Designing and presenting bootcamps and technical workshops',
        'Mentoring members in Hardware\'s Big/Little system',
        'Collaborate with other Chiefs to emphasize each others\' strengths and overcome weaknesses',
        'Divide and conquer responsibilities and tasks to give members the best possible experience',
        'Attend team meetings regularly to tackle blockers and guide project direction'
      ]
    },
    deadline: 'November 7th at 11:59pm'
  },    

    'ee-chief': {
    title: 'ELECTRICAL CHIEF APPLICATION',
    branch: 'Hardware',
    description: {
      intro: 'Thank you for your interest in applying for the Electrical Chief role!',
      beforeApplying: 'Before applying, please review the documents Missions, Values, & Priorities and How Hardware Hires - Chiefs on how Hardware hires Chiefs',
      semester: 'These roles are for a single semester. To see how each role fits into our current organization structure, please see the chart below.',
      sections: [
        {
          title: 'Hardware',
          content: 'Student-led Hardware teams build projects for our clients in a fast-paced and engaging environment. Students receive experiential opportunities to work with real clients, collaborate with a tight-knit team to solve complex problems, and engage with a strong and high-achieving community.'
        },
        {
          title: 'Chiefs Team',
          content: 'The Chiefs Team is a group of leaders with unique areas of expertise, united by the shared goal of developing Hardware, its members, and themselves. Members of the Chief team are individuals whose diverse experiences empower them with knowledge required to guide and mentor Hardware\'s teams. Chiefs are looked to as leaders who teach and empower the next generation of builders and innovators.'
        }
      ],
      responsibilities: [
        'Working alongside project leads to scope projects and build development timelines',
        'Assist in hiring tech leads in respective domains',
        'Offering technical support to project teams',
        'Hosting design reviews at major project milestones',
        'Designing and presenting bootcamps and technical workshops',
        'Mentoring members in Hardware\'s Big/Little system',
        'Collaborate with other Chiefs to emphasize each others\' strengths and overcome weaknesses',
        'Divide and conquer responsibilities and tasks to give members the best possible experience',
        'Attend team meetings regularly to tackle blockers and guide project direction'
      ]
    },
    deadline: 'November 7th at 11:59pm'
},

    'data-chief': {
    title: 'DATA CHIEF APPLICATION',
    branch: 'data',
    description: {
      intro: 'Thank you for your interest in applying for the Data Chief role!',
      beforeApplying: 'Before applying, please review the documents Missions, Values, & Priorities and How Data Hires - Chiefs on how Data hires Chiefs',
      semester: 'These roles are for a single semester. To see how each role fits into our current organization structure, please see the chart below.',
      sections: [
        {
          title: 'Data',
          content: 'Data Science in Generate is a newly created branch this year that is striving to provide real-world data solutions to our clients. Projects can range from developing advanced machine learning models to designing intuitive dashboards and scalable data pipelines, each tailored to solve specific organizational challenges. This versatility not only demands technical rigor but also a deep understanding of stakeholder goals to drive meaningful impact.'
        },
        {
          title: 'Chiefs Team',
          content: 'The Chiefs Team is a group of leaders with unique areas of expertise, united by the shared goal of developing unique solutions in the data science field, its members, and themselves'
        }
      ],
      responsibilities: [
        'Working alongside project leads to scope projects and build development timelines',
        'Assist in hiring tech leads in respective domains',
        'Offering technical support to project teams',
        'Hosting design reviews at major project milestones',
        'Designing and presenting bootcamps and technical workshops',
        'Mentoring members in Hardware\'s Big/Little system',
        'Collaborate with other Chiefs to emphasize each others\' strengths and overcome weaknesses',
        'Divide and conquer responsibilities and tasks to give members the best possible experience',
        'Attend team meetings regularly to tackle blockers and guide project direction'
      ]
    },
    deadline: 'November 7th at 11:59pm'
    },
    interviewRequirement: {
      required: true,
      title: 'Interview',
      description: 'As part of the application, please prepare a slideshow to present for the interview. This slideshow should touch on:',
      topics: [
        'Why are you applying to this role?',
        'Ideas on what workshops that would be effective for members.',
        'How would you plan Bootcamp to get members ready for the semester and help them hit the ground running?',
        'Your strengths as an engineer, mentor, and teammate.',
        'How would you help a team that\'s stuck problem that you don\'t know how to do?'
      ],
      note: 'This should only be ~10 minutes long and presented in a relatively informal manner.',
      prompt: 'Submit a link to your presentation',
      additionalInfo: 'If selected for the interview, it will be structured such that you will present your presentation to me to start, and I will take notes and we\'ll have a conversation afterwards where I will ask clarifying questions and questions from my own template. Ultimately, this will be a two-way conversation that will represent the relationship between a Chief and Director in which I highly value your input and want to collaborate on improving outcomes for Hardware as a result of your proactive thinking. You will hear back within a week.'
    },
};

function ApplicationForm() {
  const navigate = useNavigate();
  const { branchId, roleId } = useParams();
  const { user } = useUser();
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const roleContent = ROLE_CONTENT[roleId] || ROLE_CONTENT['swe-chief'];
  const [currentStep, setCurrentStep] = useState(1);
  const [dynamicQuestions, setDynamicQuestions] = useState([]);
  
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    preferredName: '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    pronouns: '',
    major: '',
    minor: '',
    year: '',
    graduationSemester: '',
    previousGenerateExperience: '',
    commitments: '',
    referralSource: '',
    referralName: '',
    organizationalOutreach: '',
    
    // Dynamic answers will be flattened here or in a separate object
    // For simplicity, we'll store them as 'answers' object
    answers: {},
    resume: null,
    presentationLink: ''
  });

  // Fetch Dynamic Questions
  useEffect(() => {
    const fetchQuestions = async () => {
        try {
            const questions = await applicationAPI.getQuestions(branchId, roleId, getToken);
            setDynamicQuestions(questions);
        } catch (error) {
            console.error("Failed to fetch questions", error);
        }
    };
    fetchQuestions();
  }, [branchId, roleId, getToken]);

  useEffect(() => {
    const saveInterval = setInterval(() => {
      localStorage.setItem('application-draft', JSON.stringify(formData));
      console.log('Application auto-saved');
    }, 30000);

    return () => clearInterval(saveInterval);
  }, [formData]);

  useEffect(() => {
    const savedData = localStorage.getItem('application-draft');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // Ensure answers object exists
      if (!parsed.answers) parsed.answers = {};
      setFormData(parsed);
    }
  }, []);


  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 30);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };
  
  const handleAnswerChange = (questionId, value) => {
      setFormData(prev => ({
          ...prev,
          answers: {
              ...prev.answers,
              [questionId]: value
          }
      }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
  };


  const isStepValid = () => {
    switch(currentStep) {
      case 1:
        return true; 
      case 2:
        return formData.firstName && formData.lastName && formData.email && 
               formData.pronouns && formData.major && formData.year && 
               formData.graduationSemester && formData.referralSource;
      case 3:
        const needsPresentation = roleContent.interviewRequirement;
        // Check dynamic questions required fields
        const allQuestionsAnswered = dynamicQuestions.every(q => {
            if (!q.required) return true;
            if (q.type === 'checkbox') return formData.answers[q.id] === true;
            return !!formData.answers[q.id];
        });
        
        const baseValid = allQuestionsAnswered && formData.resume;
        
        if (needsPresentation) {
          return baseValid && formData.presentationLink;
        }
        return baseValid;
      case 4:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (isStepValid()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };
  
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const application = {
        email: user?.primaryEmailAddress?.emailAddress,
        role: roleId?.replace(/-/g, ' '),
        branch: branchId,
        branchColor: roleContent.branch.toLowerCase().replace(' ', '-'),
        status: 'submitted',
        submittedAt: new Date().toLocaleString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit'
        }),
        timestamps: {
          'submitted': new Date().toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          })
        },
        isSubmitted: true,
        formData: {
            ...formData,
            // Flatten answers for easier reading in review dashboard if needed, 
            // or keep as 'answers' object. Review Dashboard is already accessing formData directly.
            // We'll keep the structure consistent.
            ...formData.answers // Spread answers to top level if review dashboard expects specific keys
        }
      };

      // Send to backend API
      await applicationAPI.create(application, getToken);
      
      // Also save to localStorage as backup
      const existingApps = JSON.parse(localStorage.getItem('my-applications') || '[]');
      existingApps.push({ ...application, id: Date.now() });
      localStorage.setItem('my-applications', JSON.stringify(existingApps));
      localStorage.removeItem('application-draft');
      
      alert('Application submitted successfully!');
      navigate('/my-applications');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert(`Failed to submit application: ${error.message}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  {/*Left sidebar*/}
  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header" onClick={() => navigate('/dashboard')}>
          <div className="logo-container">
            <img 
                src="/generate-logo.png" 
                alt="Generate Logo" 
                className="generate-logo-img"
            />
            <div className="logo-text">
                <span className="logo-generate">GENERATE</span>
                <span className="logo-recruitment">RECRUITMENT</span>
            </div>
        </div>
        </div>
        {/* The countdown timer */}
        <div className="sidebar-timer-container">
            <CountdownTimer 
            deadline={deadline.toISOString()} 
            roleName={roleId?.replace(/-/g, ' ').toUpperCase()}
            />
        </div>
        
        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate('/branches')}>
            <span className="nav-icon">◎</span>
            Apply Now
          </button>
          <button className="nav-item" onClick={() => navigate('/my-applications')}>
            <span className="nav-icon">❐</span>
            My Active Applications
          </button>
        </nav>

        <div className="sidebar-footer">
            <div className="user-info">
            <UserButton 
                appearance={{
                elements: {
                    avatarBox: "w-10 h-10"
                }
                }}
            />
            <div className="user-details">
                <p className="user-name">{user?.firstName} {user?.lastName}</p>
                <p className="user-email">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
            </div>
            <button 
              className="logout-button"
              onClick={() => signOut(() => navigate('/sign-in'))}
            >
        
              Sign Out
            </button>
        </div>
        </aside>

      <main className="dashboard-main">
        <div className="application-form-content">
          <button className="back-button" onClick={() => navigate(`/branch/${branchId}`)}>
            ← Back to Roles
          </button>
                {/* Application progress bar*/}
          <div className="progress-bar">
            <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <span className="step-label">Role Info</span>
            </div>
            <div className={`progress-line ${currentStep >= 2 ? 'active' : ''}`}></div>
            <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <span className="step-label">Personal Info</span>
            </div>
            <div className={`progress-line ${currentStep >= 3 ? 'active' : ''}`}></div>
            <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <span className="step-label">Application</span>
            </div>
            <div className={`progress-line ${currentStep >= 4 ? 'active' : ''}`}></div>
            <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <span className="step-label">Review</span>
            </div>
          </div>

            {/* Application steps */}
          <div className="form-container">
            {currentStep === 1 && (
              <div className="form-step">
                <h2 className="form-title">{roleContent.title}</h2>
                <p className="form-subtitle">{roleContent.description.intro}</p>
                
                <div className="role-description-box">
                  {roleContent.description.beforeApplying && (
                    <p>{roleContent.description.beforeApplying}</p>
                  )}
                  
                  <p><strong>{roleContent.description.semester}</strong></p>
                  {roleContent.description.sections.map((section, idx) => (
                    <div key={idx}>
                      <h3>{section.title}</h3>
                      <p>{section.content}</p>
                    </div>
                  ))}
                  <h3>Responsibilities</h3>
                  <ul>
                    {roleContent.description.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                  <p style={{ marginTop: '24px', fontWeight: 'bold' }}>
                    Applications close {roleContent.deadline}
                  </p>
                </div>
                
                <div className="form-actions">
                  <Button variant="primary" onClick={nextStep}>
                    Next →
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="form-step">
                <h2 className="form-title">Demographic Information</h2>
                <div className="form-fields">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Preferred Name"
                    name="preferredName"
                    value={formData.preferredName}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Northeastern Email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <div className="input-wrapper">
                    <label className="input-label">Pronouns <span className="required">*</span></label>
                    <div className="radio-group">
                      {['She/Her', 'They/Them', 'He/Him', 'Other'].map(pronoun => (
                        <label key={pronoun} className="radio-label">
                          <input
                            type="radio"
                            name="pronouns"
                            value={pronoun}
                            checked={formData.pronouns === pronoun}
                            onChange={handleInputChange}
                          />
                          {pronoun}
                        </label>
                      ))}
                    </div>
                  </div>

                  <Input
                    label="Major(s)"
                    name="major"
                    value={formData.major}
                    onChange={handleInputChange}
                    required
                  />
                  <Input
                    label="Minor(s)"
                    name="minor"
                    value={formData.minor}
                    onChange={handleInputChange}
                  />
                  
                  <Input
                    label="Year (as of September 2025)"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g., 2022"
                    required
                  />
                  
                  <Input
                    label="Expected Graduation Semester"
                    name="graduationSemester"
                    value={formData.graduationSemester}
                    onChange={handleInputChange}
                    required
                  />

                  <div className="input-wrapper">
                    <label className="input-label">Previous Generate Experience (if applicable)</label>
                    <textarea
                      name="previousGenerateExperience"
                      value={formData.previousGenerateExperience}
                      onChange={handleInputChange}
                      className="input-field textarea"
                      rows="3"
                    />
                  </div>

                  <div className="input-wrapper">
                    <label className="input-label">Are there any commitments that are not reflected elsewhere in your application?</label>
                    <textarea
                      name="commitments"
                      value={formData.commitments}
                      onChange={handleInputChange}
                      className="input-field textarea"
                      rows="3"
                    />
                  </div>

                  <div className="input-wrapper">
                    <label className="input-label">Where did you hear about this application? <span className="required">*</span></label>
                    <select
                      name="referralSource"
                      value={formData.referralSource}
                      onChange={handleInputChange}
                      className="input-field"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="Generate Referral">Generate Referral (current or past member)</option>
                      <option value="Organizational Outreach">Organizational Outreach</option>
                      <option value="Instagram">Instagram</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Email">Email</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {formData.referralSource === 'Generate Referral' && (
                    <Input
                      label="If you selected 'Generate Referral', please indicate who referred you (First + Last Name)"
                      name="referralName"
                      value={formData.referralName}
                      onChange={handleInputChange}
                    />
                  )}

                  {formData.referralSource === 'Organizational Outreach' && (
                    <Input
                      label="If you selected 'Organizational Outreach', please specify which club"
                      name="organizationalOutreach"
                      value={formData.organizationalOutreach}
                      onChange={handleInputChange}
                    />
                  )}
                </div>
                <div className="form-actions">
                  <Button variant="secondary" onClick={prevStep}>
                    ← Back
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={nextStep}
                    disabled={!isStepValid()}
                  >
                    Continue →
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="form-step">
                <h2 className="form-title">Application Questions</h2>
                <div className="form-fields">

                  <div className="commitment-note">
                    <p><strong>The expected time commitment for a Generate role is approximately 10 hours per week.</strong> It's typically recommended you have no more than one other major extracurricular commitment concurrently.</p>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="timeCommitment" // Kept for backward compat/structure
                        checked={formData.timeCommitment} // We might need to make sure this is in dynamic questions too or separate
                        onChange={handleInputChange}
                      />
                      I understand the commitment and am certain I can make it. <span className="required">*</span>
                    </label>
                  </div>

                  <div className="input-wrapper">
                    <label className="input-label">Resume & Written Questions <span className="required">*</span></label>
                    <p className="field-description">These questions are an opportunity to share your story and vision for the future of Generate!</p>
                    <p className="field-note">Please attach your resume (PDF only).</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="file-input"
                      required
                    />
                    {formData.resume && (
                      <p className="file-name">Selected: {formData.resume.name}</p>
                    )}
                  </div>

                  {/* Dynamic Questions Rendered Here */}
                  {dynamicQuestions.map(q => (
                    <div className="input-wrapper" key={q.id}>
                        {q.type === 'checkbox' ? (
                            <label className="checkbox-label">
                                <input 
                                    type="checkbox"
                                    checked={!!formData.answers[q.id]}
                                    onChange={(e) => handleAnswerChange(q.id, e.target.checked)}
                                />
                                {q.label} {q.required && <span className="required">*</span>}
                            </label>
                        ) : (
                            <>
                                <label className="input-label">{q.label} {q.required && <span className="required">*</span>}</label>
                                <textarea
                                    value={formData.answers[q.id] || ''}
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                                    className="input-field textarea"
                                    rows={q.rows || 4}
                                    required={q.required}
                                />
                            </>
                        )}
                    </div>
                  ))}


                  {roleContent.interviewRequirement && (
                    <div className="interview-requirement">
                      <h3>{roleContent.interviewRequirement.title}</h3>
                      <p className="field-description">{roleContent.interviewRequirement.description}</p>
                      <ol className="interview-topics">
                        {roleContent.interviewRequirement.topics.map((topic, idx) => (
                          <li key={idx}>{topic}</li>
                        ))}
                      </ol>
                      <p className="field-note">{roleContent.interviewRequirement.note}</p>
                      
                      <div className="input-wrapper">
                        <label className="input-label">{roleContent.interviewRequirement.prompt} <span className="required">*</span></label>
                        <Input
                          name="presentationLink"
                          value={formData.presentationLink}
                          onChange={handleInputChange}
                          placeholder="https://..."
                          required
                        />
                      </div>
                      
                      <p className="field-description">{roleContent.interviewRequirement.additionalInfo}</p>
                    </div>
                  )}

                </div>
                <div className="form-actions">
                  <Button variant="secondary" onClick={prevStep}>
                    ← Back
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={nextStep}
                    disabled={!isStepValid()}
                  >
                    Review Application →
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="form-step">
                <h2 className="form-title">Review Your Application</h2>
                <div className="review-section">
                  <h3>Personal Information</h3>
                  <p><strong>Name:</strong> {formData.firstName} {formData.preferredName && `"${formData.preferredName}"`} {formData.lastName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  <p><strong>Pronouns:</strong> {formData.pronouns}</p>
                  <p><strong>Major:</strong> {formData.major}</p>
                  <p><strong>Year:</strong> {formData.year}</p>
                </div>
                <div className="review-section">
                  <h3>Application</h3>
                  <p><strong>Position:</strong> {roleContent.title}</p>
                  <p><strong>Resume:</strong> {formData.resume?.name}</p>
                  {/* Display Dynamic Answers in Review */}
                  {dynamicQuestions.map(q => (
                     <div key={q.id} style={{marginTop: '10px'}}>
                        <strong>{q.label}</strong>
                        <p style={{whiteSpace: 'pre-wrap', background: '#f9f9f9', padding: '8px', borderRadius: '4px'}}>
                            {q.type === 'checkbox' ? (formData.answers[q.id] ? 'Yes' : 'No') : (formData.answers[q.id] || '-')}
                        </p>
                     </div>
                  ))}
                </div>
                <div className="form-actions">
                  <Button variant="secondary" onClick={prevStep} disabled={isSubmitting}>
                    ← Edit Application
                  </Button>
                  <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Application ✓'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ApplicationForm;
