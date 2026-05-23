import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { getSelectedCompanyId } from '../../utils/companyHelper';
import Navbar from '../../components/ERPNavbar';
import { getNepaliDateString } from '../../utils/dateUtils';

const ContraVoucher = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    voucherNumber: '',
    date: new Date().toLocaleDateString('en-CA'),
    fromAccount: '',
    toAccount: '',
    amount: 0,
    narration: ''
  });

  const [selectedFromAccount, setSelectedFromAccount] = useState(null);
  const [selectedToAccount, setSelectedToAccount] = useState(null);

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
    setFormData(prev => ({ ...prev, voucherNumber: `CON-${timestamp}` }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === 'fromAccount') {
      const account = ledgers.find(l => l._id === value);
      setSelectedFromAccount(account);
    }
    if (name === 'toAccount') {
      const account = ledgers.find(l => l._id === value);
      setSelectedToAccount(account);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.fromAccount || !formData.toAccount || formData.amount <= 0) {
      setError('Please fill all fields with valid values');
      return;
    }

    setLoading(true);

    try {
      const companyId = getSelectedCompanyId(user);
      const voucherData = {
        voucherNumber: formData.voucherNumber,
        voucherType: 'Contra',
        date: formData.date,
        narration: formData.narration,
        company: companyId,
        totalAmount: parseFloat(formData.amount),
        entries: [
          { ledger: formData.toAccount, type: 'Dr', amount: parseFloat(formData.amount) },
          { ledger: formData.fromAccount, type: 'Cr', amount: parseFloat(formData.amount) }
        ]
      };

      await api.post('/vouchers', voucherData);
      navigate('/vouchers');
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating contra voucher');
    } finally {
      setLoading(false);
    }
  };

  const cashBankLedgers = ledgers.filter(l => 
    l.group?.name === 'Cash-in-Hand' || l.group?.name === 'Bank Accounts'
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in">
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white px-6 py-4 rounded-t-2xl shadow-lg flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-bold">Contra</span>
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
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <label className="text-sm font-bold text-gray-700">Account:</label>
                <select
                  name="fromAccount"
                  value={formData.fromAccount}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 bg-white text-gray-900 font-bold"
                  required
                >
                  <option value="">Select Account</option>
                  {cashBankLedgers.map(ledger => (
                    <option key={ledger._id} value={ledger._id}>{ledger.name}</option>
                  ))}
                </select>
              </div>
              {selectedFromAccount && (
                <div className="text-sm italic">
                  Cur Bal: {selectedFromAccount.currentBalance?.amount?.toFixed(2)} {selectedFromAccount.currentBalance?.type}
                </div>
              )}
            </div>

            <div className="bg-white border mb-4">
              <div className="grid grid-cols-2 bg-slate-100 border-b-2 border-slate-200 text-slate-800">
                <div className="px-4 py-3 font-bold text-sm text-slate-800">Particulars</div>
                <div className="px-4 py-3 font-bold text-sm text-slate-800 text-right">Amount</div>
              </div>
              <div className="grid grid-cols-2">
                <div className="px-4 py-3">
                  <select
                    name="toAccount"
                    value={formData.toAccount}
                    onChange={handleChange}
                    className="text-gray-900 bg-white font-semibold w-full px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Account</option>
                    {cashBankLedgers.map(ledger => (
                      <option key={ledger._id} value={ledger._id}>{ledger.name}</option>
                    ))}
                  </select>
                  {selectedToAccount && (
                    <div className="text-xs italic mt-1">
                      Cur Bal: {selectedToAccount.currentBalance?.amount?.toFixed(2)} {selectedToAccount.currentBalance?.type}
                    </div>
                  )}
                </div>
                <div className="px-4 py-3 border-l">
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full text-right px-2 py-1 border focus:outline-none focus:ring-2 focus:ring-blue-500"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm mb-1 font-bold text-gray-700">Narration:</label>
              <textarea
                name="narration"
                value={formData.narration}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 bg-white text-gray-900 font-semibold"
                placeholder="Enter transaction details..."
              />
            </div>

            <div className="flex gap-4 pt-4 border-t-2 border-gray-300">
              <button type="button" onClick={() => navigate('/vouchers')} className="bg-luxury-bg0 text-white px-6 py-2 hover:bg-gray-600">
                Q: Quit
              </button>
              <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 hover:bg-green-700 disabled:bg-gray-400">
                {loading ? 'Saving...' : 'A: Accept'}
              </button>
              <button type="button" className="bg-red-600 text-white px-6 py-2 hover:bg-red-700">D: Delete</button>
              <button type="button" onClick={() => window.location.reload()} className="bg-yellow-600 text-white px-6 py-2 hover:bg-yellow-700">X: Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContraVoucher;
