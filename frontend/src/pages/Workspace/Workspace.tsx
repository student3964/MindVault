import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import './Workspace.css';
import '../Home.css'; 
import Sidebar from './Sidebar';
import MainSection from './MainSection';
import ChatModal from './ChatModal';

const Workspace: React.FC = () => {
    const [currentView, setCurrentView] = useState('dashboard');

    // This function resets the view to the dashboard
    const handleWorkspaceNavClick = () => {
        setCurrentView('dashboard');
    };

    return (
        <div className="workspace-container">
            {/* We pass the reset function down to the Navbar */}
            <Navbar 
                activePage="workspace" 
                isLoggedIn={true} 
                onWorkspaceClick={handleWorkspaceNavClick} 
            />

            <div className="flex pt-16 h-screen">
                <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
                <MainSection currentView={currentView} setCurrentView={setCurrentView} />
            </div>

            <ChatModal />
        </div>
    );
};

export default Workspace;