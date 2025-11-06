import React, { useState } from 'react';
import './ApplicationForm.css';
import '../pages/Dashboard.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import Button from '../components/Button';
import Input from '../components/Input';
import CountdownTimer from '../components/CountdownTimer';

function ApplicationForm() {
  const navigate = useNavigate();
  const { branchId, roleId } = useParams();
  const { user } = useUser();
  
  const [currentStep, setCurrentStep] = useState(1);
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
    

    chiefPosition: '',
    timeCommitment: false,
    whyGenerate: '',
    changes: '',
    vision: '',
    resume: null
  });


  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 30);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
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
        return formData.timeCommitment && formData.whyGenerate && formData.changes && formData.vision && 
               formData.resume;
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

  const handleSubmit = () => {
    alert('Application submitted! (Backend integration coming soon)');
    navigate('/dashboard');
  };

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
        </div>
        </aside>

      <main className="dashboard-main">
        <div className="application-form-content">
          <button className="back-button" onClick={() => navigate(`/branch/${branchId}`)}>
            ← Back to Roles
          </button>

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

          <div className="form-container">
            {currentStep === 1 && (
              <div className="form-step">
                <h2 className="form-title">SOFTWARE CHIEF APPLICATION</h2>
                <p className="form-subtitle">
                  Thank you for your interest in applying for the Software Chief role!
                </p>
                
                <div className="role-description-box">
                  <p><strong>These roles are for a single semester.</strong></p>
                  
                  <h3>Role Description</h3>
                  <p><strong>Software</strong></p>
                  <p>Student-led Software teams build projects for our clients in a fast-paced and engaging environment. Students receive experiential opportunities to work with real clients, collaborate with a tight-knit team to solve complex problems, and engage with a strong and high-achieving community.</p>
                  
                  <p><strong>Chiefs Team</strong></p>
                  <p>The Chiefs Team is a group of leaders with unique areas of expertise, united by the shared goal of developing Software, its members, and themselves.</p>
                  
                  <p>Members of the Chief team are individuals whose diverse experiences empower them with knowledge required to guide and mentor Software's teams. Chiefs are looked to as leaders who teach and empower the next generation of builders and innovators.</p>
                  
                  <p><strong>Responsibilities include:</strong></p>
                  <ul>
                    <li>Working alongside project leads to scope projects and build development timelines</li>
                    <li>Assist in hiring tech leads in respective domains</li>
                    <li>Offering technical support to project teams</li>
                    <li>Designing and presenting bootcamps and technical workshops</li>
                    <li>Collaborate with other Chiefs to emphasize each others' strengths and overcome weaknesses</li>
                    <li>Helping cultivate Generate's warm community by forging personal connections with team members</li>
                  </ul>
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
                        name="timeCommitment"
                        checked={formData.timeCommitment}
                        onChange={handleInputChange}
                      />
                      I understand the commitment and am certain I can make it. <span className="required">*</span>
                    </label>
                  </div>

                  <div className="input-wrapper">
                    <label className="input-label">Resume & Written Questions <span className="required">*</span></label>
                    <p className="field-description">These questions are an opportunity to share your story and vision for the future of Generate! This is where you share your story, ambitions, and aspirations for both yourself and the organization.</p>
                    <p className="field-note">Please customize your resume to match the unique responsibilities and qualifications required for this role. Then, attach your resume (PDF only).</p>
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

                  <div className="input-wrapper">
                    <label className="input-label">If you have been in Generate before, please describe what Generate has meant to you. If you haven't been in Generate, please elaborate on how your professional and/or extracurricular experiences have shaped you. <span className="required">*</span></label>
                    <textarea
                      name="whyGenerate"
                      value={formData.whyGenerate}
                      onChange={handleInputChange}
                      className="input-field textarea"
                      rows="6"
                      required
                    />
                  </div>

                  <div className="input-wrapper">
                    <label className="input-label">In concise words: what changes or improvements would you like to bring to the branch or position? <span className="required">*</span></label>
                    <textarea
                      name="changes"
                      value={formData.changes}
                      onChange={handleInputChange}
                      className="input-field textarea"
                      rows="6"
                      required
                    />
                    <p className="warning-note">⚠️ If selected for an interview, please be prepared to elaborate on the previous question in detail.</p>
                  </div>

                  <div className="input-wrapper">
                    <label className="input-label">What is your vision for your respective subbranch? How do you define success? <span className="required">*</span></label>
                    <textarea
                      name="vision"
                      value={formData.vision}
                      onChange={handleInputChange}
                      className="input-field textarea"
                      rows="6"
                      required
                    />
                  </div>
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
                  <p><strong>Position:</strong> {formData.chiefPosition}</p>
                  <p><strong>Resume:</strong> {formData.resume?.name}</p>
                </div>
                <div className="form-actions">
                  <Button variant="secondary" onClick={prevStep}>
                    ← Edit Application
                  </Button>
                  <Button variant="primary" onClick={handleSubmit}>
                    Submit Application ✓
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