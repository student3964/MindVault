import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

interface NavbarProps {
  activePage: 'home' | 'explore' | 'workspace' | 'about';
  isLoggedIn?: boolean; // We'll use this to show different buttons
}

const Navbar: React.FC<NavbarProps> = ({ activePage, isLoggedIn = false }) => {
  const navigate = useNavigate();

  const handleLoginClick = () => navigate('/login');
  const handleGetStartedClick = () => navigate('/signup');
  const handleLogoutClick = () => navigate('/'); // Should go to home after logout

  return (
    <nav className="nav-bar fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-3">
        {/* Left: MindVault Logo */}
        <RouterLink to="/" className="nav-logo cursor-pointer transition whitespace-nowrap">
          MindVault
        </RouterLink>

        {/* Center: Navigation Tabs */}
        <div className="hidden md:flex space-x-8 text-lg font-medium">
          <RouterLink
            to="/"
            className={`nav-link cursor-pointer transition-colors capitalize ${activePage === 'home' ? 'text-purple-400 font-semibold' : ''}`}
          >
            Home
          </RouterLink>
          {/* Note: In Home.tsx, this is a smooth scroll. Here it's a direct link for other pages. */}
          <RouterLink
            to="/#explore"
            className={`nav-link cursor-pointer transition-colors capitalize ${activePage === 'explore' ? 'text-purple-400 font-semibold' : ''}`}
          >
            Explore
          </RouterLink>
          <RouterLink
            to="/workspace"
            className={`nav-link cursor-pointer transition-colors capitalize ${activePage === 'workspace' ? 'text-purple-400 font-semibold' : ''}`}
          >
            Workspace
          </RouterLink>
          <RouterLink
            to="/about"
            className={`nav-link cursor-pointer transition-colors capitalize ${activePage === 'about' ? 'text-purple-400 font-semibold' : ''}`}
          >
            About
          </RouterLink>
        </div>

        {/* Right: Buttons change based on login state */}
        <div className="flex space-x-4">
          {isLoggedIn ? (
            <button className="glow-btn" onClick={handleLogoutClick}>
              Logout
            </button>
          ) : (
            <>
              <button className="glow-btn" onClick={handleLoginClick}>
                Login
              </button>
              <button className="primary-btn" onClick={handleGetStartedClick}>
                Get Started
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;