import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api, { cachedGet } from '../../utils/api';
import { cacheInvalidate } from '../../utils/cache';
import Navbar from '../../components/ERPNavbar';
import { SkeletonCard } from '../../components/TableSkeleton';

const CompanyList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await cachedGet('/companies');
      setCompanies(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch companies');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this company?')) {
      try {
        await api.delete(`/companies/${id}`);
        cacheInvalidate('/companies');
        fetchCompanies();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete company');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="mb-10">
            <div style={{ height: '48px', width: '300px', borderRadius: '12px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', marginBottom: '1rem' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-10 animate-fade-in">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">Companies</h1>
            <p className="text-gray-600 text-lg">Manage your business entities</p>
          </div>
          <Link
            to="/companies/create"
            className="btn-gradient text-white px-8 py-4 rounded-xl hover:shadow-2xl font-bold text-lg shadow-xl flex items-center space-x-2 transform transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Company</span>
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 text-red-800 px-5 py-4 rounded-lg mb-6 animate-fade-in shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="font-semibold">{error}</p>
            </div>
          </div>
        )}

        {companies.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center animate-fade-in">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Companies Yet</h3>
            <p className="text-gray-500 mb-6">Create your first company to get started with your ERP system</p>
            <Link to="/companies/create" className="btn-gradient text-white px-6 py-3 rounded-xl shadow-lg inline-block">Create First Company</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company, index) => (
              <div
                key={company._id}
                className="bg-white p-8 rounded-2xl shadow-xl border-t-4 border-blue-500 hover:shadow-2xl transition-all duration-300 card-hover animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {company.name}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      company.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {company.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="text-sm text-gray-600 space-y-2 mb-4">
                  {company.address && (
                    <p>
                      📍 {company.address.city && `${company.address.city}, `}
                      {company.address.state}
                    </p>
                  )}
                  {company.gstin && <p>🏢 GSTIN: {company.gstin}</p>}
                  {company.email && <p>📧 {company.email}</p>}
                  {company.phone && <p>📞 {company.phone}</p>}
                  {company.financialYear && (
                    <p>
                      📅 FY: {new Date(company.financialYear.startDate).toLocaleDateString()} - {new Date(company.financialYear.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/companies/${company._id}`}
                    className="flex-1 bg-blue-500 text-white text-center px-4 py-2 rounded hover:bg-blue-600"
                  >
                    View
                  </Link>
                  <Link
                    to={`/companies/edit/${company._id}`}
                    className="flex-1 bg-yellow-500 text-white text-center px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(company._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyList;
