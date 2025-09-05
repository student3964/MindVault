import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import './Workspace.css';
import '../Home.css'; 
import Sidebar from './Sidebar';
import MainSection from './MainSection';
import ChatModal from './ChatModal';

const Workspace: React.FC = () => {
    const navigate = useNavigate();
    // FIX: Default view is now 'dashboard'
    const [currentView, setCurrentView] = useState('dashboard');

    return (
        <div className="workspace-container">
            <Navbar activePage="workspace" isLoggedIn={true} />

            <div className="flex pt-16 h-screen">
                <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
                <MainSection currentView={currentView} setCurrentView={setCurrentView} />
            </div>

            <ChatModal />
        </div>
    );
};

export default Workspace;