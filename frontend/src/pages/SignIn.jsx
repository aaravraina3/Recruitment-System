import React, { useState } from 'react';
import './SignIn.css';
import { SignIn as ClerkSignIn } from '@clerk/clerk-react';

function SignIn() {
    return(
        <div className="signin-page">
      <div className="signin-left">
        <div className="signin-content">
          <h1 className="signin-title">Log In</h1>
          <p className="signin-subtitle">
            Click below to log into Generate Recruitment Portal using your Northeastern credentials.
          </p>
          
          <ClerkSignIn 
            appearance={{
              elements: {
                rootBox: "clerk-root",
                card: "clerk-card"
              }
            }}
            routing="path"
            path="/sign-in"
          />
        </div>
      </div>

      <div className="signin-right">
        <div className="signin-overlay">
          <div className="signin-branding">
            <h2 className="signin-brand-title">Generate</h2>
            <p className="signin-brand-subtitle">Northeastern's Premier Product Development Studio</p>
          </div>
        </div>
      </div>
    </div>
    );
}

export default SignIn;