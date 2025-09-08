// frontend/src/pages/Workspace/Sidebar.tsx

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  setCurrentView: (view: string) => void;
  currentView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ setCurrentView, currentView }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  
  const { user, logout } = useAuth();
  const navigate = useNavigate(); 
  
  const userInitial = user?.firstName ? user.firstName.charAt(0).toUpperCase() : 'U';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [accountMenuRef]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const NavItem = ({ viewName, label, children }: { viewName: string; label: string; children: React.ReactNode }) => {
    const isActive = currentView === viewName || (viewName === 'vaultAI' && currentView === 'aiBot'); 
    return (
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); setCurrentView(viewName); }}
        className={`flex items-center p-3 rounded-lg transition-colors group relative ${ isActive ? 'bg-purple-600/30 text-white font-semibold' : 'text-slate-400 hover:bg-white/10 hover:text-white' } ${isCollapsed ? 'justify-center' : ''}`}
      >
        {children}
        <span className={`ml-3 whitespace-nowrap ${ isCollapsed ? 'hidden' : 'block' }`}>{label}</span>
        {isCollapsed && (
          <span className="absolute left-full top-1/2 -translate-y-1/2 ml-4 py-1 px-2 text-sm text-white bg-gray-800 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
            {label}
          </span>
        )}
      </a>
    );
  };

  return (
    <aside className={`flex-shrink-0 bg-black/30 p-4 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="mb-4 flex items-center">
        {!isCollapsed && (
          <a href="#" onClick={() => setCurrentView('dashboard')} className="text-white text-2xl font-bold flex-grow pl-2 nav-logo">
            Library
          </a>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-full text-slate-300 hover:bg-white/10 transition-colors ml-auto"
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>
      
      <nav className="flex-grow space-y-2">
        <NavItem viewName="dashboard" label="Dashboard">🏠</NavItem>
        <NavItem viewName="myVault" label="MyVault">🗂️</NavItem>
        <NavItem viewName="planner" label="Planner">📅</NavItem>
        <NavItem viewName="vaultAI" label="VaultAI">🤖</NavItem>
        <NavItem viewName="history" label="History">🕒</NavItem>
        <NavItem viewName="trash" label="Trash">🗑️</NavItem>
      </nav>

      <div className="mt-auto relative" ref={accountMenuRef}>
        {isAccountMenuOpen && (
          <div className={`absolute bg-[#27272a] rounded-lg shadow-lg border border-gray-700 w-48 ${ isCollapsed ? 'left-full top-1/2 -translate-y-1/2 ml-2' : 'left-0 right-0 bottom-full mb-2' }`}>
            <a href="#" className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10">My Profile</a>
            <a href="#" className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10">Settings</a>
            <div className="border-t border-gray-700 my-1"></div>
            <a href="#" onClick={handleLogout} className="block px-4 py-2 text-sm text-red-400 hover:bg-red-500/20">Logout</a>
          </div>
        )}
        
        <button
          onClick={() => setAccountMenuOpen(!isAccountMenuOpen)}
          className={`w-full flex items-center p-3 rounded-lg text-slate-300 hover:bg-white/10 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-lg flex-shrink-0">
            {userInitial}
          </div>
          <span className={`font-semibold ml-3 ${isCollapsed ? 'hidden' : 'block'}`}>
            {user?.firstName || 'My Account'}
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;