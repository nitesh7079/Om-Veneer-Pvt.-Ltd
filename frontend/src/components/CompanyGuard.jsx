import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCompany } from '../context/CompanyContext';
import { useAuth } from '../context/AuthContext';

/**
 * CompanyGuard — wraps all ERP pages.
 * If no company is selected, shows a "Select Company" splash screen instead of the page.
 * Once a company is selected, renders children normally.
 */
const CompanyGuard = ({ children }) => {
  const { hasCompany, companies, companiesLoading, selectCompany, fetchCompanies } = useCompany();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCompanies();
    }
  }, [isAuthenticated]);

  // If a company is already selected, render the page
  if (hasCompany) return children;

  // Loading state
  if (companiesLoading) {
    return (
      <div style={styles.root}>
        <div style={styles.card}>
          <div style={styles.spinner} />
          <p style={{ color: '#94a3b8', marginTop: '1rem' }}>Loading companies...</p>
        </div>
      </div>
    );
  }

  // No company selected — show selector
  return (
    <div style={styles.root}>
      {/* Background orbs */}
      <div style={{ ...styles.orb, width: 500, height: 500, background: '#3b82f6', top: -150, right: -100 }} />
      <div style={{ ...styles.orb, width: 380, height: 380, background: '#8b5cf6', bottom: -100, left: -80 }} />
      <div style={{ ...styles.orb, width: 280, height: 280, background: '#06b6d4', top: '40%', left: '30%' }} />
      <div style={styles.gridOverlay} />

      <div style={styles.card}>
        {/* ERP Icon */}
        <div style={styles.iconBadge}>
          <svg width="38" height="38" fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>

        <h1 style={styles.title}>Om ERP</h1>
        <p style={styles.subtitle}>Select a Company to Continue</p>
        <p style={styles.tagline}>All data is scoped to the selected company</p>

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>Choose Company</span>
          <div style={styles.dividerLine} />
        </div>

        {companies.length === 0 ? (
          <div style={styles.emptyState}>
            <svg width="48" height="48" fill="none" stroke="#475569" viewBox="0 0 24 24" style={{ margin: '0 auto 1rem' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>No companies found.</p>
            <Link to="/companies/create" style={styles.createBtn}>
              + Create First Company
            </Link>
          </div>
        ) : (
          <div style={styles.companyList}>
            {companies.map((company) => (
              <button
                key={company._id}
                onClick={() => { selectCompany(company); navigate('/dashboard'); }}
                style={styles.companyBtn}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(59,130,246,0.18)';
                  e.currentTarget.style.borderColor = 'rgba(59,130,246,0.6)';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={styles.companyIcon}>
                  <span style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem' }}>
                    {(company.name || company.companyName || 'C')[0].toUpperCase()}
                  </span>
                </div>
                <div style={{ flex: 1, textAlign: 'left' }}>
                  <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '0.95rem' }}>
                    {company.name || company.companyName}
                  </div>
                  {company.gstin && (
                    <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '2px' }}>
                      GSTIN: {company.gstin}
                    </div>
                  )}
                </div>
                <svg width="18" height="18" fill="none" stroke="#60a5fa" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        )}

        <div style={styles.footer}>
          <Link to="/companies" style={styles.footerLink}>Manage Companies</Link>
          <span style={{ color: '#334155', margin: '0 0.5rem' }}>·</span>
          <Link to="/companies/create" style={styles.footerLink}>Add New</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  root: {
    fontFamily: "'Inter', sans-serif",
    minHeight: '100vh',
    background: '#0a0f1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem',
    position: 'relative',
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    opacity: 0.2,
    pointerEvents: 'none',
  },
  gridOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
    backgroundSize: '50px 50px',
    pointerEvents: 'none',
  },
  card: {
    position: 'relative',
    zIndex: 10,
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '24px',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
    animation: 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
  },
  iconBadge: {
    width: '72px',
    height: '72px',
    borderRadius: '20px',
    background: 'linear-gradient(135deg,#3b82f6 0%,#8b5cf6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.25rem',
    boxShadow: '0 8px 32px rgba(59,130,246,0.5)',
  },
  title: { color: '#f8fafc', fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: '0.3rem', letterSpacing: '-0.5px' },
  subtitle: { color: '#94a3b8', fontSize: '0.9rem', textAlign: 'center', marginBottom: '0.2rem', fontWeight: 500 },
  tagline: { color: '#475569', fontSize: '0.78rem', textAlign: 'center', marginBottom: '1.75rem' },
  divider: { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' },
  dividerLine: { flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' },
  dividerText: { color: '#475569', fontSize: '0.75rem', fontWeight: 500, whiteSpace: 'nowrap' },
  companyList: { display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '320px', overflowY: 'auto', paddingRight: '4px' },
  companyBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    width: '100%',
    padding: '1rem 1.25rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  companyIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  emptyState: { textAlign: 'center', padding: '1.5rem 0' },
  createBtn: {
    display: 'inline-block',
    padding: '0.875rem 2rem',
    background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
    color: 'white',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: 700,
    fontSize: '0.9rem',
  },
  footer: { marginTop: '1.5rem', textAlign: 'center', paddingTop: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.07)' },
  footerLink: { color: '#60a5fa', fontSize: '0.82rem', fontWeight: 600, textDecoration: 'none' },
  spinner: {
    width: '36px', height: '36px',
    border: '3px solid rgba(255,255,255,0.1)',
    borderTop: '3px solid #3b82f6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
    margin: '0 auto',
  },
};

export default CompanyGuard;
