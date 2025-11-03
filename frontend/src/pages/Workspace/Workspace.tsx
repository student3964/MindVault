import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import './Workspace.css';
import '../Home.css';
import Sidebar from './Sidebar';
import MainSection from './MainSection';
import ChatModal from './ChatModal';

const Workspace: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleWorkspaceNavClick = () => {
    setCurrentView('dashboard');
  };

  return (
    <div className="workspace-container">
      <Navbar
        activePage="workspace"
        isLoggedIn={true}
        onWorkspaceClick={handleWorkspaceNavClick}
      />

      <div className="flex pt-16 h-screen relative">
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          // Pass collapse state to Sidebar
          setIsCollapsed={setIsSidebarCollapsed}
        />
        <div
          className={`main-content-wrapper transition-all duration-300 ease-in-out ${
            isSidebarCollapsed ? 'collapsed' : 'expanded'
          }`}
        >
          <MainSection
            currentView={currentView}
            setCurrentView={setCurrentView}
          />
        </div>
      </div>

      {currentView !== 'vaultAI' && <ChatModal />}
    </div>
  );
};

export default Workspace;
