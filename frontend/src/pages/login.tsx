import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './authmodal.css';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed.');
      
      login(data.token);
      navigate('/workspace');

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
          <h2 className="auth-modal-title">Welcome Back!</h2>
          <p className="auth-modal-message">Sign in to unlock all features.</p>
          <form onSubmit={handleLoginSubmit} className="auth-form">
            <input type="email" placeholder="Email" className="auth-input" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" className="auth-input" value={password} onChange={e => setPassword(e.target.value)} required />
            {error && <p className="auth-error-message">{error}</p>}
            <button type="submit" className="auth-submit-btn" disabled={isLoading}>{isLoading ? 'Logging In...' : 'Login'}</button>
          </form>
          <p className="auth-switch-text">
            Don't have an account? <a href="/signup" className="auth-link">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;