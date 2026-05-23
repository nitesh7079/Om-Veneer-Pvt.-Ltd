import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { getSelectedCompanyId } from '../../utils/companyHelper';
import Navbar from '../../components/ERPNavbar';
import { getNepaliDateString } from '../../utils/dateUtils';

const SalesVoucher = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ledgers, setLedgers] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    voucherNumber: '',
    date: new Date().toLocaleDateString('en-CA'),
    partyAccount: '',
    salesLedger: '',
    items: [
      { inventoryItem: '', quantity: 1, rate: 0, amount: 0, discount: 0 }
    ],
    narration: ''
  });

  const [selectedParty, setSelectedParty] = useState(null);

  useEffect(() => {
    fetchData();
    generateVoucherNumber();
  }, []);

  const fetchData = async () => {
    try {
      const companyId = getSelectedCompanyId(user);
      const [ledgersRes, itemsRes] = await Promise.all([
        companyId 
          ? api.get(`/ledgers?company=${companyId}`)
          : api.get('/ledgers'),
        companyId 
          ? api.get(`/inventory?company=${companyId}`)
          : api.get('/inventory')
      ]);
      
      setLedgers(ledgersRes.data.data || []);
      setInventoryItems(itemsRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    }
  };

  const generateVoucherNumber = async () => {
    try {
      const response = await api.get('/vouchers');
      const salesVouchers = response.data.data?.filter(v => v.voucherType === 'Sales') || [];
      const lastNumber = salesVouchers.length > 0 ? salesVouchers.length : 0;
      setFormData(prev => ({ ...prev, voucherNumber: `SALES-${lastNumber + 1}` }));
    } catch (error) {
      const timestamp = Date.now().toString().slice(-4);
      setFormData(prev => ({ ...prev, voucherNumber: `SALES-${timestamp}` }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'partyAccount') {
      const party = ledgers.find(l => l._id === value);
      setSelectedParty(party);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    // Auto-calculate amount when quantity or rate changes
    if (field === 'quantity' || field === 'rate' || field === 'discount') {
      const qty = parseFloat(newItems[index].quantity) || 0;
      const rate = parseFloat(newItems[index].rate) || 0;
      const discount = parseFloat(newItems[index].discount) || 0;
      newItems[index].amount = (qty * rate) - discount;
    }

    // Auto-fill rate when item is selected
    if (field === 'inventoryItem') {
      const item = inventoryItems.find(i => i._id === value);
      if (item) {
        newItems[index].rate = item.rate || 0;
        const qty = parseFloat(newItems[index].quantity) || 0;
        const discount = parseFloat(newItems[index].discount) || 0;
        newItems[index].amount = (qty * item.rate) - discount;
      }
    }

    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { inventoryItem: '', quantity: 1, rate: 0, amount: 0, discount: 0 }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, items: newItems }));
    }
  };

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.partyAccount || !formData.salesLedger) {
      setError('Please select Party Account and Sales Ledger');
      return;
    }

    if (formData.items.some(item => !item.inventoryItem || item.quantity <= 0 || item.rate <= 0)) {
      setError('All items must have valid inventory item, quantity, and rate');
      return;
    }

    setLoading(true);

    try {
      const companyId = getSelectedCompanyId(user);
      const totalAmount = calculateTotal();

      const voucherData = {
        voucherNumber: formData.voucherNumber,
        voucherType: 'Sales',
        date: formData.date,
        party: formData.partyAccount,
        narration: formData.narration,
        company: companyId,
        totalAmount: totalAmount,
        entries: [
          {
            ledger: formData.partyAccount,
            type: 'Dr',
            amount: totalAmount
          },
          {
            ledger: formData.salesLedger,
            type: 'Cr',
            amount: totalAmount
          }
        ],
        items: formData.items.map(item => ({
          inventoryItem: item.inventoryItem,
          quantity: parseFloat(item.quantity),
          rate: parseFloat(item.rate),
          amount: parseFloat(item.amount),
          discount: parseFloat(item.discount) || 0
        }))
      };

      await api.post('/vouchers', voucherData);
      navigate('/vouchers');
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating sales voucher');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = calculateTotal();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl animate-fade-in">
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white px-6 py-4 rounded-t-2xl shadow-lg flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="font-bold">Sales</span>
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
            {/* Ref and Date */}
            <div className="mb-4">
              <label className="block text-sm mb-1 font-bold text-gray-700">Ref:</label>
              <input
                type="text"
                className="w-full px-3 py-1 border bg-white"
                placeholder="Reference"
              />
            </div>

            {/* Party Account */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2 mb-1">
                <label className="text-sm font-bold text-gray-700">Party's A/c Name:</label>
                <select
                  name="partyAccount"
                  value={formData.partyAccount}
                  onChange={handleChange}
                  className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 bg-white text-gray-900 font-bold"
                  required
                >
                  <option value="">Select Party</option>
                  {ledgers
                    .filter(l => l.group?.name === 'Sundry Debtors' || l.group?.name === 'Sundry Creditors')
                    .map(ledger => (
                      <option key={ledger._id} value={ledger._id}>
                        {ledger.name}
                      </option>
                    ))}
                </select>
              </div>
              {selectedParty && (
                <div className="text-sm italic">
                  Current Balance: ₹{selectedParty.currentBalance?.amount?.toFixed(2)} {selectedParty.currentBalance?.type}
                </div>
              )}
            </div>

            {/* Sales Ledger */}
            <div className="mb-4">
              <div className="flex items-baseline gap-2">
                <label className="text-sm font-bold text-gray-700">Sales Ledger:</label>
                <select
                  name="salesLedger"
                  value={formData.salesLedger}
                  onChange={handleChange}
                  className="flex-1 px-3 py-1 border bg-white"
                  required
                >
                  <option value="">Select Sales Ledger</option>
                  {ledgers
                    .filter(l => l.group?.name === 'Sales Accounts' || l.group?.name === 'Sales')
                    .map(ledger => (
                      <option key={ledger._id} value={ledger._id}>
                        {ledger.name}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-4 bg-white">
              <table className="w-full border-collapse">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border px-2 py-2 text-left text-sm">Name of Item</th>
                    <th className="border px-2 py-2 text-right text-sm w-24">Quantity</th>
                    <th className="border px-2 py-2 text-right text-sm w-32">Rate</th>
                    <th className="border px-2 py-2 text-center text-sm w-16">per</th>
                    <th className="border px-2 py-2 text-right text-sm w-32">Amount</th>
                    <th className="border px-2 py-2 text-center text-sm w-20">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {formData.items.map((item, index) => (
                    <tr key={index} className="hover:bg-luxury-bg">
                      <td className="border px-2 py-1">
                        <select
                          value={item.inventoryItem}
                          onChange={(e) => handleItemChange(index, 'inventoryItem', e.target.value)}
                          className="text-gray-900 bg-white font-semibold w-full px-2 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select Item</option>
                          {inventoryItems.map(invItem => (
                            <option key={invItem._id} value={invItem._id}>
                              {invItem.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className="w-full text-right px-2 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          step="0.01"
                          min="0"
                          required
                        />
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                          className="w-full text-right px-2 py-1 border-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          step="0.01"
                          min="0"
                          required
                        />
                      </td>
                      <td className="border px-2 py-1 text-center text-sm">
                        {inventoryItems.find(i => i._id === item.inventoryItem)?.unit || '-'}
                      </td>
                      <td className="border px-2 py-1">
                        <input
                          type="number"
                          value={item.amount}
                          readOnly
                          className="w-full text-right px-2 py-1 border-0 bg-luxury-bg font-semibold"
                          step="0.01"
                        />
                      </td>
                      <td className="border px-2 py-1 text-center">
                        {formData.items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 hover:text-red-800 text-xs"
                          >
                            Remove
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="6" className="border-0 py-2">
                      <button
                        type="button"
                        onClick={addItem}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        + Add Item
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Total Amount */}
            <div className="mb-4 text-right">
              <div className="inline-block bg-yellow-100 px-6 py-2 border border-gray-400">
                <span className="font-bold text-lg">Total Amount: ₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Narration */}
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

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t-2 border-gray-300">
              <button
                type="button"
                onClick={() => navigate('/vouchers')}
                className="bg-luxury-bg0 text-white px-6 py-2 hover:bg-gray-600"
              >
                Q: Quit
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-green-600 text-white px-6 py-2 hover:bg-green-700 disabled:bg-gray-400"
              >
                {loading ? 'Saving...' : 'A: Accept'}
              </button>
              <button
                type="button"
                className="bg-red-600 text-white px-6 py-2 hover:bg-red-700"
              >
                D: Delete
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="bg-yellow-600 text-white px-6 py-2 hover:bg-yellow-700"
              >
                X: Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SalesVoucher;
