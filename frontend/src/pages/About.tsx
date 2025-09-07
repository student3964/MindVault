// frontend/src/pages/About.tsx

import React from 'react';

// A consistent FeatureCard component for this page
const FeatureCard = ({ icon, title, description }: { icon: string; title: string; description: string }) => (
    <div className="flex flex-1 flex-col justify-between rounded-2xl border border-transparent bg-gradient-to-br from-[#271348] to-[#44298a] p-6 text-center shadow-lg transition-all hover:-translate-y-1.5 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 hover:border-purple-500/50" style={{minWidth: '200px', maxWidth: '280px'}}>
        <div className="text-center">
            <div className="mb-4 text-4xl text-purple-400">{icon}</div>
            <h3 className="mb-2 text-xl font-semibold">{title}</h3>
            <p className="text-sm text-gray-300">{description}</p>
        </div>
    </div>
);


const About: React.FC = () => {
  return (
    // The only change is here: I've added 'pb-20' for extra padding at the bottom.
    <div className="pt-24 pb-20 text-white"> 
      <section className="flex flex-col items-center justify-center px-8 py-20 text-center">
        <h1 className="funky-font-title mb-6 text-5xl font-bold md:text-6xl" style={{fontFamily: '"Ink Free", cursive'}}>
            About MindVault
        </h1>
        <div className="max-w-4xl space-y-6 text-lg leading-relaxed text-gray-300">
          <p>MindVault is an AI-powered centralized workspace designed to address the challenges students face in managing and understanding a large volume of educational resources—from notes and PDFs to lecture recordings and tutorials.</p>
          <p>Our platform turns passive content into active learning tools by offering a unified space for note-taking, Q&A, and summarization.</p>
        </div>
      </section>

      <section className="flex flex-col items-center justify-center bg-black/20 px-8 py-20">
          <h2 className="funky-font-title mb-12 text-center text-4xl font-bold" style={{fontFamily: '"Ink Free", cursive'}}>
            Our Features
          </h2>
          <div className="flex w-full max-w-6xl flex-wrap items-stretch justify-center gap-8">
            <FeatureCard icon="📑" title="Smart Summaries & Mind Maps" description="Instantly get concise summaries and visual mind maps powered by AI." />
            <FeatureCard icon="🧠" title="Personalized Quizzes" description="Turn your study material into personalized quizzes and flashcards in seconds." />
            <FeatureCard icon="🤖" title="Interactive Q&A Chatbot" description="Ask doubts trained on your uploaded content and get clear, contextual answers." />
            <FeatureCard icon="📱" title="Your Knowledge Vault" description="Save and organize everything neatly and access your personal knowledge vault anytime." />
          </div>
      </section>
    </div>
  );
};

export default About;