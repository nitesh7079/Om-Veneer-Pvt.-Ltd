import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCompany } from '../context/CompanyContext';

const ERPNavbar = () => {
  const { user, logout } = useAuth();
  const { companies, selectedCompany, selectCompany, fetchCompanies } = useCompany();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleCompanyChange = (company) => {
    selectCompany(company);
    setDropdownOpen(false);
    // Stay on same page but reload context
    navigate(location.pathname, { replace: true });
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="erp-navbar bg-white shadow-xl border-b-2 border-blue-100">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          {/* Logo/Brand */}
          <Link to="/dashboard" className="flex items-center space-x-3 group">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <span className="text-2xl font-bold gradient-text block leading-tight">Om ERP</span>
              <span className="text-xs text-gray-500 font-medium">Enterprise Solution</span>
            </div>
          </Link>

          {/* Center Navigation */}
          <div className="flex items-center space-x-2">
            <Link to="/dashboard" className="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 transition-all duration-300 font-semibold text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Dashboard</span>
              </div>
            </Link>
            <Link to="/vouchers" className="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 transition-all duration-300 font-semibold text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Vouchers</span>
              </div>
            </Link>
            <Link to="/ledgers" className="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 transition-all duration-300 font-semibold text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Ledgers</span>
              </div>
            </Link>
            <Link to="/inventory" className="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 transition-all duration-300 font-semibold text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span>Inventory</span>
              </div>
            </Link>
            <Link to="/reports" className="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 transition-all duration-300 font-semibold text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Reports</span>
              </div>
            </Link>
            <Link to="/companies" className="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 transition-all duration-300 font-semibold text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>Companies</span>
              </div>
            </Link>
            <Link to="/" className="px-4 py-2.5 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 hover:text-green-700 transition-all duration-300 font-semibold text-sm">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span>Website</span>
              </div>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">

            {/* Custom Company Dropdown */}
            {companies.length > 0 && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(prev => !prev)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl hover:border-blue-400 transition-all duration-200 font-semibold text-blue-800 text-sm min-w-[180px] max-w-[240px]"
                >
                  <svg className="w-4 h-4 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="truncate flex-1 text-left">
                    {selectedCompany ? (selectedCompany.name || selectedCompany.companyName) : 'Select Company'}
                  </span>
                  <svg className={`w-4 h-4 text-blue-600 shrink-0 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-blue-100 z-50 overflow-hidden">
                    <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-100">
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Select Company</p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {companies.map((company) => {
                        const isSelected = selectedCompany?._id === company._id;
                        return (
                          <button
                            key={company._id}
                            onClick={() => handleCompanyChange(company)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-150 border-b border-gray-50 last:border-0 ${
                              isSelected
                                ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800'
                                : 'hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 text-gray-700'
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white shrink-0 ${
                              isSelected ? 'bg-gradient-to-br from-blue-600 to-cyan-500' : 'bg-gradient-to-br from-gray-400 to-gray-500'
                            }`}>
                              {(company.name || company.companyName || 'C')[0].toUpperCase()}
                            </div>
                            <span className="font-semibold text-sm truncate">
                              {company.name || company.companyName}
                            </span>
                            {isSelected && (
                              <svg className="w-4 h-4 text-blue-600 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100">
                      <Link
                        to="/companies/create"
                        onClick={() => setDropdownOpen(false)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        + Add New Company
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Badge */}
            <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-cyan-50 px-4 py-2.5 rounded-xl border-2 border-blue-100">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-500 w-10 h-10 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-base">
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="font-bold text-gray-800 text-sm">{user?.username}</p>
                <p className="text-xs text-blue-600 font-semibold uppercase">{user?.role}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold flex items-center space-x-2 text-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ERPNavbar;
