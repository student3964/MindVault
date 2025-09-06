// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
//     const { token, isLoading } = useAuth();

//     if (isLoading) {
//         // You can show a loading spinner here while checking auth state
//         return <div>Loading...</div>;
//     }

//     if (!token) {
//         // User not logged in, redirect to login page
//         return <Navigate to="/login" />;
//     }

//     // User is logged in, show the page
//     return children;
// };

// export default ProtectedRoute;