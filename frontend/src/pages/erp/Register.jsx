import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register({
      username: formData.username,
      email: formData.email,
      password: formData.password
    });

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

        .login-root {
          font-family: 'Inter', sans-serif;
          min-height: 100vh;
          background: #15191f;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.25;
          animation: float 8s ease-in-out infinite;
          pointer-events: none;
        }
        .orb-1 { width: 500px; height: 500px; background: #c9964a; top: -150px; right: -100px; animation-delay: 0s; }
        .orb-2 { width: 400px; height: 400px; background: #8a6231; bottom: -120px; left: -80px; animation-delay: -3s; }
        .orb-3 { width: 300px; height: 300px; background: rgba(248,250,252,0.3); top: 40%; left: 30%; animation-delay: -6s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.05); }
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 50px 50px;
          pointer-events: none;
        }

        .login-card {
          position: relative;
          z-index: 10;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px;
          padding: 2.75rem 2.5rem;
          width: 100%;
          max-width: 440px;
          box-shadow:
            0 25px 50px -12px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(255,255,255,0.05),
            inset 0 1px 0 rgba(255,255,255,0.1);
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .logo-badge {
          width: 72px;
          height: 72px;
          border-radius: 20px;
          background: linear-gradient(135deg, #dfbe84 0%, #c9964a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          box-shadow: 0 8px 32px rgba(245,158,11,0.5);
          animation: pulse-glow 3s ease-in-out infinite;
        }

        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 8px 32px rgba(245,158,11,0.5); }
          50% { box-shadow: 0 8px 48px rgba(223,190,132,0.7); }
        }

        .login-title { color: #f8fafc; font-size: 1.875rem; font-weight: 800; text-align: center; margin-bottom: 0.35rem; letter-spacing: -0.5px; }
        .login-subtitle { color: #94a3b8; font-size: 0.875rem; text-align: center; margin-bottom: 0.25rem; font-weight: 500; }
        .login-tagline { color: #475569; font-size: 0.8rem; text-align: center; margin-bottom: 2rem; }

        .divider { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.75rem; }
        .divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.08); }
        .divider-text { color: #475569; font-size: 0.75rem; font-weight: 500; white-space: nowrap; }

        .field-label { display: block; color: #94a3b8; font-size: 0.8rem; font-weight: 600; margin-bottom: 0.5rem; letter-spacing: 0.5px; text-transform: uppercase; }
        .field-wrapper { position: relative; margin-bottom: 1.25rem; }
        .field-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #475569;
          transition: color 0.2s;
          pointer-events: none;
        }

        .login-input {
          width: 100%;
          box-sizing: border-box;
          padding: 0.875rem 1rem 0.875rem 3rem;
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: #f1f5f9;
          font-size: 0.9375rem;
          font-family: 'Inter', sans-serif;
          transition: all 0.25s ease;
          outline: none;
        }

        .login-input:focus {
          border-color: #c9964a;
          background: rgba(245,158,11,0.08);
          box-shadow: 0 0 0 4px rgba(245,158,11,0.15);
        }

        .login-input:focus + .field-icon { color: #c9964a; }

        .error-box {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.3);
          border-radius: 10px;
          padding: 0.875rem 1rem;
          margin-bottom: 1.25rem;
          color: #fca5a5;
          font-size: 0.875rem;
          font-weight: 500;
          animation: shake 0.4s ease;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }

        .submit-btn {
          width: 100%;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #dfbe84 0%, #c9964a 100%);
          color: #15191f;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 800;
          font-family: 'Inter', sans-serif;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.625rem;
          transition: all 0.25s ease;
          box-shadow: 0 4px 20px rgba(245,158,11,0.4);
          letter-spacing: 0.3px;
          margin-top: 0.5rem;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(245,158,11,0.55);
        }

        .submit-btn:active:not(:disabled) { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(15,23,42,0.3);
          border-top-color: #15191f;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .login-footer {
          margin-top: 1.75rem;
          text-align: center;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.07);
        }
        .login-footer p { color: #475569; font-size: 0.8rem; margin-bottom: 0.5rem; }
        .login-footer a { color: #c9964a; font-weight: 600; text-decoration: none; transition: color 0.2s; }
        .login-footer a:hover { color: #dfbe84; }
        .login-footer .copyright { color: #334155; font-size: 0.72rem; margin-top: 0.75rem; }

        .back-to-home {
          position: absolute;
          top: 1.5rem;
          left: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #c9964a;
          text-decoration: none;
          font-size: 0.87rem;
          font-weight: 600;
          transition: all 0.3s;
          z-index: 20;
          opacity: 0.8;
        }
        .back-to-home:hover {
          color: #dfbe84;
          opacity: 1;
          transform: translateX(-4px);
        }
      `}</style>

      <div className="login-root">
        <Link to="/" className="back-to-home">
          <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Return to Website
        </Link>
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="grid-overlay" />

        <div className="login-card">
          <div className="logo-badge">
            <svg width="36" height="36" fill="none" stroke="#15191f" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>

          <h1 className="login-title">Create Account</h1>
          <p className="login-tagline">Om Veneer Pvt. Ltd.</p>

          <div className="divider">
            <div className="divider-line" />
            <span className="divider-text">Register for a new account</span>
            <div className="divider-line" />
          </div>

          {error && (
            <div className="error-box">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div>
              <label className="field-label">Username</label>
              <div className="field-wrapper">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="login-input"
                  placeholder="johndoe"
                  required
                  minLength="3"
                />
                <span className="field-icon">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label className="field-label">Email Address</label>
              <div className="field-wrapper">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="login-input"
                  placeholder="you@company.com"
                  required
                />
                <span className="field-icon">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label className="field-label">Password</label>
              <div className="field-wrapper">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="login-input"
                  placeholder="••••••••"
                  required
                  minLength="6"
                />
                <span className="field-icon">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label className="field-label">Confirm Password</label>
              <div className="field-wrapper">
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="login-input"
                  placeholder="••••••••"
                  required
                  minLength="6"
                />
                <span className="field-icon">
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Creating Account...
                </>
              ) : (
                <>
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Register Account
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login">Sign In Instead</Link>
            </p>
            <p className="copyright">© {new Date().getFullYear()} Om Veneer ERP · All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
