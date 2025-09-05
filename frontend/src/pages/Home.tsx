import React from 'react';
import { scroller } from 'react-scroll';
import Navbar from '../components/Navbar'; 
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/signup');
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleUploadNotesClick = () => {
    navigate('/upload-notes');
  };

  const handleScrollTo = (section: string) => {
    scroller.scrollTo(section, {
      smooth: true,
      duration: 500,
      offset: -70, // Adjust for navbar height
    });
  };

  const FeatureCard = ({
    icon,
    title,
    description,
    buttonText,
    onClick,
  }: {
    icon: string;
    title: string;
    description: string;
    buttonText?: string;
    onClick?: () => void;
  }) => (
    <div className="feature-card flex-1 min-w-0">
      <div className="text-center">
        <div className="text-4xl mb-4 text-purple-400">{icon}</div>
        <h3 className="feature-card-title">{title}</h3>
        <p className="feature-card-description">{description}</p>
      </div>
      {buttonText && onClick && (
        <button className="primary-btn w-full" onClick={onClick}>
          {buttonText}
        </button>
      )}
    </div>
  );

  return (
    <div className="home-container font-sans">
      {/* NAVBAR */}
      <nav className="nav-bar fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-3">
          {/* Left: MindVault Logo */}
          <a
            onClick={() => handleScrollTo('home')}
            className="nav-logo cursor-pointer transition whitespace-nowrap"
          >
            MindVault
          </a>

          {/* Center: Navigation Tabs */}
          <div className="hidden md:flex space-x-8 text-lg font-medium">
            <a
              className="nav-link cursor-pointer transition-colors capitalize"
              onClick={() => handleScrollTo('home')}
            >
              Home
            </a>
            <a
              className="nav-link cursor-pointer transition-colors capitalize"
              onClick={() => handleScrollTo('explore')}
            >
              Explore
            </a>
            <a
              className="nav-link cursor-pointer transition-colors capitalize"
              onClick={() => navigate('/workspace')}
            >
              Workspace
            </a>

            <RouterLink
              to="/about"
              className="nav-link cursor-pointer transition-colors capitalize"
            >
              About
            </RouterLink>
          </div>

          {/* Right: Buttons */}
          <div className="flex space-x-4">
            <button className="glow-btn" onClick={handleLoginClick}>
              Login
            </button>
            <button className="primary-btn" onClick={handleGetStartedClick}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section
        id="home"
        className="pt-24 pb-16 flex flex-col justify-center items-center text-center px-6 min-h-screen hero-section-container"
      >
        <div className="fade-in-section main-content">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to MindVault</h1>
          <h1 className="main-heading pop-up-text">Don't just store notes — unlock them.</h1>
          <h2 className="sub-heading-1 pop-up-text" style={{ animationDelay: '0.5s' }}>
            Study Smart. Learn Fast. With AI
          </h2>
          <h3 className="sub-heading-2 pop-up-text" style={{ animationDelay: '1s' }}>
            Upload. Understand. Excel.
          </h3>
          <div className="flex gap-4 justify-center mt-8">
            <button className="primary-btn" onClick={handleGetStartedClick}>
              Get Started
            </button>
            <button className="glow-btn" onClick={() => handleScrollTo('explore')}>
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* EXPLORE SECTION centered */}
      <section
        id="explore"
        className="explore-container fade-in-section flex flex-col items-center justify-center min-h-screen"
      >
        <h2 className="funky-font-title mb-8 text-4xl md:text-5xl text-center">Explore MindVault</h2>
        <div className="explore-cards-row flex flex-wrap justify-center items-center gap-8 w-full max-w-6xl">
          <FeatureCard
            icon="📑"
            title="Upload & Unlock Insights"
            description="Upload your notes in PDF, PPT, or image formats and instantly get concise summaries and visual mind maps powered by AI — no more endless scrolling through pages."
            buttonText="Upload Notes"
            onClick={handleUploadNotesClick}
          />
          <FeatureCard
            icon="🧠"
            title="Quiz yourself on any supported documents"
            description="Turn your study material into personalized quizzes and flashcards in seconds. Practice smarter with auto-generated questions that reinforce key concepts."
            buttonText="Generate Quizzes"
            onClick={handleLoginClick}
          />
          <FeatureCard
            icon="🤖"
            title="Chat & Ask Questions with AI"
            description="Stuck on a topic? Ask your doubts directly to our intelligent chatbot trained on your uploaded content and get clear, contextual answers instantly."
            buttonText="Ask Anything, Anytime"
            onClick={handleLoginClick}
          />
          <FeatureCard
            icon="📱"
            title="Organize, Save & Access Anywhere"
            description="Save your processed notes, summaries, and quizzes in one place. Organize everything neatly and access your personal knowledge vault whenever you need it."
            buttonText="Save Notes"
            onClick={handleLoginClick}
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0d0d0d] text-gray-400 py-6 text-center border-t border-gray-800 mt-20">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} MindVault. All rights reserved.
        </p>
        <div className="flex justify-center space-x-6 mt-3 text-sm">
          <a href="#privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="#terms" className="hover:text-white transition-colors">
            Terms of Service
          </a>
          <a href="#contact" className="hover:text-white transition-colors">
            Contact
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Home;