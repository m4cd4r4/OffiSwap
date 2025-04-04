import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode v4+

// Create Context
const AuthContext = createContext(null);

// Initial state helper: check localStorage for existing token
const getInitialAuthState = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode(token);
      // Optional: Check token expiry here if needed
      // if (decoded.exp * 1000 < Date.now()) {
      //   localStorage.removeItem('token');
      //   return { token: null, user: null, isAuthenticated: false, isLoading: false };
      // }
      // Set axios default header for subsequent requests
      axios.defaults.headers.common['x-auth-token'] = token;
      return { token: token, user: decoded.user, isAuthenticated: true, isLoading: false };
    } catch (error) {
      console.error("Error decoding token on initial load:", error);
      localStorage.removeItem('token'); // Remove invalid token
      delete axios.defaults.headers.common['x-auth-token'];
      return { token: null, user: null, isAuthenticated: false, isLoading: false };
    }
  }
  return { token: null, user: null, isAuthenticated: false, isLoading: true }; // Start loading true if no token
};


// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState(getInitialAuthState);

  // Effect to set loading to false after initial check if no token was found
  useEffect(() => {
    if (!localStorage.getItem('token')) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);


  // Login function
  const login = async (email, password) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null })); // Start loading, clear error
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ email, password });

    try {
      const res = await axios.post('/api/auth/login', body, config);
      const { token } = res.data;
      localStorage.setItem('token', token); // Store token
      const decoded = jwtDecode(token);
      axios.defaults.headers.common['x-auth-token'] = token; // Set default header
      setAuthState({
        token: token,
        user: decoded.user,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      return true; // Indicate success
    } catch (err) {
      console.error('Login Context Error:', err.response?.data || err.message);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['x-auth-token'];
      setAuthState({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: err.response?.data?.message || 'Login failed'
      });
      return false; // Indicate failure
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['x-auth-token'];
    setAuthState({ token: null, user: null, isAuthenticated: false, isLoading: false, error: null });
    // Optionally redirect using useNavigate if needed outside component scope
  };

  // Value provided by the context
  const value = {
    ...authState, // token, user, isAuthenticated, isLoading, error
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
