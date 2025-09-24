import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount, validate structure
  useEffect(() => {
    const storedUser = localStorage.getItem('adminUser');
    let parsedUser = null;
    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser);
        // Validate user object structure (must have email and token)
        if (!parsedUser || !parsedUser.email || !parsedUser.token) {
          throw new Error('Invalid user data');
        }
        setUser(parsedUser);
      } catch (e) {
        // Corrupted or invalid user, clear it
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminToken');
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('adminUser', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminUser');
    localStorage.removeItem('adminToken');
  };

  return { user, login, logout, loading };
}
