import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Navbar from '../../components/ERPNavbar';

const CompanyView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const fetchCompany = async () => {
    try {
      const response = await api.get(`/companies/${id}`);
      setCompany(response.data.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch company');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>Loading company details...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-5xl animate-fade-in-up">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 tracking-tight">{company.name}</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/companies')}
              className="bg-luxury-bg0 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Back to List
            </button>
            {user?.role === 'admin' && (
              <Link
                to={`/companies/edit/${company._id}`}
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
              >
                Edit Company
              </Link>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          {/* Status Badge */}
          <div className="mb-6">
            <span
              className={`inline-block px-4 py-2 rounded text-sm font-semibold ${
                company.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {company.isActive ? '● Active' : '● Inactive'}
            </span>
          </div>

          {/* Basic Information */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-600 text-sm mb-1">Company Name</label>
                <p className="text-gray-900 font-semibold">{company.name}</p>
              </div>
              {company.email && (
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Email</label>
                  <p className="text-gray-900">{company.email}</p>
                </div>
              )}
              {company.phone && (
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Phone</label>
                  <p className="text-gray-900">{company.phone}</p>
                </div>
              )}
              <div>
                <label className="block text-gray-600 text-sm mb-1">Currency</label>
                <p className="text-gray-900">{company.currency}</p>
              </div>
            </div>
          </div>

          {/* Address */}
          {company.address && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.address.street && (
                  <div className="md:col-span-2">
                    <label className="block text-gray-600 text-sm mb-1">Street</label>
                    <p className="text-gray-900">{company.address.street}</p>
                  </div>
                )}
                {company.address.city && (
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">City</label>
                    <p className="text-gray-900">{company.address.city}</p>
                  </div>
                )}
                {company.address.state && (
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">State</label>
                    <p className="text-gray-900">{company.address.state}</p>
                  </div>
                )}
                {company.address.country && (
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Country</label>
                    <p className="text-gray-900">{company.address.country}</p>
                  </div>
                )}
                {company.address.pincode && (
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">Pincode</label>
                    <p className="text-gray-900">{company.address.pincode}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tax Information */}
          {(company.gstin || company.pan) && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
                Tax Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {company.gstin && (
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">GSTIN</label>
                    <p className="text-gray-900 font-mono">{company.gstin}</p>
                  </div>
                )}
                {company.pan && (
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">PAN</label>
                    <p className="text-gray-900 font-mono">{company.pan}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Financial Information */}
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">
              Financial Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {company.financialYear && (
                <>
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">
                      Financial Year Start
                    </label>
                    <p className="text-gray-900">
                      {new Date(company.financialYear.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="block text-gray-600 text-sm mb-1">
                      Financial Year End
                    </label>
                    <p className="text-gray-900">
                      {new Date(company.financialYear.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </>
              )}
              {company.booksBeginningFrom && (
                <div>
                  <label className="block text-gray-600 text-sm mb-1">
                    Books Beginning From
                  </label>
                  <p className="text-gray-900">
                    {new Date(company.booksBeginningFrom).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t pt-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Metadata</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <label className="block text-gray-500 mb-1">Created At</label>
                <p>{new Date(company.createdAt).toLocaleString()}</p>
              </div>
              <div>
                <label className="block text-gray-500 mb-1">Last Updated</label>
                <p>{new Date(company.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyView;
