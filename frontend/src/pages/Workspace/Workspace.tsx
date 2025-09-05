import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './Workspace.css';
import '../Home.css';
import Sidebar from './Sidebar';
import MainSection from './MainSection';
import ChatModal from './ChatModal'; // Make sure this import is uncommented

const Workspace: React.FC = () => {
    const navigate = useNavigate();
    // FIX: Initial state is now empty, so no tab is active on load.
    const [currentView, setCurrentView] = useState('');

    return (
        <div className="workspace-container">
            <Navbar activePage="workspace" isLoggedIn={true} />

            <div className="flex pt-16 h-screen">
                <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
                <MainSection currentView={currentView} setCurrentView={setCurrentView} />
            </div>

            {/* Re-enabling the ChatModal component */}
            <ChatModal />
        </div>
    );
};

export default Workspace;