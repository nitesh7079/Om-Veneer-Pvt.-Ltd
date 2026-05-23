import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/ERPNavbar';

const CompanyEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    },
    gstin: '',
    pan: '',
    financialYear: {
      startDate: '',
      endDate: ''
    },
    email: '',
    phone: '',
    website: '',
    isActive: true
  });

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const fetchCompany = async () => {
    try {
      const response = await api.get(`/companies/${id}`);
      const company = response.data.data;
      setFormData({
        name: company.name || '',
        address: {
          street: company.address?.street || '',
          city: company.address?.city || '',
          state: company.address?.state || '',
          pincode: company.address?.pincode || ''
        },
        gstin: company.gstin || '',
        pan: company.pan || '',
        financialYear: {
          startDate: company.financialYear?.startDate ? company.financialYear.startDate.split('T')[0] : '',
          endDate: company.financialYear?.endDate ? company.financialYear.endDate.split('T')[0] : ''
        },
        email: company.email || '',
        phone: company.phone || '',
        website: company.website || '',
        isActive: company.isActive !== undefined ? company.isActive : true
      });
      setLoading(false);
    } catch (err) {
      console.error('Error fetching company:', err);
      alert('Failed to load company details');
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name) {
      alert('Company name is required');
      return;
    }

    try {
      await api.put(`/companies/${id}`, formData);
      alert('Company updated successfully!');
      navigate('/companies');
    } catch (err) {
      console.error('Error updating company:', err);
      alert(err.response?.data?.message || 'Failed to update company');
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
      <Navbar />
      <div className="container mx-auto px-4 py-10 max-w-4xl animate-fade-in-up">
        <h1 className="text-4xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 mb-8 tracking-tight text-center">Edit Company</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">
                Company Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Address Fields */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Street Address</label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">State</label>
              <input
                type="text"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Pincode</label>
              <input
                type="text"
                name="address.pincode"
                value={formData.address.pincode}
                onChange={handleChange}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* GSTIN & PAN */}
            <div>
              <label className="block text-sm font-medium mb-2">GSTIN</label>
              <input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">PAN</label>
              <input
                type="text"
                name="pan"
                value={formData.pan}
                onChange={handleChange}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Contact Information */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Financial Year */}
            <div>
              <label className="block text-sm font-medium mb-2">Financial Year Start</label>
              <input
                type="date"
                name="financialYear.startDate"
                value={formData.financialYear.startDate}
                onChange={handleChange}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Financial Year End</label>
              <input
                type="date"
                name="financialYear.endDate"
                value={formData.financialYear.endDate}
                onChange={handleChange}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Active Status */}
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-sm font-medium">Active Company</span>
              </label>
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200"
            >
              Update Company
            </button>
            <button
              type="button"
              onClick={() => navigate('/companies')}
              className="w-full bg-white text-gray-700 px-8 py-3 rounded-xl border border-gray-200 hover:bg-luxury-bg font-semibold transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyEdit;
