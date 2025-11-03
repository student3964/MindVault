// frontend/src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();

    // While we are checking for the token, show a loading state.
    if (loading) {
        // You can replace this with a more stylish spinner component
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <h2>Loading...</h2>
            </div>
        );
    }

    // After loading, if the user is not logged in, redirect to login page.
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // If loading is finished and user is logged in, show the protected content.
    return children;
};

export default ProtectedRoute;