import React from 'react';
import './MyApplications.css';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useUser, UserButton } from '@clerk/clerk-react';
import Button from '../components/Button';
import StatusTracker from '../components/StatusTracker';

function MyApplications() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [applications, setApplications] = React.useState([]);
  
  React.useEffect(() => {
    const savedApps = JSON.parse(localStorage.getItem('my-applications') || '[]');
    setApplications(savedApps);
  }, []);

  const hasApplications = applications.length > 0;

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
        
        <nav className="sidebar-nav">
          <button className="nav-item" onClick={() => navigate('/branches')}>
            <span className="nav-icon">◎</span>
            Apply Now
          </button>
          <button className="nav-item active" onClick={() => navigate('/my-applications')}>
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
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="my-applications-content">
          <div className="applications-hero">
            <div className="hero-content-apps">
              <h1 className="applications-hero-title">My Applications</h1>
              <p className="applications-hero-subtitle">
                Track your application progress and manage submissions
              </p>
            </div>

            {hasApplications && (
              <div className="applications-count-badge">
                <span className="count-number">{applications.length}</span>
                <span className="count-label">Active {applications.length === 1 ? 'Application' : 'Applications'}</span>
              </div>
            )}
          </div>

          {!hasApplications ? (
            <div className="empty-state-modern">
              <div className="empty-icon-modern">📋</div>
              <h2 className="empty-title">No Applications Yet</h2>
              <p className="empty-description">You haven't submitted any applications. Ready to get started?</p>
              <Button variant="primary" onClick={() => navigate('/branches')}>
                Browse Branches
              </Button>
            </div>
          ) : (
            <div className="applications-list-modern">
              {applications.map(app => (
                <div key={app.id} className={`application-card-modern application-${app.branchColor}`}>
                  <div className="app-accent-bar"></div>
                  <div className="app-card-body">
                  <div className="app-header-modern">
                    <div className="app-title-group">
                      <h2 className="app-role-title-modern">{app.role}</h2>
                      <span className={`app-branch-pill branch-pill-${app.branchColor}`}>
                        {app.branch}
                      </span>
                    </div>
                    <div className="app-timestamp">
                        <span className="timestamp-label">Submitted</span>
                        <span className="timestamp-value">{app.submittedAt}</span>
                      </div>
                  </div>
                  
                  <div className="app-status-section">
                  <StatusTracker 
                    currentStatus={app.status}
                    timestamps={app.timestamps}
                  />
                  </div>

                  <div className="app-actions-modern">
                    {!app.isSubmitted && (
                      <Button variant="primary">Continue Application</Button>
                    )}
                  </div>
                </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default MyApplications;