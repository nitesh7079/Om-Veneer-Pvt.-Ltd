import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { cachedGet } from '../../utils/api';
import { cacheInvalidate } from '../../utils/cache';
import { useCompany } from '../../context/CompanyContext';
import Navbar from '../../components/ERPNavbar';
import TableSkeleton from '../../components/TableSkeleton';

const InventoryList = () => {
  const { selectedCompanyId } = useCompany();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      if (selectedCompanyId) {
        const response = await cachedGet(`/inventory?company=${selectedCompanyId}`);
        setItems(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(filter.toLowerCase()) ||
    item.code?.toLowerCase().includes(filter.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/inventory/${id}`);
        cacheInvalidate('/inventory');
        setItems(items.filter(item => item._id !== id));
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting item');
      }
    }
  };

  if (loading) return <TableSkeleton Navbar={Navbar} cols={6} rows={8} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-10 animate-fade-in">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">Inventory</h1>
            <p className="text-gray-600 text-lg">Manage your stock and inventory items</p>
          </div>
          <Link
            to="/inventory/create"
            className="btn-gradient text-white px-8 py-4 rounded-xl hover:shadow-2xl font-bold text-lg shadow-xl flex items-center space-x-2 transform transition-all duration-300"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Item</span>
          </Link>
        </div>

        {/* Search Filter */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border-t-4 border-purple-500 animate-fade-in">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800">Search Items</h3>
          </div>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by name or code..."
            className="text-gray-900 bg-white font-semibold w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300"
          />
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in border-t-4 border-purple-500">
          <table className="w-full professional-table">
            <thead className="bg-gradient-to-r from-purple-600 to-purple-500">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Unit</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Rate</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Stock</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredItems.map(item => (
                <tr key={item._id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200">
                  <td className="px-6 py-4">
                    <span className="badge-professional bg-purple-100 text-purple-800">{item.code}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-800">{item.name}</td>
                  <td className="px-6 py-4 font-semibold text-gray-600">{item.unit}</td>
                  <td className="px-6 py-4 font-bold text-green-600">₹{item.rate?.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="badge-professional bg-cyan-100 text-cyan-800">
                      {item.currentStock?.quantity || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/inventory/${item._id}`}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold text-sm"
                      >
                        View
                      </Link>
                      <Link
                        to={`/inventory/edit/${item._id}`}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-semibold text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(item._id)}
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

          {filteredItems.length === 0 && (
            <div className="text-center py-12 bg-gradient-to-r from-purple-50 to-pink-50">
              <svg className="w-20 h-20 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p className="text-gray-600 font-semibold text-lg">No inventory items found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryList;
