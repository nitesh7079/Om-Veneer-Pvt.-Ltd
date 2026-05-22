import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * NavigateRegistrar — registers the React Router navigate fn
 * into AuthContext so auto-logout can redirect without being
 * inside a Router component at the AuthProvider level.
 */
const NavigateRegistrar = () => {
  const navigate = useNavigate();
  const { registerNavigate } = useAuth();

  useEffect(() => {
    registerNavigate(navigate);
  }, [navigate, registerNavigate]);

  return null;
};

export default NavigateRegistrar;
