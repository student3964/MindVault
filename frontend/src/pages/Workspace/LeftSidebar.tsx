// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// interface LeftSidebarProps {
//   onMyVaultClick: () => void;
// }

// const LeftSidebar: React.FC<LeftSidebarProps> = ({ onMyVaultClick }) => {
//   const navigate = useNavigate();
//   const [isMyAccountPanelOpen, setIsMyAccountPanelOpen] = useState(false);
//   const myAccountRef = useRef<HTMLDivElement>(null);

//   // Close the account panel if clicking outside of it
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (myAccountRef.current && !myAccountRef.current.contains(event.target as Node)) {
//         setIsMyAccountPanelOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [myAccountRef]);

//   return (
//     <aside className="sidebar">
//       <div className="sidebar-header">
//         <h2 className="simple-bold-font text-xl">MindVault Library</h2>
//       </div>
//       <nav className="sidebar-nav">
//         <ul>
//           <li onClick={onMyVaultClick}>MyVault</li>
//           <li>Trash</li>
//           <li>History</li>
//         </ul>
//       </nav>
//       <div className="sidebar-footer" ref={myAccountRef}>
//         <h3 onClick={() => setIsMyAccountPanelOpen(!isMyAccountPanelOpen)}>My Account</h3>
//         {isMyAccountPanelOpen && (
//           <div className="my-account-panel">
//             <ul className="my-account-nav">
//               <li>Profile</li>
//               <li>Enable Light/Dark Mode</li>
//               <li className="logout-text" onClick={() => navigate('/')}>Log Out →</li>
//             </ul>
//           </div>
//         )}
//       </div>
//     </aside>
//   );
// };

// export default LeftSidebar;