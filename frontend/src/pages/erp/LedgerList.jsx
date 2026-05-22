import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { cachedGet } from '../../utils/api';
import { cacheInvalidate } from '../../utils/cache';
import { useCompany } from '../../context/CompanyContext';
import Navbar from '../../components/ERPNavbar';
import TableSkeleton from '../../components/TableSkeleton';

const LedgerList = () => {
  const { selectedCompanyId } = useCompany();
  const [ledgers, setLedgers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (selectedCompanyId) {
        const [ledgersRes, groupsRes] = await Promise.all([
          cachedGet(`/ledgers?company=${selectedCompanyId}`),
          cachedGet(`/groups?company=${selectedCompanyId}`)
        ]);

        setLedgers(ledgersRes.data.data);
        setGroups(groupsRes.data.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLedgers = ledgers.filter(ledger => {
    const matchesSearch = ledger.name.toLowerCase().includes(filter.toLowerCase());
    const matchesGroup = !selectedGroup || ledger.group._id === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ledger?')) {
      try {
        await api.delete(`/ledgers/${id}`);
        // Invalidate cache so next visit reflects deletion
        cacheInvalidate('/ledgers');
        setLedgers(ledgers.filter(l => l._id !== id));
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting ledger');
      }
    }
  };

  if (loading) return <TableSkeleton Navbar={Navbar} cols={5} rows={8} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-10 animate-fade-in">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">Ledgers</h1>
            <p className="text-gray-600 text-lg">Manage your account ledgers</p>
          </div>
          <Link
            to="/ledgers/create"
            className="btn-gradient text-white px-8 py-4 rounded-xl hover:shadow-2xl font-bold text-lg shadow-xl flex items-center space-x-2 transform transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Create Ledger</span>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border-t-4 border-cyan-500 animate-fade-in">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-cyan-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800">Filter Ledgers</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-800 tracking-wide">Search</label>
              <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                placeholder="Search ledgers..."
                className="text-gray-900 bg-white font-semibold w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-800 tracking-wide">Filter by Group</label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
              >
                <option value="">All Groups</option>
                {groups.map(group => (
                  <option key={group._id} value={group._id}>{group.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Ledgers Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in border-t-4 border-green-500">
          <table className="w-full professional-table">
            <thead className="bg-gradient-to-r from-blue-600 to-cyan-500">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Ledger Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Group</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Opening Balance</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Current Balance</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLedgers.map(ledger => (
                <tr key={ledger._id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200">
                  <td className="px-6 py-4 font-semibold text-gray-800">{ledger.name}</td>
                  <td className="px-6 py-4">
                    <span className="badge-professional bg-blue-100 text-blue-800">{ledger.group.name}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-700">
                    ₹{ledger.openingBalance.amount} <span className="text-xs text-gray-500">{ledger.openingBalance.type}</span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-700">
                    ₹{ledger.currentBalance.amount} <span className="text-xs text-gray-500">{ledger.currentBalance.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/ledgers/${ledger._id}`}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold text-sm"
                      >
                        View
                      </Link>
                      <Link
                        to={`/ledgers/edit/${ledger._id}`}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-semibold text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(ledger._id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-semibold text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLedgers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No ledgers found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LedgerList;
