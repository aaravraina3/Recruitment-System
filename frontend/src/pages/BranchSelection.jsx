import React from 'react';
import './BranchSelection.css';
import '../pages/Dashboard.css';
import BranchCard from '../components/BranchCard';
import { useNavigate } from 'react-router-dom';
import { useUser, UserButton, useClerk } from '@clerk/clerk-react';
import generateLogo from '../assets/generate-logo.png';

function BranchSelection() {
    const navigate = useNavigate();
    const { user } = useUser();
    const { signOut } = useClerk();

    const branches = [
        { id: 'software', name: 'Software', color: 'software' },
        { id: 'hardware', name: 'Hardware', color: 'hardware' },
        { id: 'data', name: 'Data', color: 'data' },
        { id: 'finance', name: 'Finance', color: 'finance' },
        { id: 'marketing', name: 'Marketing', color: 'marketing' },
        { id: 'community', name: 'Community', color: 'community' }
    ];

    return (
    <div className="dashboard-container">
      <aside className="dashboard-sidebar">
       <div className="sidebar-header" onClick={() => navigate('/dashboard')}>
          <div className="logo-container">
            <img 
                src={generateLogo}
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
          <button 
            className="logout-button"
            onClick={() => signOut(() => navigate('/sign-in'))}
          >
            Sign Out
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="branch-selection-content">
          <div className="branch-hero">
            <div className="hero-content">
              <h1 className="hero-title">Choose Your Path</h1>
              <p className="hero-subtitle">
                Explore our six branches and find the perfect role to make an impact at Generate
              </p>
            </div>
            <div className="hero-decoration">
              <div className="hero-circle hero-circle-1"></div>
              <div className="hero-circle hero-circle-2"></div>
              <div className="hero-circle hero-circle-3"></div>
            </div>
          </div>

          <div className="branches-section">
            <h2 className="section-label">GENERATE BRANCHES</h2>
            <div className="branch-grid-container">
              {branches.map(branch => (
                <BranchCard
                  key={branch.id}
                  branch={branch.name}
                  color={branch.color}
                  icon={branch.icon}
                  onClick={() => navigate(`/branch/${branch.id}`)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default BranchSelection;