import { useEffect, useRef } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import "./About.css";

const About = () => {
  const animatedContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const animatedElements = animatedContainerRef.current
      ? Array.from(
          animatedContainerRef.current.querySelectorAll(
            ".fade-in, .slide-in-left, .slide-in-right, .slide-in-up"
          )
        )
      : [];

    if (animatedElements) {
      animatedElements.forEach((el) => observer.observe(el));
    }

    return () => {
      if (animatedElements) {
        animatedElements.forEach((el) => observer.unobserve(el));
      }
      observer.disconnect();
    };
  }, []);

  return (
    <div className="home-container font-sans min-h-screen">
      {/* ABOUT PAGE */}
      <section
        id="about"
        className="about-section pt-24 md:pt-32 px-4 text-gray-100 mt-24"
      >
        {/* OUR MISSION & VISION */}
        <div className="about-section mission py-16 px-6 rounded-lg mb-24">
          <h2 className="shiny-text mb-12">Our Mission & Vision</h2>
          <div className="text-center">
            <p className="mission-description">
              At MindVault, our mission is to transform the way students learn
              by turning scattered resources into clear, connected, and
              interactive knowledge.
            </p>
            <p className="mission-description">
              We aim to remove the stress of managing information, so learners
              can focus on what truly matters—understanding and applying it.
            </p>
            <p className="mission-description">
              We envision a world where AI becomes every student’s personal
              learning companion—making education more accessible, engaging, and
              effective.
            </p>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="about-section how-it-works py-16 px-6 rounded-lg">
          <div ref={animatedContainerRef}>
            <h2 className="how-heading slide-in-up">How It Works</h2>

            {/* AI-Powered Transformation */}
            <div className="flex flex-col md:flex-row items-center mb-24">
              <div className="md:w-1/2 py-6 pl-6 pr-2 slide-in-left">
                <h3 className="text-3xl font-semibold text-purple-400 mb-4">
                  AI-Powered Transformation
                </h3>
                <p className="text-gray-300 mb-4">
                  MindVault leverages the Gemini API to turn your passive notes
                  into dynamic learning tools.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  <li>
                    <p className="font-bold inline">AI-driven summarization</p>
                    for quick review of large documents.
                  </li>
                  <li>
                    <p className="font-bold inline">Automated quiz generation</p>
                    to test your knowledge retention.
                  </li>
                  <li>
                    <p className="font-bold inline">Mind map creation</p> to help
                    visualize complex topics.
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 p-6 slide-in-right">
                <div className="info-card">
                  <div className="text-purple-400 text-6xl mb-4 text-center">
                    🧠
                  </div>
                  <p className="text-lg text-gray-300 text-center">
                    Transforming your study habits with intelligence and efficiency.
                  </p>
                </div>
              </div>
            </div>

            {/* Seamless Interaction */}
            <div className="flex flex-col md:flex-row-reverse items-center mb-24">
              <div className="md:w-1/2 py-6 pl-10 pr-6 slide-in-right">
                <h3 className="text-3xl font-semibold text-purple-400 mb-4">
                  Seamless Interaction
                </h3>
                <p className="text-gray-300 mb-4">
                  Interact with your documents like never before. MindVault
                  supports various file types and smart tools.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  <li>
                    <p className="font-bold inline">Interactive AI Chat</p> for
                    instant answers.
                  </li>
                  <li>
                    Transcribe <p className="font-bold inline">lectures</p> &
                    <p className="font-bold inline"> images</p> into text.
                  </li>
                  <li>
                    <p className="font-bold inline">Chat History</p> saved for
                    easy revisit.
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 p-6 slide-in-left">
                <div className="info-card">
                  <div className="text-purple-400 text-6xl mb-4 text-center">
                    💬
                  </div>
                  <p className="text-lg text-gray-300 text-center">
                    Engage with your notes through intelligent, conversational AI.
                  </p>
                </div>
              </div>
            </div>

            {/* Built for Collaboration */}
            <div className="flex flex-col md:flex-row items-center mb-24">
              <div className="md:w-1/2 py-6 pl-6 pr-2 slide-in-left">
                <h3 className="text-3xl font-semibold text-purple-400 mb-4">
                  Built for Collaboration
                </h3>
                <p className="text-gray-300 mb-4">
                  MindVault is designed for teamwork and intelligent planning to
                  help you succeed.
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                  <li>Collaborate on notes & summaries in real-time.</li>
                  <li>
                    <p className="font-bold inline">AI-Powered Calendar</p> for
                    optimized study schedules.
                  </li>
                  <li>
                    A strong foundation for{" "}
                    <p className="font-bold inline">academic success</p>.
                  </li>
                </ul>
              </div>
              <div className="md:w-1/2 p-6 slide-in-right">
                <div className="info-card">
                  <div className="text-purple-400 text-6xl mb-4 text-center">
                    👥
                  </div>
                  <p className="text-lg text-gray-300 text-center">
                    Learn together and plan your future with smart, shared tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;