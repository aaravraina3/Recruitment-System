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
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="my-applications-content">
          <h1 className="page-title">My Active Applications</h1>
          <p className="page-subtitle">Track your application progress and manage submissions</p>

          {!hasApplications ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h2>No Applications Yet</h2>
              <p>You haven't submitted any applications. Ready to get started?</p>
              <Button variant="primary" onClick={() => navigate('/branches')}>
                Browse Branches
              </Button>
            </div>
          ) : (
            <div className="applications-list">
              {applications.map(app => (
                <div key={app.id} className="application-card">
                  <div className="app-card-header">
                    <div className="app-title-section">
                      <h2 className="app-role-title">{app.role}</h2>
                      <span className={`app-branch-badge badge-${app.branchColor}`}>
                        {app.branch}
                      </span>
                    </div>
                    <div className="app-meta">
                      <span className="app-submitted">Submitted: {app.submittedAt}</span>
                    </div>
                  </div>

                  <StatusTracker 
                    currentStatus={app.status}
                    timestamps={app.timestamps}
                  />

                  <div className="app-actions">
                    <Button variant="primary">View Details</Button>
                    {!app.isSubmitted && (
                      <Button variant="black">Continue Application</Button>
                    )}
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