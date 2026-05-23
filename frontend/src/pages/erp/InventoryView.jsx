import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import Navbar from '../../components/ERPNavbar';

const InventoryView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await api.get(`/inventory/${id}`);
      setItem(response.data.data);
    } catch (error) {
      console.error('Error fetching item:', error);
    } finally {
      setLoading(false);
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

  if (!item) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Item not found</h2>
            <button
              onClick={() => navigate('/inventory')}
              className="bg-primary text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Back to Inventory
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Inventory Item Details</h1>
          <div className="flex gap-3">
            <Link
              to={`/inventory/edit/${item._id}`}
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Edit
            </Link>
            <button
              onClick={() => navigate('/inventory')}
              className="bg-luxury-bg0 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Back
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Item Code</label>
              <p className="text-lg">{item.code || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Item Name</label>
              <p className="text-lg font-bold">{item.name}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Unit</label>
              <p className="text-lg">{item.unit}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Rate</label>
              <p className="text-lg">₹{item.rate?.toFixed(2)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Stock Group</label>
              <p className="text-lg">{item.stockGroup || 'Primary'}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">Valuation Method</label>
              <p className="text-lg">{item.valuationMethod || 'Average'}</p>
            </div>
          </div>

          <div className="border-t pt-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Stock Information</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-blue-50 p-4 rounded">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Current Stock</label>
                <p className="text-2xl font-bold text-blue-600">
                  {item.currentStock?.quantity || 0} {item.unit}
                </p>
                <p className="text-sm text-gray-600">Value: ₹{item.currentStock?.value?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Opening Stock</label>
                <p className="text-2xl font-bold text-green-600">
                  {item.openingStock?.quantity || 0} {item.unit}
                </p>
                <p className="text-sm text-gray-600">Value: ₹{item.openingStock?.value?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-yellow-50 p-4 rounded">
                <label className="block text-sm font-semibold text-gray-600 mb-1">Reorder Level</label>
                <p className="text-2xl font-bold text-yellow-600">
                  {item.reorderLevel || 0} {item.unit}
                </p>
                {item.currentStock?.quantity <= item.reorderLevel && (
                  <p className="text-sm text-red-600 font-semibold">⚠️ Low Stock</p>
                )}
              </div>
            </div>
          </div>

          {(item.hsnCode || item.sacCode || item.gstRate) && (
            <div className="border-t pt-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">GST Information</h3>
              <div className="grid grid-cols-3 gap-6">
                {item.hsnCode && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">HSN Code</label>
                    <p className="text-lg">{item.hsnCode}</p>
                  </div>
                )}
                {item.sacCode && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">SAC Code</label>
                    <p className="text-lg">{item.sacCode}</p>
                  </div>
                )}
                {item.gstRate !== undefined && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-1">GST Rate</label>
                    <p className="text-lg">{item.gstRate}%</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {item.description && (
            <div className="border-t pt-6">
              <label className="block text-sm font-semibold text-gray-600 mb-2">Description</label>
              <p className="text-gray-700">{item.description}</p>
            </div>
          )}

          <div className="border-t pt-6 mt-6">
            <div className="grid grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <span className="font-semibold">Created:</span> {new Date(item.createdAt).toLocaleString()}
              </div>
              <div>
                <span className="font-semibold">Last Updated:</span> {new Date(item.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryView;
