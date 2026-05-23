import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { getSelectedCompanyId } from '../../utils/companyHelper';
import Navbar from '../../components/ERPNavbar';

const LedgerEdit = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    group: '',
    openingBalanceAmount: 0,
    openingBalanceType: 'Dr',
    description: ''
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const companyId = getSelectedCompanyId(user);
      const [ledgerRes, groupsRes] = await Promise.all([
        api.get(`/ledgers/${id}`),
        companyId 
          ? api.get(`/groups?company=${companyId}`)
          : api.get('/groups')
      ]);

      const ledger = ledgerRes.data.data;
      setFormData({
        name: ledger.name,
        alias: ledger.alias || '',
        group: ledger.group?._id || '',
        openingBalanceAmount: ledger.openingBalance?.amount || 0,
        openingBalanceType: ledger.openingBalance?.type || 'Dr',
        description: ledger.description || ''
      });

      setGroups(groupsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load ledger details');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const ledgerData = {
        name: formData.name,
        alias: formData.alias,
        group: formData.group,
        openingBalance: {
          amount: parseFloat(formData.openingBalanceAmount),
          type: formData.openingBalanceType,
          date: new Date()
        },
        currentBalance: {
          amount: parseFloat(formData.openingBalanceAmount),
          type: formData.openingBalanceType
        },
        description: formData.description
      };

      await api.put(`/ledgers/${id}`, ledgerData);
      navigate('/ledgers');
    } catch (error) {
      setError(error.response?.data?.message || 'Error updating ledger');
    } finally {
      setSaving(false);
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
      <div className="container mx-auto px-4 py-10 max-w-2xl animate-fade-in-up">
        <h1 className="text-4xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 mb-8 tracking-tight text-center">Edit Ledger</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Ledger Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Alias</label>
              <input
                type="text"
                name="alias"
                value={formData.alias}
                onChange={handleChange}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Under Group *</label>
              <select
                name="group"
                value={formData.group}
                onChange={handleChange}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                required
              >
                <option value="">Select Group</option>
                {groups.map(group => (
                  <option key={group._id} value={group._id}>{group.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Opening Balance</label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="openingBalanceAmount"
                  value={formData.openingBalanceAmount}
                  onChange={handleChange}
                  className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  step="0.01"
                />
                <select
                  name="openingBalanceType"
                  value={formData.openingBalanceType}
                  onChange={handleChange}
                  className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="Dr">Debit</option>
                  <option value="Cr">Credit</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200"
              >
                {saving ? 'Updating...' : 'Update Ledger'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/ledgers')}
                className="w-full bg-white text-gray-700 px-8 py-3 rounded-xl border border-gray-200 hover:bg-luxury-bg font-semibold transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LedgerEdit;
