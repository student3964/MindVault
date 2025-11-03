import React, { useState, useEffect, useRef } from 'react';
import { scroller, Link } from 'react-scroll';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [typingText, setTypingText] = useState('');
  const textPhaseOne = "Don't just store notes — unlock them.";
  const textPhaseTwo = "Upload. Understand. Excel.";

  const handleScrollTo = (section: string) => {
    scroller.scrollTo(section, {
      smooth: true,
      duration: 500,
      offset: -70,
    });
  };

  useEffect(() => {
    let currentText = '';
    const typingSpeed = 45; // Slower speed
    const pauseDuration = 800; // Longer pause

    const typeLine = (text: string, onComplete: () => void) => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          currentText += text[i];
          setTypingText(currentText);
          i++;
        } else {
          clearInterval(interval);
          onComplete();
        }
      }, typingSpeed);
    };

    typeLine(textPhaseOne, () => {
      setTimeout(() => {
        currentText += '\n';
        setTypingText(currentText);
        typeLine(textPhaseTwo, () => {
          // Animation is complete
        });
      }, pauseDuration);
    });

    return () => {
      // Cleanup is not strictly necessary but good practice
    };
  }, []);

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
  }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        },
        {
          threshold: 0.1,
        }
      );

      if (cardRef.current) {
        observer.observe(cardRef.current);
      }

      return () => {
        if (cardRef.current) {
          observer.unobserve(entry.target);
        }
      };
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        setSpotlightPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    return (
      <div
        className="feature-card"
        ref={cardRef}
        onMouseMove={handleMouseMove}
      >
        <div
          className="spotlight"
          style={{
            background: `radial-gradient(circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(160, 32, 240, 0.4) 0%, rgba(160, 32, 240, 0) 50%)`,
          }}
        ></div>
        <div className="feature-card-content flex-1 min-w-0">
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
      </div>
    );
  };

  return (
    <div className="home-container font-sans">
      {/* HERO SECTION */}
      <section
        id="home"
        className="pt-24 pb-16 flex flex-col justify-center items-center text-center px-6 min-h-screen"
      >
        <div className="fade-in-section">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Welcome to MindVault
          </h1>
          <h1 className="main-heading typewriter-text">
            {typingText.split('\n').map((line, index) => (
              <span key={index} className={`typewriter-line`}>
                {line}
              </span>
            ))}
          </h1>
          <div className="flex gap-4 justify-center mt-8">
            <button className="primary-btn" onClick={() => navigate('/signup')}>
              Get Started
            </button>
            <button className="login-glow-btn" onClick={() => handleScrollTo('explore')}>
                Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* EXPLORE SECTION */}
      <section
        id="explore"
        className="explore-container flex flex-col items-center justify-center min-h-screen"
      >
        <h2 className="explore-title mb-16 text-4xl md:text-5xl text-center">
          <span className="shiny-text">Explore MindVault</span>
        </h2>
        <div className="explore-cards-row flex flex-wrap justify-center items-stretch gap-8 w-full max-w-6xl">
          <FeatureCard
            icon="✨"
            title="Summarize Instantly"
            description="Quickly condense PDFs, PPTs, or handwritten notes into clear and concise overviews. Let AI do the heavy lifting while you focus on learning."
            buttonText="Summarize Notes"
            onClick={() => navigate('/login')}
          />
          <FeatureCard
            icon="🧠"
            title="Generate MCQs"
            description="Practice smarter by turning your study material into auto-generated MCQs. Reinforce key concepts and track your preparation effectively."
            buttonText="Generate MCQs"
            onClick={() => navigate('/login')}
          />
          <FeatureCard
            icon="🗺️"
            title="Mind Map"
            description="Transform static notes into dynamic visual maps. Discover relationships between ideas and build a stronger understanding of complex topics."
            buttonText="Create Mind Map"
            onClick={() => navigate('/login')}
          />
          <FeatureCard
            icon="📱"
            title="Save Notes"
            description="Keep all your processed content—summaries, quizzes, and maps—organized in one secure place. Access them anytime with ease."
            buttonText="Save Notes"
            onClick={() => navigate('/login')}
          />
        </div>
      </section>
    </div>
  );
};

export default Home;