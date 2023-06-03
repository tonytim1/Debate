import React from 'react';
import './LandingPage.css'; // Create a separate CSS file for styling
import { LoginForm } from 'src/sections/auth/login';


const LandingPage = ({ showLoginReminder }) => {
    if (!showLoginReminder) {
      return null; // Return null if the prop is false, hiding the component
    }
  
    return (
      <div className="login-reminder">
        <div className="overlay-background" />
          <LoginForm />
      </div>
    );    
  };
  
export default LandingPage;