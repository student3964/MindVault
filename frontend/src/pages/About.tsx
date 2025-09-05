import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';

// --- Embedded CSS Styles (to resolve import errors) ---
const AboutStyles = () => (
    <style>{`
        /* --- Home.css styles --- */
        @import url('https://fonts.googleapis.com/css2?family=Ink+Free&display=swap');

        /* Main Container */
        .home-container {
            background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/homepage-gif.gif');
            background-size: cover; background-position: center; background-attachment: fixed;
            min-height: 100vh; width: 100vw; margin: 0; padding: 0;
            font-family: 'Segoe UI', sans-serif; color: white; overflow-x: hidden;
        }

        /* Navbar */
        .nav-bar { background-color: #1a1a1a; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border-bottom: 1px solid rgba(160,32,240,0.2); }
        .nav-link { color: #ccc; transition: color 0.3s ease-in-out; font-weight: 600; padding-bottom: 5px; }
        .nav-link:hover { color: #a020f0; }
        .nav-logo { font-family: 'Segoe UI', sans-serif; font-weight: bold; font-size: 1.5rem; color: white; transition: all 0.3s ease; }
        .nav-logo:hover { transform: scale(1.05); color: #a020f0; }

        /* Buttons */
        .primary-btn { background-image: linear-gradient(to right, #8b5cf6, #a855f7); color: white; padding: 0.5rem 1.25rem; font-size: 0.9rem; font-weight: 600; border-radius: 0.75rem; border: none; cursor: pointer; }
        .primary-btn:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(168, 85, 247, 0.25); }
        
        /* FIX: Set a fixed width on the glow-btn */
        .glow-btn {
            background-color: rgba(255, 255, 255, 0.05);
            border: 1px solid #4a4a4a;
            color: #e2e8f0;
            padding: 0.5rem 0; /* Adjusted padding for fixed width */
            font-size: 0.9rem;
            font-weight: 600;
            border-radius: 0.75rem;
            cursor: pointer;
            width: 90px; /* This ensures the button width is consistent */
            text-align: center;
            transition: all 0.2s ease-out;
        }
        .glow-btn:hover { background-color: rgba(168, 85, 247, 0.1); border-color: #a855f7; color: white; }
        
        /* Titles & Cards */
        .funky-font-title { font-family: 'Ink Free', cursive; font-weight: bold; font-size: 2.5rem; text-align: center; color: white; text-shadow: 1px 1px 5px rgba(160, 32, 240, 0.5); }
        .feature-card { flex: 1 1 200px; min-width: 200px; max-width: 280px; background: linear-gradient(to bottom right, #271348, #44298a); border-radius: 1rem; box-shadow: 0 0 12px rgba(255, 255, 255, 0.1); padding: 1.5rem; text-align: center; display: flex; flex-direction: column; justify-content: space-between; transition: all 0.3s ease-in-out; border: 1px solid transparent; }
        .feature-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 10px 30px rgba(139, 92, 246, 0.15); border: 1px solid rgba(160, 32, 240, 0.3); }
        .feature-card-title { font-weight: 600; font-size: 1.5rem; margin-bottom: 0.5rem; }
        .feature-card-description { font-size: 0.95rem; color: #ccc; margin-bottom: 1rem; }
        .explore-cards-row { display: flex; flex-wrap: wrap; justify-center; gap: 1.5rem; width: 100%; }
    `}</style>
);

// --- Embedded Navbar Component ---
const Navbar: React.FC<{ activePage: string }> = ({ activePage }) => {
    const navigate = useNavigate();
    return (
        <nav className="nav-bar fixed w-full top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-3">
                <RouterLink to="/" className="nav-logo cursor-pointer">MindVault</RouterLink>
                <div className="hidden md:flex space-x-8 text-lg font-medium">
                    <RouterLink to="/" className={`nav-link ${activePage === 'home' ? 'text-purple-400' : 'text-gray-300'}`}>Home</RouterLink>
                    <RouterLink to="/#explore" className={`nav-link ${activePage === 'explore' ? 'text-purple-400' : 'text-gray-300'}`}>Explore</RouterLink>
                    <RouterLink to="/workspace" className={`nav-link ${activePage === 'workspace' ? 'text-purple-400' : 'text-gray-300'}`}>Workspace</RouterLink>
                    <RouterLink to="/about" className={`nav-link ${activePage === 'about' ? 'text-purple-400' : 'text-gray-300'}`}>About</RouterLink>
                </div>
                <div className="flex space-x-4">
                    <button className="glow-btn" onClick={() => navigate('/login')}>Login</button>
                </div>
            </div>
        </nav>
    );
};


const About: React.FC = () => {
  // A consistent FeatureCard component for this page
  const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
    <div className="feature-card flex-1 min-w-0">
      <div className="text-center">
        <div className="text-4xl mb-4 text-purple-400">{icon}</div>
        <h3 className="feature-card-title">{title}</h3>
        <p className="feature-card-description">{description}</p>
      </div>
    </div>
  );

  return (
    <>
      <AboutStyles />
      <div className="home-container">
        <Navbar activePage="about" />
        <div className="pt-24">
          <section className="py-20 px-8 flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 funky-font-title">About MindVault</h1>
            <div className="max-w-4xl text-lg leading-relaxed text-gray-300 space-y-6">
              <p>MindVault is an AI-powered centralized workspace designed to address the challenges students face in managing and understanding a large volume of educational resources—from notes and PDFs to lecture recordings and tutorials.</p>
              <p>Our platform turns passive content into active learning tools by offering a unified space for note-taking, Q&A, and summarization.</p>
            </div>
          </section>

          <section className="py-20 px-8 flex flex-col items-center justify-center bg-black/20">
              <h2 className="text-4xl font-bold mb-12 text-center funky-font-title">Our Features</h2>
              <div className="explore-cards-row flex-wrap justify-center items-stretch gap-8 w-full max-w-6xl">
                <FeatureCard icon="📑" title="Smart Summaries & Mind Maps" description="Instantly get concise summaries and visual mind maps powered by AI." />
                <FeatureCard icon="🧠" title="Personalized Quizzes" description="Turn your study material into personalized quizzes and flashcards in seconds." />
                <FeatureCard icon="🤖" title="Interactive Q&A Chatbot" description="Ask doubts trained on your uploaded content and get clear, contextual answers." />
                <FeatureCard icon="📱" title="Your Knowledge Vault" description="Save and organize everything neatly and access your personal knowledge vault anytime." />
              </div>
          </section>
        </div>

        <footer className="bg-[#0d0d0d] text-gray-400 py-6 text-center border-t border-gray-800">
          <p className="text-sm">&copy; {new Date().getFullYear()} MindVault. All rights reserved.</p>
        </footer>
      </div>
    </>
  );
};

export default About;

