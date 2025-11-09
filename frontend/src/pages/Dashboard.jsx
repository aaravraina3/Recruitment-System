import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import { useUser, UserButton } from '@clerk/clerk-react';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import StatusTracker from '../components/StatusTracker';

function Dashboard() {
    const { user } = useUser();
    const navigate = useNavigate();

    const [applications, setApplications] = useState([]);
  
    useEffect(() => {
      const savedApps = JSON.parse(localStorage.getItem('my-applications') || '[]');
      setApplications(savedApps);
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if(hour < 12) return "Good Morning";
        if(hour <18) return "Good Afternoon";
        return "Good Evening";
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
        <div className="welcome-banner">
          <span className="welcome-icon"></span>
          <h1 className="welcome-title">
            HEY {user?.firstName?.toUpperCase()},
          </h1>
          <h2 className="welcome-greeting">{getGreeting()}!</h2>
        </div>

        <div className="dashboard-content">
          <div className="cards-grid">
            <div className="status-card">
              <h3 className="card-title">ABOUT ME</h3>
              <div className="card-content">
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user?.primaryEmailAddress?.emailAddress}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Student ID:</span>
                  <span className="info-value">NEU Student</span>
                </div>
              </div>
            </div>

            <div className="status-card full-width">
              <h3 className="card-title">APPLICATION STATUS</h3>
              <div className="card-content">
                {applications.length === 0 ? (
                  <p className="no-applications">No applications submitted yet</p>
                ) : (
                  <>
                    <div className="applications-scroll">
                      {applications.map(app => (
                        <div key={app.id} className="application-item-compact">
                          <div className="app-header-compact">
                            <div>
                              <h4 className="app-role-compact">{app.role}</h4>
                              <span className={`app-branch-badge-small badge-${app.branchColor}`}>
                                {app.branch}
                              </span>
                            </div>
                          </div>
                          <StatusTracker 
                            currentStatus={app.status}
                            timestamps={app.timestamps}
                            compact={true}
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div style={{ marginTop: '20px', textAlign: 'center' }}>
                      <Button 
                        variant="secondary" 
                        onClick={() => navigate('/my-applications')}
                      >
                        View All Applications ({applications.length})
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="important-dates-section">
            <h3 className="section-title">IMPORTANT DATES / REMINDERS</h3>
            <div className="dates-list">
              <div className="date-item">
                <div className="date-icon">📅</div>
                <div className="date-content">
                  <h4 className="date-title">Chief Applications Close</h4>
                  <p className="date-description">November 15, 2025 at 11:59 PM EST</p>
                </div>
              </div>
              <div className="date-item">
                <div className="date-icon">📅</div>
                <div className="date-content">
                  <h4 className="date-title">Team Lead Applications Close</h4>
                  <p className="date-description">November 22, 2025 at 11:59 PM EST</p>
                </div>
              </div>
              <div className="date-item">
                <div className="date-icon">📅</div>
                <div className="date-content">
                  <h4 className="date-title">General Applications Close</h4>
                  <p className="date-description">November 30, 2025 at 11:59 PM EST</p>
                </div>
              </div>
              <div className="date-item">
                <div className="date-icon">👩‍⚖️</div>
                <div className="date-content">
                  <h4 className="date-title">Interviews Begin</h4>
                  <p className="date-description">December 2-6, 2025</p>
                </div>
              </div>
              <div className="date-item">
                <div className="date-icon">✅</div>
                <div className="date-content">
                  <h4 className="date-title">Decisions Released</h4>
                  <p className="date-description">December 10, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
export default Dashboard;