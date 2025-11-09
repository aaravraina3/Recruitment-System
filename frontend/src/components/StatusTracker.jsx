import React from "react";
import './StatusTracker.css';

function StatusTracker({ currentStatus, timestamps, compact = false }) {
  const statuses = [
    { id: 'submitted', label: 'Submitted'},
    { id: 'under-review', label: 'Under Review'},
    { id: 'interview', label: 'Interview' },
    { id: 'decision', label: 'Decision'}
  ];

  const currentIndex = statuses.findIndex(s => s.id === currentStatus);

  return (
    <div className={`status-tracker ${compact ? 'status-tracker-compact' : ''}`}>
      <div className="status-steps">
        {statuses.map((status, index) => (
          <React.Fragment key={status.id}>
            <div className={`status-step ${index <= currentIndex ? 'completed' : ''} ${index === currentIndex ? 'current' : ''}`}>
              <div className="status-circle">
                {index < currentIndex ? '✓' : status.icon}
              </div>
              <div className="status-info">
                <span className="status-label">{status.label}</span>
                {!compact && timestamps && timestamps[status.id] && (
                  <span className="status-timestamp">{timestamps[status.id]}</span>
                )}
              </div>
            </div>
            {index < statuses.length - 1 && (
              <div className={`status-line ${index < currentIndex ? 'completed' : ''}`}></div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
export default StatusTracker;