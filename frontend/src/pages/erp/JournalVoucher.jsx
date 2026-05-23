import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { getSelectedCompanyId } from '../../utils/companyHelper';
import Navbar from '../../components/ERPNavbar';
import { getNepaliDateString } from '../../utils/dateUtils';

const JournalVoucher = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    voucherNumber: '',
    date: new Date().toLocaleDateString('en-CA'),
    entries: [
      { ledger: '', type: 'By', debit: 0, credit: 0 },
      { ledger: '', type: 'To', debit: 0, credit: 0 }
    ],
    narration: ''
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
    }
  };

  const generateVoucherNumber = () => {
    const timestamp = Date.now().toString().slice(-4);
    setFormData(prev => ({ ...prev, voucherNumber: `JV-${timestamp}` }));
  };

  const handleEntryChange = (index, field, value) => {
    const newEntries = [...formData.entries];
    newEntries[index][field] = value;
    setFormData(prev => ({ ...prev, entries: newEntries }));
  };

  const addEntry = () => {
    setFormData(prev => ({
      ...prev,
      entries: [...prev.entries, { ledger: '', type: 'By', debit: 0, credit: 0 }]
    }));
  };

  const removeEntry = (index) => {
    if (formData.entries.length > 2) {
      setFormData(prev => ({
        ...prev,
        entries: prev.entries.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateTotals = () => {
    const debitTotal = formData.entries.reduce((sum, e) => sum + parseFloat(e.debit || 0), 0);
    const creditTotal = formData.entries.reduce((sum, e) => sum + parseFloat(e.credit || 0), 0);
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

    setLoading(true);

    try {
      const companyId = getSelectedCompanyId(user);
      const voucherData = {
        voucherNumber: formData.voucherNumber,
        voucherType: 'Journal',
        date: formData.date,
        narration: formData.narration,
        company: companyId,
        totalAmount: debitTotal,
        entries: formData.entries.map(e => ({
          ledger: e.ledger,
          type: e.debit > 0 ? 'Dr' : 'Cr',
          amount: parseFloat(e.debit > 0 ? e.debit : e.credit)
        })).filter(e => e.amount > 0)
      };

      await api.post('/vouchers', voucherData);
      navigate('/vouchers');
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating journal voucher');
    } finally {
      setLoading(false);
    }
  };

  const { debitTotal, creditTotal } = calculateTotals();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in">
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-4 rounded-t-2xl shadow-lg flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-bold">Journal</span>
            <span>No. {formData.voucherNumber}</span>
          </div>
          <div className="text-right font-medium">
            <span className="text-gray-100 font-normal">Date (AD):</span> {new Date(formData.date).toLocaleDateString('en-GB')}<br />
            <span className="text-gray-100 font-normal">Miti (BS):</span> <span className="font-bold text-lg">{getNepaliDateString(formData.date)}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="bg-white p-8 rounded-b-2xl shadow-xl border-x border-b border-gray-100 text-gray-800">
          <form onSubmit={handleSubmit}>
            <div className="bg-white border mb-4">
              <div className="grid grid-cols-4 bg-slate-100 border-b-2 border-slate-200 text-slate-800">
                <div className="px-4 py-3 font-bold text-sm text-slate-800">Particulars</div>
                <div className="px-4 py-3 font-bold text-sm text-slate-800"></div>
                <div className="px-4 py-3 font-bold text-sm text-slate-800 text-right">Debit</div>
                <div className="px-4 py-3 font-bold text-sm text-slate-800 text-right">Credit</div>
              </div>
              {formData.entries.map((entry, index) => (
                <div key={index} className="grid grid-cols-4 border-b items-center">
                  <div className="px-4 py-3">
                    <select
                      value={entry.type}
                      onChange={(e) => handleEntryChange(index, 'type', e.target.value)}
                      className="w-20 px-2 py-1 border bg-green-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="By">By</option>
                      <option value="To">To</option>
                    </select>
                  </div>
                  <div className="px-4 py-3">
                    <select
                      value={entry.ledger}
                      onChange={(e) => handleEntryChange(index, 'ledger', e.target.value)}
                      className="text-gray-900 bg-white font-semibold w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    >
                      <option value="">Select Ledger</option>
                      {ledgers.map(ledger => (
                        <option key={ledger._id} value={ledger._id}>{ledger.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="px-4 py-3 border-l">
                    <input
                      type="number"
                      value={entry.debit}
                      onChange={(e) => handleEntryChange(index, 'debit', e.target.value)}
                      className="w-full text-right px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="px-4 py-3 border-l flex justify-between items-center">
                    <input
                      type="number"
                      value={entry.credit}
                      onChange={(e) => handleEntryChange(index, 'credit', e.target.value)}
                      className="w-full text-right px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.01"
                      min="0"
                    />
                    {formData.entries.length > 2 && (
                      <button type="button" onClick={() => removeEntry(index)} className="ml-2 text-red-600 text-sm">✕</button>
                    )}
                  </div>
                </div>
              ))}
              <div className="px-4 py-2">
                <button type="button" onClick={addEntry} className="text-blue-600 text-sm">+ Add Entry</button>
              </div>
              <div className="grid grid-cols-4 bg-slate-200 border-t-2 border-slate-300 text-slate-900 font-bold">
                <div className="px-4 py-2 col-span-2">Total</div>
                <div className="px-4 py-2 text-right border-l">₹{debitTotal.toFixed(2)}</div>
                <div className="px-4 py-2 text-right border-l">₹{creditTotal.toFixed(2)}</div>
              </div>
              {Math.abs(debitTotal - creditTotal) > 0.01 && (
                <div className="px-4 py-2 text-center text-red-600 text-sm">
                  Difference: ₹{Math.abs(debitTotal - creditTotal).toFixed(2)}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-1 font-bold text-gray-700">Narration:</label>
              <textarea
                name="narration"
                value={formData.narration}
                onChange={(e) => setFormData(prev => ({ ...prev, narration: e.target.value }))}
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white text-gray-900 font-semibold"
              />
            </div>

            <div className="flex gap-4 pt-4 border-t-2 border-gray-300">
              <button type="button" onClick={() => navigate('/vouchers')} className="bg-luxury-bg0 text-white px-6 py-2 hover:bg-gray-600">Q: Quit</button>
              <button type="submit" disabled={loading || Math.abs(debitTotal - creditTotal) > 0.01} className="bg-green-600 text-white px-6 py-2 hover:bg-green-700 disabled:bg-gray-400">{loading ? 'Saving...' : 'A: Accept'}</button>
              <button type="button" className="bg-red-600 text-white px-6 py-2 hover:bg-red-700">D: Delete</button>
              <button type="button" onClick={() => window.location.reload()} className="bg-yellow-600 text-white px-6 py-2 hover:bg-yellow-700">X: Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JournalVoucher;
