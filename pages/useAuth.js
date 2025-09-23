// This file has been moved to hooks/useAuth.js. Please update your imports accordingly.
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    // Start undefined to avoid "false" flashes, then set real value after checking localStorage
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        setIsAuthenticated(!!token);
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
