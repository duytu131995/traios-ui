import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Auth.css';

function RegisterSuccess() {
  return (
    <div className="verify-container">
      <div className="verify-card">
        <div className="verify-logo">
          <Link to="/landing">
            <img src="/logo.svg" alt="TraiOS Logo" />
          </Link>
        </div>
        
        <h2>Create account successfully</h2>
        
        <div className="verify-action" style={{ marginTop: '32px' }}>
          <Link to="/login" className="login-btn primary-btn">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterSuccess; 