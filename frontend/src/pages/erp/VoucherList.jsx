import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { cachedGet } from '../../utils/api';
import { cacheInvalidate } from '../../utils/cache';
import { useCompany } from '../../context/CompanyContext';
import Navbar from '../../components/ERPNavbar';
import TableSkeleton from '../../components/TableSkeleton';

const VoucherList = () => {
  const { selectedCompanyId } = useCompany();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [voucherType, setVoucherType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchVouchers();
  }, [voucherType, startDate, endDate]);

  const fetchVouchers = async () => {
    try {
      if (selectedCompanyId) {
        let url = `/vouchers?company=${selectedCompanyId}`;
        if (voucherType) url += `&voucherType=${voucherType}`;
        if (startDate) url += `&startDate=${startDate}`;
        if (endDate) url += `&endDate=${endDate}`;

        const response = await cachedGet(url);
        setVouchers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this voucher?')) {
      try {
        await api.delete(`/vouchers/${id}`);
        cacheInvalidate('/vouchers');
        setVouchers(vouchers.filter(v => v._id !== id));
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting voucher');
      }
    }
  };

  if (loading) return <TableSkeleton Navbar={Navbar} cols={6} rows={8} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-10 animate-fade-in">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">Vouchers</h1>
            <p className="text-gray-600 text-lg">Manage your financial transactions</p>
          </div>
          <div className="flex gap-3">
            <div className="relative group">
              <button className="btn-gradient text-white px-8 py-4 rounded-xl hover:shadow-2xl font-bold text-lg shadow-xl flex items-center space-x-2 transform transition-all duration-300">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Create Voucher</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border-2 border-blue-100 hidden group-hover:block z-10 overflow-hidden">
                <Link to="/vouchers/contra" className="block px-5 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 text-gray-800 transition-all duration-200 border-b border-gray-100">
                  <span className="font-bold text-blue-600">F4:</span> <span className="font-semibold">Contra</span>
                </Link>
                <Link to="/vouchers/payment" className="block px-5 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 text-gray-800 transition-all duration-200 border-b border-gray-100">
                  <span className="font-bold text-blue-600">F5:</span> <span className="font-semibold">Payment</span>
                </Link>
                <Link to="/vouchers/receipt" className="block px-4 py-2 hover:bg-luxury-bg text-gray-800">
                  <span className="font-semibold">F6:</span> Receipt
                </Link>
                <Link to="/vouchers/journal" className="block px-4 py-2 hover:bg-luxury-bg text-gray-800">
                  <span className="font-semibold">F7:</span> Journal
                </Link>
                <Link to="/vouchers/sales" className="block px-4 py-2 hover:bg-luxury-bg text-gray-800">
                  <span className="font-semibold">F8:</span> Sales
                </Link>
                <Link to="/vouchers/purchase" className="block px-4 py-2 hover:bg-luxury-bg text-gray-800">
                  <span className="font-semibold">F9:</span> Purchase
                </Link>
                <div className="border-t border-gray-200"></div>
                <Link to="/vouchers/create" className="block px-4 py-2 hover:bg-luxury-bg text-gray-800">
                  Other Vouchers
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-gray-100 animate-fade-in">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800">Filter Vouchers</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-800 tracking-wide">Voucher Type</label>
              <select
                value={voucherType}
                onChange={(e) => setVoucherType(e.target.value)}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-semibold text-gray-900 bg-white"
              >
                <option value="">All Types</option>
                <option value="Payment">Payment</option>
                <option value="Receipt">Receipt</option>
                <option value="Contra">Contra</option>
                <option value="Journal">Journal</option>
                <option value="Sales">Sales</option>
                <option value="Purchase">Purchase</option>
                <option value="Credit Note">Credit Note</option>
                <option value="Debit Note">Debit Note</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-800 tracking-wide">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-semibold text-gray-900 bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-800 tracking-wide">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 font-semibold text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Vouchers Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in border border-gray-100">
          <table className="w-full professional-table">
            <thead className="bg-gradient-to-r from-blue-600 to-indigo-600">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Voucher No.</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Narration</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vouchers.map(voucher => (
                <tr key={voucher._id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 transition-all duration-200">
                  <td className="px-6 py-4 font-bold text-gray-800">{voucher.voucherNumber}</td>
                  <td className="px-6 py-4">
                    <span className="badge-professional bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800">
                      {voucher.voucherType}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-semibold text-gray-700">
                    {new Date(voucher.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4 font-bold text-green-600">₹{voucher.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-600 text-sm">{voucher.narration}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/vouchers/${voucher._id}`}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-semibold text-sm"
                      >
                        View
                      </Link>
                      <Link
                        to={`/vouchers/edit/${voucher._id}`}
                        className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors font-semibold text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(voucher._id)}
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

          {vouchers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No vouchers found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoucherList;
