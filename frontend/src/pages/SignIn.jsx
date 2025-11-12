import React, { useState, useEffect } from 'react';
import './SignIn.css';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

function SignIn() {
    
  const branches = [
    { name: 'Hardware', color: '#FF6B6B' },
    { name: 'Software', color: '#FFB84D' },
    { name: 'Data', color: '#4ECDC4' },
    { name: 'Finance', color: '#FF8C42' },
    { name: 'Marketing', color: '#5DADE2' },
    { name: 'Community', color: '#9B7EDE' }
  ];
  

  const [currentBranchIndex, setCurrentBranchIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const currentBranch = branches[currentBranchIndex].name;
    
    const handleTyping = () => {
      if (!isDeleting) {
        if (displayText.length < currentBranch.length) {
          setDisplayText(currentBranch.substring(0, displayText.length + 1));
          setTypingSpeed(150);
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentBranch.substring(0, displayText.length - 1));
          setTypingSpeed(100);
        } else {
          setIsDeleting(false);
          setCurrentBranchIndex((prev) => (prev + 1) % branches.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, currentBranchIndex, typingSpeed, branches]);
  return(
        <div className="signin-page">
      <div className="signin-left">
        <div className="signin-content">
          <h1 className="signin-title">Log In</h1>
          <p className="signin-subtitle">
            Sign in to Generate's Recruitment Portal using your Northeastern credentials.
          </p>
          
          <ClerkSignIn 
            appearance={{
              elements: {
                rootBox: "clerk-root",
                card: "clerk-card",
                formButtonPrimary: "clerk-button-primary",
                socialButtonsBlockButton: "clerk-social-button",
                formFieldInput: "clerk-input"
              }
            }}
            routing="path"
            path="/sign-in"
          />
        </div>
      </div>

      <div className="signin-right">
        <div className="signin-overlay">
          <div className="generate-image-container">
            <img 
              src="/login-pic1.png" 
              alt="Generate Product Development Studio" 
              className="generate-image"
            />
          </div>
          <div className="signin-branding">
            <h2 className="signin-brand-title">Generate</h2>
            <p className="signin-brand-subtitle">Northeastern's Premier Product Development Studio</p>
            <div className="typing-container">
              <span className="typing-prefix">Building in </span>
              <span 
                className="typing-text"
                style={{ color: branches[currentBranchIndex].color }}
              >
                {displayText}
              </span>
              <span className="typing-cursor">|</span>
            </div>
          </div>
          <div className="decorative-circles">
            {branches.map((branch, index) => (
              <div
                key={branch.name}
                className="circle"
                style={{
                  backgroundColor: branch.color,
                  animationDelay: `${index * 0.2}s`
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
    );
}

export default SignIn;