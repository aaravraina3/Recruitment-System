import React from 'react';
import './BranchDetail.css';
import '../pages/Dashboard.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser, UserButton, useClerk } from '@clerk/clerk-react';
import Button from '../components/Button';

const BRANCH_DATA = {
  software: {
    name: 'Software',
    color: 'software',
    description: 'Student-led Software teams build projects for our clients which push the bounds of possible. Students work together using industry standard tools and processes while forming lifelong bonds with each other.',
    roles: [
      { id: 'swe-chief', title: 'Software Chief', level: 'chief' },
      { id: 'swe-tech-lead', title: 'Software Tech Lead', level: 'lead' },
      { id: 'software-engineer', title: 'Software Engineer', level: 'engineer' },
      { id: 'design-chief', title: 'Design Chief', level: 'chief' },
      { id: 'design-lead', title: 'Design Lead', level: 'lead' },
      { id: 'software-designer', title: 'Software Designer', level: 'engineer' }
    ]
  },
  hardware: {
    name: 'Hardware',
    color: 'hardware',
    description: 'Hardware teams design and build physical products, working with cutting-edge technology in mechanical, electrical, and embedded systems.',
    roles: [
      { id: 'mech-chief', title: 'Mech/ID Chief', level: 'chief' },
      { id: 'ee-chief', title: 'EE/ECE Chief', level: 'chief' },
      { id: 'hw-tech-lead', title: 'Hardware Tech Lead', level: 'lead' },
      { id: 'mech-tech-lead', title: 'Mechanical Tech Lead', level: 'lead' },
      { id: 'electrical-engineer', title: 'Electrical Engineer', level: 'engineer' },
      { id: 'mechanical-engineer', title: 'Mechanical Engineer', level: 'engineer' }
    ]
  },
  data: {
    name: 'Data',
    color: 'data',
    description: 'Data works to architect and implement data solutions; working on dashboards, machine learning models, and data pipelines that tell stories and drive impact.',
    roles: [
      { id: 'data-chief', title: 'Data Science Chief', level: 'chief' },
      { id: 'data-project-lead', title: 'Data Science Project Lead', level: 'lead' },
      { id: 'data-tech-lead', title: 'Data Science Tech Lead', level: 'lead' },
      { id: 'data-scientist', title: 'Data Scientist', level: 'engineer' }
    ]
  },
  finance: {
    name: 'Finance',
    color: 'finance',
    description: "Generate's finance team is responsible for managing all Generate business expenses and ensuring the organization is able to continue operating with financial security.",
    roles: [
      { id: 'financial-analyst', title: 'Financial Analyst', level: 'analyst' }
    ]
  },
  marketing: {
    name: 'Marketing',
    color: 'marketing',
    description: "Generate's marketing team is responsible for all external facing Generate matters including social media marketing, client acquisition, and Generate's annual showcase event.",
    roles: [
      { id: 'outreach-coordinator', title: 'Outreach Coordinator', level: 'coordinator' },
      { id: 'branding-lead', title: 'Branding and Design Lead', level: 'lead' },
      { id: 'design-associate', title: 'Design Associate', level: 'designer' },
      { id: 'social-media-coordinator', title: 'Social Media Coordinator', level: 'coordinator'},
      { id: 'media-lead', title: 'Media & Production Lead', level: 'lead' },
      { id: 'photographer', title: 'Photographer'},
      { id: 'videographer', title: 'Videographer'}
    ]
  },
  community: {
    name: 'Community',
    color: 'community',
    description: 'Community ensures we foster a strong, passionate, inclusive Generate community, and are effectively sharing Generate\'s mission and accomplishments with the broader Northeastern community.',
    roles: [
      { id: 'events-chief', title: 'Events Chief', level: 'chief' },
      { id: 'events-coordinator', title: 'Events Coordinator', level: 'coordinator' },
      { id: 'ld-chief', title: 'Learning and Development Chief', level: 'chief' },
      { id: 'ld-coordinator', title: 'L&D Coordinator', level: 'coordinator' },
      { id: 'alumni-chief', title: 'Alumni Relations Chief', level: 'chief' },
      { id: 'alumni-coordinator', title: 'Alumni Relations Coordinator', level: 'coordinator' },
      { id: 'internal-lead', title: 'Internal Lead', level: 'lead' },
      { id: 'internal-analyst', title: 'Internal Analyst', level: 'engineer' }
    ]
  }
};

function BranchDetail() {
  const navigate = useNavigate();
  const { branchId } = useParams();
  const { user } = useUser();
  const { signOut } = useClerk();
  
  const branch = BRANCH_DATA[branchId];

  if (!branch) {
    return <div>Branch not found</div>;
  }

  return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header" onClick={() => navigate('/dashboard')}>
          <div className="logo-container">
            <img 
                src={process.env.PUBLIC_URL + "/generate-logo.png"}
                alt="Generate Logo" 
                className="generate-logo-img"
            />
            <div className="logo-text">
                <span className="logo-generate">GENERATE</span>
                <span className="logo-recruitment">RECRUITMENT</span>
            </div>
        </div>
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
            <UserButton />
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
        <div className="branch-detail-content">
          <button className="back-button-modern" onClick={() => navigate('/branches')}>
            <span className="back-arrow">←</span>
            <span>Back to Branches</span>
          </button>

          <div className={`branch-hero-header branch-hero-${branch.color}`}>
            <div className="branch-hero-content">
              <div className="branch-hero-label">{branch.name.toUpperCase()}</div>
              <h1 className="branch-hero-title">{branch.name}</h1>
              <p className="branch-hero-description">{branch.description}</p>
            </div>
            <div className="branch-hero-decoration">
              <div className="hero-decor-circle hero-decor-1"></div>
              <div className="hero-decor-circle hero-decor-2"></div>
            </div>
          </div>

          <div className="roles-section-modern">
            <div className="roles-header">
              <h2 className="roles-title-modern">AVAILABLE ROLES</h2>
              <p className="roles-count">{branch.roles.length} {branch.roles.length === 1 ? 'Position' : 'Positions'} Open</p>
            </div>
            <div className="roles-grid-modern">
              {branch.roles.map(role => (
                <div key={role.id} className={`role-card-modern role-card-${branch.color}`}>
                  <div className="role-card-accent"></div>
                  <div className="role-card-content">
                  <h3 className="role-title-modern">{role.title}</h3>
                  <span className={`role-badge-modern badge-${role.level}`}>{role.level}</span>
                  </div>
                  <Button 
                    variant={branch.color}
                    onClick={() => navigate(`/apply/${branchId}/${role.id}`)}
                    className="role-apply-button"
                  >
                    Apply for this role
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BranchDetail;