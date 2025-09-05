import React from 'react';
import Navbar from '../components/Navbar';
import './Home.css';

const About: React.FC = () => {
  // A consistent FeatureCard component for this page
  const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
    <div className="feature-card text-center flex-1 min-w-0">
      <div className="text-4xl mb-4 text-purple-400">{icon}</div>
      <h3 className="feature-card-title">{title}</h3>
      <p className="feature-card-description">{description}</p>
    </div>
  );

  return (
    <div className="home-container">
      <Navbar activePage="about" />

      {/* Main content with improved spacing and layout */}
      <div className="pt-24">
        {/* Section 1: About MindVault */}
        <section className="py-20 px-8 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 funky-font-title">About MindVault</h1>
          <div className="max-w-4xl text-lg leading-relaxed text-gray-300 space-y-6">
            <p>
              MindVault is an AI-powered centralized workspace designed to address the challenges students face in managing and understanding a large volume of educational resources—from notes and PDFs to lecture recordings and tutorials.
            </p>
            <p>
              Our platform turns passive content into active learning tools by offering a unified space for note-taking, Q&A, and summarization. It uses Retrieval-Augmented Generation (RAG) to provide personalized answers based on a student's own materials and can convert static content into dynamic visual representations like mind maps.
            </p>
          </div>
        </section>

        {/* Section 2: Our Features */}
        <section className="py-20 px-8 flex flex-col items-center justify-center bg-black/20">
            <h2 className="text-4xl font-bold mb-12 text-center funky-font-title">Our Features</h2>
            <div className="explore-cards-row flex flex-wrap justify-center items-stretch gap-8 w-full max-w-6xl">
              <FeatureCard
                icon="📑"
                title="Smart Summaries & Mind Maps"
                description="Instantly get concise summaries and visual mind maps powered by AI."
              />
              <FeatureCard
                icon="🧠"
                title="Personalized Quizzes"
                description="Turn your study material into personalized quizzes and flashcards in seconds."
              />
              <FeatureCard
                icon="🤖"
                title="Interactive Q&A Chatbot"
                description="Ask doubts trained on your uploaded content and get clear, contextual answers."
              />
              <FeatureCard
                icon="📱"
                title="Your Knowledge Vault"
                description="Save and organize everything neatly and access your personal knowledge vault anytime."
              />
            </div>
        </section>

        {/* Section 3: Future Scope */}
        <section className="py-20 px-8 flex flex-col items-center justify-center text-center">
            <h2 className="text-4xl font-bold mb-8 funky-font-title">Future Scope</h2>
            <div className="max-w-4xl text-lg leading-relaxed text-gray-300">
                <p className="mb-6">
                    We are continuously working to expand MindVault's capabilities. Our upcoming features include:
                </p>
                {/* Improved List Styling */}
                <ul className="list-none space-y-4 text-left mx-auto max-w-lg">
                    <li className="flex items-start"><span className="text-purple-400 mr-3 mt-1">▶</span> Voice note transcription.</li>
                    <li className="flex items-start"><span className="text-purple-400 mr-3 mt-1">▶</span> Chat history for future reference.</li>
                    <li className="flex items-start"><span className="text-purple-400 mr-3 mt-1">▶</span> Collaborative study features for real-time peer work.</li>
                    <li className="flex items-start"><span className="text-purple-400 mr-3 mt-1">▶</span> AI-powered calendar planning for your study schedule.</li>
                </ul>
            </div>
        </section>
      </div>

      <footer className="bg-[#0d0d0d] text-gray-400 py-6 text-center border-t border-gray-800">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} MindVault. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default About;