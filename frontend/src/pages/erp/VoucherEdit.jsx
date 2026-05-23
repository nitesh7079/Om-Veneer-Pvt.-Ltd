import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getSelectedCompanyId } from '../../utils/companyHelper';
import api from '../../utils/api';
import Navbar from '../../components/ERPNavbar';

const VoucherEdit = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [ledgers, setLedgers] = useState([]);
  const [formData, setFormData] = useState({
    voucherNumber: '',
    voucherType: '',
    date: '',
    narration: '',
    entries: [{ ledger: '', type: 'Dr', amount: 0 }],
    totalAmount: 0
  });

  useEffect(() => {
    fetchVoucher();
    fetchLedgers();
  }, [id]);

  const fetchVoucher = async () => {
    try {
      const response = await api.get(`/vouchers/${id}`);
      const voucher = response.data.data;
      setFormData({
        voucherNumber: voucher.voucherNumber,
        voucherType: voucher.voucherType,
        date: voucher.date.split('T')[0],
        narration: voucher.narration || '',
        entries: voucher.entries.map(e => ({
          ledger: e.ledger?._id || e.ledger || '',
          type: e.type,
          amount: e.amount
        })),
        totalAmount: voucher.totalAmount
      });
    } catch (error) {
      console.error('Error fetching voucher:', error);
      alert('Failed to load voucher');
    } finally {
      setLoading(false);
    }
  };

  const fetchLedgers = async () => {
    try {
      const companyId = getSelectedCompanyId(user);
      if (companyId) {
        const response = await api.get(`/ledgers?company=${companyId}`);
        setLedgers(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching ledgers:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEntryChange = (index, field, value) => {
    const updatedEntries = [...formData.entries];
    updatedEntries[index][field] = field === 'amount' ? parseFloat(value) || 0 : value;
    
    // Calculate total
    const total = updatedEntries.reduce((sum, entry) => sum + entry.amount, 0);
    
    setFormData({ ...formData, entries: updatedEntries, totalAmount: total });
  };

  const addEntry = () => {
    setFormData({
      ...formData,
      entries: [...formData.entries, { ledger: '', type: 'Dr', amount: 0 }]
    });
  };

  const removeEntry = (index) => {
    if (formData.entries.length > 1) {
      const updatedEntries = formData.entries.filter((_, i) => i !== index);
      const total = updatedEntries.reduce((sum, entry) => sum + entry.amount, 0);
      setFormData({ ...formData, entries: updatedEntries, totalAmount: total });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.voucherNumber || !formData.voucherType || !formData.date) {
      alert('Please fill all required fields');
      return;
    }

    if (formData.entries.some(e => !e.ledger || e.amount <= 0)) {
      alert('Please complete all entries with valid ledgers and amounts');
      return;
    }

    // Check if debits equal credits for certain voucher types
    const debitTotal = formData.entries.filter(e => e.type === 'Dr').reduce((sum, e) => sum + e.amount, 0);
    const creditTotal = formData.entries.filter(e => e.type === 'Cr').reduce((sum, e) => sum + e.amount, 0);

    if (['Journal', 'Contra'].includes(formData.voucherType)) {
      if (Math.abs(debitTotal - creditTotal) > 0.01) {
        alert('Total debits must equal total credits for this voucher type');
        return;
      }
    }

    try {
      const companyId = getSelectedCompanyId(user);
      await api.put(`/vouchers/${id}`, {
        ...formData,
        company: companyId
      });
      alert('Voucher updated successfully!');
      navigate('/vouchers');
    } catch (error) {
      console.error('Error updating voucher:', error);
      alert(error.response?.data?.message || 'Error updating voucher');
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
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Edit Voucher</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Voucher Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="voucherNumber"
                value={formData.voucherNumber}
                onChange={handleChange}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Voucher Type <span className="text-red-500">*</span>
              </label>
              <select
                name="voucherType"
                value={formData.voucherType}
                onChange={handleChange}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Type</option>
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
              <label className="block text-sm font-medium mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Total Amount</label>
              <div className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded bg-luxury-bg font-bold text-blue-600">
                ₹{formData.totalAmount.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Narration</label>
            <textarea
              name="narration"
              value={formData.narration}
              onChange={handleChange}
              rows="3"
              className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Entries</h3>
              <button
                type="button"
                onClick={addEntry}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                + Add Entry
              </button>
            </div>

            <div className="space-y-4">
              {formData.entries.map((entry, index) => (
                <div key={index} className="border p-4 rounded bg-luxury-bg">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium mb-2">
                        Ledger <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={entry.ledger}
                        onChange={(e) => handleEntryChange(index, 'ledger', e.target.value)}
                        className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Ledger</option>
                        {ledgers.map(ledger => (
                          <option key={ledger._id} value={ledger._id}>
                            {ledger.name} ({ledger.group?.name})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Type</label>
                      <select
                        value={entry.type}
                        onChange={(e) => handleEntryChange(index, 'type', e.target.value)}
                        className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Dr">Debit (Dr)</option>
                        <option value="Cr">Credit (Cr)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Amount <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={entry.amount}
                          onChange={(e) => handleEntryChange(index, 'amount', e.target.value)}
                          step="0.01"
                          min="0"
                          className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                        {formData.entries.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeEntry(index)}
                            className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Update Voucher
            </button>
            <button
              type="button"
              onClick={() => navigate('/vouchers')}
              className="bg-luxury-bg0 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VoucherEdit;
