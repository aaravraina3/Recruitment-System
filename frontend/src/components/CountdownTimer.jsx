import React, { useState, useEffect } from 'react';
import './CountdownTimer.css'

function CountdownTimer({ deadline, roleName }) {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  function calculateTimeLeft() {
    const difference = new Date(deadline) - new Date();
    
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const isExpired = timeLeft.days === 0 && timeLeft.hours === 0 && 
                    timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <div className="countdown-timer">
      <h3 className="countdown-title">Application Deadline</h3>
      <p className="countdown-role">{roleName}</p>
      
      {isExpired ? (
        <div className="countdown-expired">
          <span className="expired-icon">⏰</span>
          <p className="expired-text">Applications Closed</p>
        </div>
      ) : (
        <div className="countdown-display">
          <div className="countdown-block">
            <span className="countdown-number">{timeLeft.days}</span>
            <span className="countdown-label">Days</span>
          </div>
          <div className="countdown-separator">:</div>
          <div className="countdown-block">
            <span className="countdown-number">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span className="countdown-label">Hours</span>
          </div>
          <div className="countdown-separator">:</div>
          <div className="countdown-block">
            <span className="countdown-number">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span className="countdown-label">Minutes</span>
          </div>
          <div className="countdown-separator">:</div>
          <div className="countdown-block">
            <span className="countdown-number">{String(timeLeft.seconds).padStart(2, '0')}</span>
            <span className="countdown-label">Seconds</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default CountdownTimer;