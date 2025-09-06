import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './authmodal.css';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create account.');
      
      setSuccessMessage('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleClose = () => navigate('/');

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal-container">
        <button onClick={handleClose} className="auth-modal-close-btn">&times;</button>
        <div className="auth-modal-content">
          <h2 className="auth-modal-title">Join MindVault</h2>
          <p className="auth-modal-message">Create your account and start summarizing.</p>
          <form onSubmit={handleSignupSubmit} className="auth-form">
            <input type="text" placeholder="First Name" className="auth-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
            <input type="email" placeholder="Email" className="auth-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="auth-input" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="auth-error-message">{error}</p>}
            {successMessage && <p className="auth-success-message">{successMessage}</p>}
            <button type="submit" className="auth-submit-btn" disabled={isLoading}>{isLoading ? 'Creating Account...' : 'Sign Up'}</button>
          </form>
          <p className="auth-switch-text">
            Already have an account? <a href="/login" className="auth-link">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;