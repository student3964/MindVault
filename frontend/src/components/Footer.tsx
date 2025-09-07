// frontend/src/components/Footer.tsx

import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0d0d0d] text-gray-400 py-6 text-center border-t border-gray-800 mt-auto">
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
  );
};

export default Footer;