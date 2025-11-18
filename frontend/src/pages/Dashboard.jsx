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

    const getDaysUntil = (dateString) => {
      const deadline = new Date(dateString);
      const today = new Date();
      const diffTime = deadline - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    };

    const getStats = () => {
      const total = applications.length;
      const submitted = applications.filter(app => app.status === 'submitted').length;
      const underReview = applications.filter(app => app.status === 'under-review').length;
      const interview = applications.filter(app => app.status === 'interview').length;
      
      return { total, submitted, underReview, interview };
    };

    const stats = getStats();

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
          <div className="welcome-content">
            <p className="welcome-subtitle">HEY {user?.firstName?.toUpperCase()},</p>
            <h1 className="welcome-title">{getGreeting()}!</h1>
            <p className="welcome-description">
              Welcome back to Generate Recruitment Portal
            </p>
          </div>
          <div className="banner-decoration">
            <div className="decoration-circle circle-1"></div>
            <div className="decoration-circle circle-2"></div>
            <div className="decoration-circle circle-3"></div>
          </div>
        </div>

        <div className="dashboard-content">
          <div className="stats-grid">
            <div className="stat-card stat-card-gradient-blue">
              <div className="stat-icon">📝</div>
              <div className="stat-info">
                <p className="stat-label">Total Applications</p>
                <h3 className="stat-value">{stats.total}</h3>
              </div>
            </div>

            <div className="stat-card stat-card-gradient-purple">
              <div className="stat-icon">⏱</div>
              <div className="stat-info">
                <p className="stat-label">Under Review</p>
                <h3 className="stat-value">{stats.underReview}</h3>
              </div>
            </div>

            <div className="stat-card stat-card-gradient-green">
              <div className="stat-icon">📅</div>
              <div className="stat-info">
                <p className="stat-label">Interviews Scheduled</p>
                <h3 className="stat-value">{stats.interview}</h3>
              </div>
            </div>
          </div>

          <div className="two-column-grid">
             <div className="info-card">
              <div className="card-header">
                <h3 className="card-title">ABOUT ME</h3>
                <div className="title-underline"></div>
              </div>
              <div className="card-content">
                <div className="info-item">
                  <div className="info-icon">👤</div>
                  <div className="info-details">
                    <p className="info-label">Name</p>
                    <p className="info-value">{user?.firstName} {user?.lastName}</p>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-icon">📧</div>
                  <div className="info-details">
                    <p className="info-label">Email</p>
                    <p className="info-value">{user?.primaryEmailAddress?.emailAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-card">
              <div className="card-header">
                <h3 className="card-title">APPLICATION STATUS</h3>
                <div className="title-underline"></div>
              </div>
              <div className="card-content">
                {applications.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <p className="empty-text">No applications submitted yet</p>
                    <Button 
                      variant="primary" 
                      onClick={() => navigate('/branches')}
                    >
                      Start Your Application
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="applications-scroll">
                      {applications.map(app => (
                        <div key={app.id} className="modern-app-card">
                          <div className="app-card-header">
                            <div className="app-main-info">
                              <h4 className="app-role-title">{app.role}</h4>
                              <span className={`branch-pill branch-${app.branchColor}`}>
                                {app.branch}
                              </span>
                            </div>
                            <div className="app-meta">
                              <span className="applied-date">
                                Applied {new Date(app.timestamps?.submitted).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                          <div className="app-card-tracker">
                          <StatusTracker 
                            currentStatus={app.status}
                            timestamps={app.timestamps}
                            compact={true}
                          />
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="view-all-container">
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
            <div className="section-header">
              <h3 className="section-title">IMPORTANT DATES & REMINDERS</h3>
              <div className="title-underline"></div>
            </div>
            <div className="dates-timeline">
              <div className="timeline-item">
                <div className="timeline-marker marker-calendar"></div>
                <div className="timeline-content">
                  <div className="timeline-date">
                    <span className="date-month">NOV</span>
                    <span className="date-day">15</span>
                  </div>
                  <div className="timeline-info">
                    <h4 className="timeline-title">Chief Applications Close</h4>
                    <p className="timeline-description">11:59 PM EST</p>
                    <span className="timeline-badge badge-urgent">
                      {getDaysUntil('2025-11-15')} days left
                    </span>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker marker-calendar"></div>
                <div className="timeline-content">
                  <div className="timeline-date">
                    <span className="date-month">NOV</span>
                    <span className="date-day">22</span>
                  </div>
                  <div className="timeline-info">
                    <h4 className="timeline-title">Team Lead Applications Close</h4>
                    <p className="timeline-description">11:59 PM EST</p>
                    <span className="timeline-badge badge-warning">
                      {getDaysUntil('2025-11-22')} days left
                    </span>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker marker-calendar"></div>
                <div className="timeline-content">
                  <div className="timeline-date">
                    <span className="date-month">NOV</span>
                    <span className="date-day">30</span>
                  </div>
                  <div className="timeline-info">
                    <h4 className="timeline-title">General Applications Close</h4>
                    <p className="timeline-description">11:59 PM EST</p>
                    <span className="timeline-badge badge-info">
                      {getDaysUntil('2025-11-30')} days left
                    </span>
                  </div>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-marker marker-interview"></div>
                <div className="timeline-content">
                  <div className="timeline-date">
                    <span className="date-month">DEC</span>
                    <span className="date-day">2-6</span>
                  </div>
                  <div className="timeline-info">
                    <h4 className="timeline-title">Interviews Begin</h4>
                    <p className="timeline-description">Stay tuned for interview invites</p>
                  </div>
                </div>
              </div>
              
              <div className="timeline-item">
                <div className="timeline-marker marker-success"></div>
                <div className="timeline-content">
                  <div className="timeline-date">
                    <span className="date-month">DEC</span>
                    <span className="date-day">10</span>
                  </div>
                  <div className="timeline-info">
                    <h4 className="timeline-title">Decisions Released</h4>
                    <p className="timeline-description">Final decisions announced</p>
                  </div>
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