import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface SidebarProps {
  setCurrentView: (view: string) => void;
  currentView: string;
  setIsCollapsed?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setCurrentView, currentView, setIsCollapsed }) => {
  const [isCollapsed, setIsCollapsedLocal] = useState(false);
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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsedLocal(newState);
    if (setIsCollapsed) setIsCollapsed(newState);
  };

  const NavItem = ({
    viewName,
    label,
    children,
  }: {
    viewName: string;
    label: string;
    children: React.ReactNode;
  }) => {
    const isActive =
      currentView === viewName || (viewName === 'vaultAI' && currentView === 'aiBot');

    return (
      <div className="relative group mt-[2px]"> {/* ✅ Slight downward spacing for each item */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setCurrentView(viewName);
          }}
          data-tooltip-id={isCollapsed ? `tooltip-${viewName}` : undefined}
          data-tooltip-content={isCollapsed ? label : undefined}
          data-tooltip-place="right"
          className={`flex items-center p-3 rounded-lg transition-colors ${
            isActive
              ? 'bg-purple-600/30 text-white font-semibold'
              : 'text-slate-400 hover:bg-white/10 hover:text-white'
          } ${isCollapsed ? 'justify-center' : ''}`}
        >
          {children}
          <span className={`ml-3 whitespace-nowrap ${isCollapsed ? 'hidden' : 'block'}`}>
            {label}
          </span>
        </a>
      </div>
    );
  };

  // ✅ Dark gray opaque tooltip styling
  const tooltipStyle = {
    backgroundColor: '#2f2f2f', // dark gray solid
    color: 'white',
    fontSize: '0.8rem',
    borderRadius: '8px',
    padding: '4px 8px',
    border: 'none',
    boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
    zIndex: 9999,
  };

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 bg-black/30 p-4 flex flex-col transition-all duration-300 ease-in-out overflow-visible ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
      style={{ zIndex: 50 }}
    >
      {/* --- Header / Library Title --- */}
      <div className="mb-4 flex items-center relative mt-1"> {/* ✅ Pushed slightly down */}
        {!isCollapsed && (
          <span className="text-white text-2xl font-bold flex-grow pl-2 nav-logo select-none cursor-default relative">
            Library
            <span className="absolute left-0 bottom-[-4px] w-full h-[1px] bg-white/30"></span>
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-full text-slate-300 hover:bg-white/10 transition-colors ml-auto text-xs"
          data-tooltip-id="tooltip-toggle"
          data-tooltip-content={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          data-tooltip-place="right"
        >
          {isCollapsed ? '▶' : '◀'}
        </button>
      </div>

      {/* --- Navigation Items --- */}
      <nav className="flex-grow space-y-2 overflow-y-auto overflow-x-hidden mt-1"> {/* ✅ Shifted entire nav slightly down */}
        <NavItem viewName="dashboard" label="Dashboard">🏠</NavItem>
        <NavItem viewName="myVault" label="MyVault">🗂️</NavItem>
        <NavItem viewName="planner" label="Planner">📅</NavItem>
        <NavItem viewName="vaultAI" label="VaultAI">🤖</NavItem>
        <NavItem viewName="history" label="History">🕒</NavItem>
        <NavItem viewName="trash" label="Trash">🗑️</NavItem>
      </nav>

      {/* --- Account Section --- */}
      <div className="mt-auto relative" ref={accountMenuRef}>
        {isAccountMenuOpen && (
          <div
            className={`absolute bg-[#27272a] rounded-lg shadow-lg border border-gray-700 w-48 ${
              isCollapsed
                ? 'left-full bottom-0 top-[unset] -translate-y-2 mr-2'
                : 'left-0 right-0 bottom-full mb-2'
            }`}
          >
            <a
              href="#"
              className="block px-4 py-2 text-sm text-center text-slate-300 hover:bg-white/10 hover:text-purple-400 transition-colors"
            >
              My Profile
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-center text-slate-300 hover:bg-white/10 hover:text-purple-400 transition-colors"
            >
              Settings
            </a>
            <div className="border-t border-gray-700 my-1"></div>
            <a
              href="#"
              onClick={handleLogout}
              className="block px-4 py-2 text-sm text-center text-red-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
            >
              Logout
            </a>
          </div>
        )}

        <button
          onClick={() => setAccountMenuOpen(!isAccountMenuOpen)}
          className={`w-full flex items-center p-3 rounded-lg text-slate-300 hover:bg-white/10 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white font-bold text-lg flex-shrink-0">
            {userInitial}
          </div>
          <span className={`font-semibold ml-3 ${isCollapsed ? 'hidden' : 'block'}`}>
            {user?.firstName || 'My Account'}
          </span>
        </button>
      </div>

      {/* ✅ Tooltips (dark gray bg, white text) */}
      <Tooltip id="tooltip-toggle" style={tooltipStyle} />
      <Tooltip id="tooltip-dashboard" style={tooltipStyle} />
      <Tooltip id="tooltip-myVault" style={tooltipStyle} />
      <Tooltip id="tooltip-planner" style={tooltipStyle} />
      <Tooltip id="tooltip-vaultAI" style={tooltipStyle} />
      <Tooltip id="tooltip-history" style={tooltipStyle} />
      <Tooltip id="tooltip-trash" style={tooltipStyle} />
    </aside>
  );
};

export default Sidebar;
