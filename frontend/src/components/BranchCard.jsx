import React from 'react';
import './BranchCard.css';

function BranchCard({branch, color, onClick}) {
    return (
        <div 
      className="branch-card" 
      style={{ borderLeft: `6px solid var(--${color})` }}
      onClick={onClick}
    >
      <div className="branch-header">
        <div 
          className="branch-icon" 
          style={{ background: `var(--${color})` }}
        >
          {branch.charAt(0)}
        </div>
        <h3 className="branch-name">{branch}</h3>
      </div>
      <p className="branch-preview">Click to view roles</p>
    </div>
    );
}

export default BranchCard;