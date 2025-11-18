import React from 'react';
import './BranchCard.css';

function BranchCard({branch, color, icon, onClick}) {
    return (
        <div 
      className={`branch-card branch-card-${color}`}
      onClick={onClick}
    >
      <div className="branch-card-gradient"></div>
      <div className="branch-content">
        <div 
          className={`branch-icon branch-icon-${color}`}
        >
         <img 
            src={`/${color}-gear.png`}
            alt={`${branch} gear icon`}
            className="branch-gear-img"
          />
        </div>
        <h3 className="branch-name">{branch}</h3>
      <p className="branch-preview">Click to view roles</p>
      </div>
      <div className="branch-arrow">→</div>
    </div>
    );
}

export default BranchCard;