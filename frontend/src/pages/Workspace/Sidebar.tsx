import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext'; // Import the useAuth hook

interface SidebarProps {
  setCurrentView: (view: string) => void;
  currentView: string;
}

const Sidebar: React.FC<SidebarProps> = ({ setCurrentView, currentView }) => {
  const [isAccountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement>(null);
  
  // --- Get the logged-in user from the AuthContext ---
  const { user, logout } = useAuth();
  
  // --- Calculate the user's initial for the avatar ---
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

  const NavItem = ({ viewName, label, children }: { viewName: string; label: string; children: React.ReactNode }) => {
    const isActive = currentView === viewName;
    return (
      <a
        href="#"
        onClick={(e) => { e.preventDefault(); setCurrentView(viewName); }}
        className={`flex items-center p-3 rounded-lg transition-colors text-slate-300 hover:bg-white/10 ${isActive ? 'bg-white/10 text-white font-semibold' : ''}`}
      >
        {children}
        <span className="ml-3">{label}</span>
      </a>
    );
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-black/30 p-4 flex flex-col">
      <nav className="flex-grow space-y-2">
        <NavItem viewName="dashboard" label="Dashboard">🏠</NavItem>
        <NavItem viewName="myVault" label="MyVault">🗂️</NavItem>
        <NavItem viewName="aiBot" label="AI Bot">🤖</NavItem>
        <NavItem viewName="planner" label="Planner">📅</NavItem>
        <NavItem viewName="trash" label="Trash">🗑️</NavItem>
        <NavItem viewName="history" label="History">🕒</NavItem>
      </nav>
      <div className="mt-auto relative" ref={accountMenuRef}>
        {isAccountMenuOpen && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-[#27272a] border border-gray-700 rounded-lg shadow-lg">
            <a href="#" className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10">My Profile</a>
            <a href="#" className="block px-4 py-2 text-sm text-slate-300 hover:bg-white/10">Settings</a>
            <div className="border-t border-gray-700 my-1"></div>
            {/* Make the logout button functional */}
            <a href="#" onClick={logout} className="block px-4 py-2 text-sm text-red-400 hover:bg-white/10">Logout</a>
          </div>
        )}
        <button
          onClick={() => setAccountMenuOpen(!isAccountMenuOpen)}
          className="w-full flex items-center p-3 rounded-lg text-slate-300 hover:bg-white/10 transition-colors"
        >
          {/* --- Use the user's initial in the image URL --- */}
          <img src={`https://placehold.co/40x40/9333ea/ffffff?text=${userInitial}`} alt="User Avatar" className="w-8 h-8 rounded-full mr-3"/>
          <span className="font-semibold">My Account</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;