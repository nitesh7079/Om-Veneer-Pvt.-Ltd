import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { getSelectedCompanyId } from '../../utils/companyHelper';
import Navbar from '../../components/ERPNavbar';

const VoucherCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    voucherNumber: '',
    voucherType: 'Payment',
    date: new Date().toLocaleDateString('en-CA'),
    narration: '',
    entries: [
      { ledger: '', type: 'Dr', amount: 0 },
      { ledger: '', type: 'Cr', amount: 0 }
    ]
  });

  useEffect(() => {
    fetchLedgers();
    generateVoucherNumber();
  }, []);

  const fetchLedgers = async () => {
    try {
      const companyId = getSelectedCompanyId(user);
      const response = companyId 
        ? await api.get(`/ledgers?company=${companyId}`)
        : await api.get('/ledgers');
      setLedgers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching ledgers:', error);
      setError('Failed to load ledgers');
    }
  };

  const generateVoucherNumber = () => {
    const timestamp = Date.now().toString().slice(-6);
    setFormData(prev => ({ ...prev, voucherNumber: `VCH${timestamp}` }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...formData.entries];
    newEntries[index][field] = value;
    setFormData(prev => ({ ...prev, entries: newEntries }));
  };

  const addEntry = () => {
    setFormData(prev => ({
      ...prev,
      entries: [...prev.entries, { ledger: '', type: 'Dr', amount: 0 }]
    }));
  };

  const removeEntry = (index) => {
    if (formData.entries.length > 2) {
      const newEntries = formData.entries.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, entries: newEntries }));
    }
  };

  const calculateTotals = () => {
    const debitTotal = formData.entries
      .filter(e => e.type === 'Dr')
      .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    const creditTotal = formData.entries
      .filter(e => e.type === 'Cr')
      .reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);
    return { debitTotal, creditTotal };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { debitTotal, creditTotal } = calculateTotals();
    if (Math.abs(debitTotal - creditTotal) > 0.01) {
      setError('Debit and Credit totals must be equal');
      return;
    }

    if (formData.entries.some(e => !e.ledger || e.amount <= 0)) {
      setError('All entries must have a ledger and amount greater than 0');
      return;
    }

    setLoading(true);

    try {
      const { debitTotal } = calculateTotals();
      const companyId = getSelectedCompanyId(user);
      const voucherData = {
        voucherNumber: formData.voucherNumber,
        voucherType: formData.voucherType,
        date: formData.date,
        narration: formData.narration,
        totalAmount: debitTotal,
        entries: formData.entries.map(e => ({
          ledger: e.ledger,
          type: e.type,
          amount: parseFloat(e.amount)
        })),
        company: companyId
      };

      await api.post('/vouchers', voucherData);
      navigate('/vouchers');
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating voucher');
    } finally {
      setLoading(false);
    }
  };

  const { debitTotal, creditTotal } = calculateTotals();
  const difference = Math.abs(debitTotal - creditTotal);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
      <Navbar />
      <div className="container mx-auto px-4 py-10 max-w-4xl animate-fade-in-up">
        <h1 className="text-4xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 mb-8 tracking-tight text-center">Create Voucher</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2">Voucher Number *</label>
                <input
                  type="text"
                  name="voucherNumber"
                  value={formData.voucherNumber}
                  onChange={handleChange}
                  className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Voucher Type *</label>
                <select
                  name="voucherType"
                  value={formData.voucherType}
                  onChange={handleChange}
                  className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
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
                <label className="block text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-semibold">Entries</h3>
                <button
                  type="button"
                  onClick={addEntry}
                  className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 text-sm"
                >
                  + Add Entry
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border">
                  <thead className="bg-luxury-bg">
                    <tr>
                      <th className="px-4 py-2 text-left">Ledger</th>
                      <th className="px-4 py-2 text-left">Type</th>
                      <th className="px-4 py-2 text-right">Amount</th>
                      <th className="px-4 py-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.entries.map((entry, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">
                          <select
                            value={entry.ledger}
                            onChange={(e) => handleEntryChange(index, 'ledger', e.target.value)}
                            className="text-gray-900 bg-white font-semibold w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          >
                            <option value="">Select Ledger</option>
                            {ledgers.map(ledger => (
                              <option key={ledger._id} value={ledger._id}>
                                {ledger.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <select
                            value={entry.type}
                            onChange={(e) => handleEntryChange(index, 'type', e.target.value)}
                            className="text-gray-900 bg-white font-semibold w-full px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                          >
                            <option value="Dr">Debit</option>
                            <option value="Cr">Credit</option>
                          </select>
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={entry.amount}
                            onChange={(e) => handleEntryChange(index, 'amount', e.target.value)}
                            className="text-gray-900 bg-white font-semibold w-full px-2 py-1 border rounded text-right focus:outline-none focus:ring-2 focus:ring-primary"
                            step="0.01"
                            min="0"
                            required
                          />
                        </td>
                        <td className="px-4 py-2 text-center">
                          {formData.entries.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeEntry(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-luxury-bg font-semibold">
                    <tr className="border-t-2">
                      <td className="px-4 py-2" colSpan="2">Total</td>
                      <td className="px-4 py-2 text-right">
                        Dr: ₹{debitTotal.toFixed(2)} | Cr: ₹{creditTotal.toFixed(2)}
                      </td>
                      <td className="px-4 py-2"></td>
                    </tr>
                    {difference > 0.01 && (
                      <tr>
                        <td colSpan="4" className="px-4 py-2 text-center text-red-600">
                          Difference: ₹{difference.toFixed(2)}
                        </td>
                      </tr>
                    )}
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Narration</label>
              <textarea
                name="narration"
                value={formData.narration}
                onChange={handleChange}
                rows="3"
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter transaction details..."
              />
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                disabled={loading || difference > 0.01}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 font-semibold shadow-lg shadow-blue-500/30 transition-all duration-200"
              >
                {loading ? 'Creating...' : 'Create Voucher'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/vouchers')}
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

export default VoucherCreate;
