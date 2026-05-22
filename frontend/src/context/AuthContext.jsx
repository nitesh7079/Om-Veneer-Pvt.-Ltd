import React, { createContext, useState, useContext, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const AuthContext = createContext();

// 30 minutes in milliseconds
const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
// Show warning 5 minutes before logout
const WARNING_BEFORE_MS = 5 * 60 * 1000;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInactivityWarning, setShowInactivityWarning] = useState(false);
  const [warningCountdown, setWarningCountdown] = useState(300); // 5 minutes in seconds

  const logoutTimerRef = useRef(null);
  const warningTimerRef = useRef(null);
  const countdownIntervalRef = useRef(null);
  const isAuthRef = useRef(false);

  // Navigate ref — cannot use useNavigate at provider level (outside Router),
  // so we store a navigate callback set by a child component
  const navigateRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      isAuthRef.current = true;
    }
    setLoading(false);
  }, []);

  // ── Activity tracking ──────────────────────────────────────────────
  const clearAllTimers = useCallback(() => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    logoutTimerRef.current = null;
    warningTimerRef.current = null;
    countdownIntervalRef.current = null;
  }, []);

  const performAutoLogout = useCallback(() => {
    // Clear all credentials
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedCompanyId');
    localStorage.removeItem('selectedCompanyName');
    setUser(null);
    setShowInactivityWarning(false);
    isAuthRef.current = false;
    clearAllTimers();

    // Redirect to login with timeout reason
    if (navigateRef.current) {
      navigateRef.current('/login?reason=timeout');
    } else {
      window.location.href = '/login?reason=timeout';
    }
  }, [clearAllTimers]);

  const startInactivityTimer = useCallback(() => {
    if (!isAuthRef.current) return;
    clearAllTimers();
    setShowInactivityWarning(false);

    // Warning timer (fires 5 min before logout)
    warningTimerRef.current = setTimeout(() => {
      setShowInactivityWarning(true);
      setWarningCountdown(300);
      countdownIntervalRef.current = setInterval(() => {
        setWarningCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, INACTIVITY_TIMEOUT_MS - WARNING_BEFORE_MS);

    // Auto-logout timer (fires after 30 min)
    logoutTimerRef.current = setTimeout(() => {
      performAutoLogout();
    }, INACTIVITY_TIMEOUT_MS);
  }, [clearAllTimers, performAutoLogout]);

  const resetInactivityTimer = useCallback(() => {
    if (!isAuthRef.current) return;
    setShowInactivityWarning(false);
    startInactivityTimer();
  }, [startInactivityTimer]);

  // Attach/detach activity listeners
  useEffect(() => {
    if (!user) {
      clearAllTimers();
      return;
    }
    isAuthRef.current = true;
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll', 'click'];
    events.forEach(e => window.addEventListener(e, resetInactivityTimer, { passive: true }));
    startInactivityTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetInactivityTimer));
      clearAllTimers();
    };
  }, [user]);

  // ── Auth actions ───────────────────────────────────────────────────
  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { data } = response.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      isAuthRef.current = true;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      const { data } = response.data;

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      isAuthRef.current = true;

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('selectedCompanyId');
    localStorage.removeItem('selectedCompanyName');
    setUser(null);
    setShowInactivityWarning(false);
    isAuthRef.current = false;
    clearAllTimers();
  }, [clearAllTimers]);

  // Provide a way for a component inside Router to register the navigate fn
  const registerNavigate = useCallback((fn) => {
    navigateRef.current = fn;
  }, []);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    registerNavigate,
    isAuthenticated: !!user,
    // Inactivity warning state
    showInactivityWarning,
    warningCountdown,
    dismissWarning: resetInactivityTimer, // user clicked "Stay Logged In"
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {/* Global inactivity warning modal */}
      {showInactivityWarning && (
        <div style={warningStyles.overlay}>
          <div style={warningStyles.modal}>
            <div style={warningStyles.icon}>⏱️</div>
            <h2 style={warningStyles.title}>Still there?</h2>
            <p style={warningStyles.msg}>
              You'll be logged out automatically in{' '}
              <strong style={{ color: '#f87171' }}>
                {Math.floor(warningCountdown / 60)}:{String(warningCountdown % 60).padStart(2, '0')}
              </strong>{' '}
              due to inactivity.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem' }}>
              <button
                onClick={resetInactivityTimer}
                style={warningStyles.stayBtn}
              >
                Stay Logged In
              </button>
              <button
                onClick={performAutoLogout}
                style={warningStyles.logoutBtn}
              >
                Logout Now
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

const warningStyles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.65)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  modal: {
    background: '#1e293b',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '2.5rem',
    maxWidth: '380px',
    width: '90%',
    textAlign: 'center',
    boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
    animation: 'slideUp 0.3s ease',
  },
  icon: { fontSize: '2.5rem', marginBottom: '1rem' },
  title: { color: '#f1f5f9', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.5rem' },
  msg: { color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6 },
  stayBtn: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  logoutBtn: {
    padding: '0.75rem 1.5rem',
    background: 'rgba(239,68,68,0.15)',
    color: '#fca5a5',
    border: '1px solid rgba(239,68,68,0.3)',
    borderRadius: '10px',
    fontWeight: 700,
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
};
