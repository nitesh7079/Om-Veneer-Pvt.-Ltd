import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Navbar from '../../components/ERPNavbar';

const VoucherView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [voucher, setVoucher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVoucher();
  }, [id]);

  const fetchVoucher = async () => {
    try {
      const response = await api.get(`/vouchers/${id}`);
      setVoucher(response.data.data);
    } catch (error) {
      console.error('Error fetching voucher:', error);
      setError('Failed to load voucher details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this voucher?')) {
      try {
        await api.delete(`/vouchers/${id}`);
        alert('Voucher deleted successfully');
        navigate('/vouchers');
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting voucher');
      }
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

  if (error || !voucher) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Voucher not found'}
          </div>
          <button
            onClick={() => navigate('/vouchers')}
            className="mt-4 bg-luxury-bg0 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Back to Vouchers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Voucher Details</h1>
          <div className="flex gap-3">
            <Link
              to={`/vouchers/edit/${voucher._id}`}
              className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
            <button
              onClick={() => navigate('/vouchers')}
              className="bg-luxury-bg0 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Back
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Voucher Number</label>
              <div className="text-lg font-semibold">{voucher.voucherNumber}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Voucher Type</label>
              <div className="text-lg">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
                  {voucher.voucherType}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Date</label>
              <div className="text-lg">{new Date(voucher.date).toLocaleDateString()}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Total Amount</label>
              <div className="text-lg font-bold text-blue-600">
                ₹{voucher.totalAmount.toFixed(2)}
              </div>
            </div>

            {voucher.narration && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Narration</label>
                <div className="text-lg">{voucher.narration}</div>
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <h3 className="text-xl font-semibold mb-4">Entries</h3>
            <div className="space-y-3">
              {voucher.entries && voucher.entries.map((entry, index) => (
                <div key={index} className="bg-luxury-bg p-4 rounded">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Ledger</label>
                      <div className="font-semibold">{entry.ledger?.name || 'N/A'}</div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Type</label>
                      <div>
                        <span className={`px-2 py-1 rounded text-sm ${
                          entry.type === 'Dr' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {entry.type}
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Amount</label>
                      <div className="font-semibold">₹{entry.amount.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6 mt-6">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
              <div>
                <span className="font-medium">Created:</span> {new Date(voucher.createdAt).toLocaleString()}
              </div>
              <div>
                <span className="font-medium">Last Updated:</span> {new Date(voucher.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoucherView;
