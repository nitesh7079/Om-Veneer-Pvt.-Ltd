import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getSelectedCompanyId } from '../../utils/companyHelper';
import api from '../../utils/api';
import Navbar from '../../components/ERPNavbar';
import { exportLedgerDetailsToPDF, exportLedgerDetailsToExcel } from '../../utils/exportUtils';

const LedgerView = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ledger, setLedger] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchLedger();
  }, [id]);

  const fetchLedger = async () => {
    try {
      const companyId = getSelectedCompanyId(user);
      const [ledgerRes, vouchersRes] = await Promise.all([
        api.get(`/ledgers/${id}`),
        api.get(`/vouchers?company=${companyId}`)
      ]);
      
      const ledgerData = ledgerRes.data.data;
      setLedger(ledgerData);
      
      // Filter transactions for this ledger
      const vouchers = vouchersRes.data.data || [];
      const ledgerTransactions = [];
      
      for (const voucher of vouchers) {
        for (const entry of voucher.entries) {
          if (entry.ledger?._id === id || entry.ledger === id) {
            ledgerTransactions.push({
              date: voucher.date,
              voucherNumber: voucher.voucherNumber,
              voucherType: voucher.voucherType,
              particulars: voucher.narration || entry.ledger?.name || '',
              debit: entry.type === 'Dr' ? entry.amount : 0,
              credit: entry.type === 'Cr' ? entry.amount : 0
            });
          }
        }
      }
      
      // Sort by date
      ledgerTransactions.sort((a, b) => new Date(a.date) - new Date(b.date));
      
      // Calculate running balance
      let balance = ledgerData.openingBalance?.amount || 0;
      const openingType = ledgerData.openingBalance?.type || 'Dr';
      
      const transactionsWithBalance = ledgerTransactions.map(txn => {
        if (openingType === 'Dr') {
          balance = balance + txn.debit - txn.credit;
        } else {
          balance = balance - txn.debit + txn.credit;
        }
        return { ...txn, balance };
      });
      
      setTransactions(transactionsWithBalance);
    } catch (error) {
      console.error('Error fetching ledger:', error);
      setError('Failed to load ledger details');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    const openingBalance = ledger.openingBalance?.amount || 0;
    const closingBalance = transactions.length > 0 
      ? transactions[transactions.length - 1].balance 
      : openingBalance;
    
    exportLedgerDetailsToPDF(
      ledger.name, 
      transactions, 
      openingBalance, 
      closingBalance, 
      user?.company?.name
    );
  };

  const handleExportExcel = () => {
    const openingBalance = ledger.openingBalance?.amount || 0;
    const closingBalance = transactions.length > 0 
      ? transactions[transactions.length - 1].balance 
      : openingBalance;
    
    exportLedgerDetailsToExcel(
      ledger.name, 
      transactions, 
      openingBalance, 
      closingBalance, 
      user?.company?.name
    );
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

  if (error || !ledger) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Ledger not found'}
          </div>
          <button
            onClick={() => navigate('/ledgers')}
            className="mt-4 bg-luxury-bg0 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Back to Ledgers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Ledger Details</h1>
          <div className="flex gap-3">
            <button
              onClick={handleExportPDF}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
            >
              <span>📄</span> PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
            >
              <span>📊</span> Excel
            </button>
            <Link
              to={`/ledgers/edit/${ledger._id}`}
              className="bg-yellow-600 text-white px-6 py-2 rounded hover:bg-yellow-700"
            >
              Edit
            </Link>
            <button
              onClick={() => navigate('/ledgers')}
              className="bg-luxury-bg0 text-white px-6 py-2 rounded hover:bg-gray-600"
            >
              Back
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-2 gap-6">
            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Ledger Name</label>
              <div className="text-lg font-semibold">{ledger.name}</div>
            </div>

            {ledger.alias && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Alias</label>
                <div className="text-lg">{ledger.alias}</div>
              </div>
            )}

            
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Under Group</label>
              <div className="text-lg">{ledger.group?.name || 'N/A'}</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Opening Balance</label>
              <div className="text-lg">
                ₹{(ledger.openingBalance?.amount || 0).toFixed(2)} {ledger.openingBalance?.type}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Current Balance</label>
              <div className="text-lg font-bold text-blue-600">
                ₹{(ledger.currentBalance?.amount || 0).toFixed(2)} {ledger.currentBalance?.type}
              </div>
            </div>

            {ledger.description && (
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                <div className="text-lg">{ledger.description}</div>
              </div>
            )}
          </div>

          {/* Contact Details for Sundry Debtors/Creditors */}
          {ledger.contactDetails && (ledger.contactDetails.address || ledger.contactDetails.phone || ledger.contactDetails.email) && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-xl font-semibold mb-4">Contact Details</h3>
              <div className="grid grid-cols-2 gap-4">
                {ledger.contactDetails.address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                    <div>{ledger.contactDetails.address}</div>
                  </div>
                )}
                {ledger.contactDetails.city && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
                    <div>{ledger.contactDetails.city}</div>
                  </div>
                )}
                {ledger.contactDetails.phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                    <div>{ledger.contactDetails.phone}</div>
                  </div>
                )}
                {ledger.contactDetails.email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                    <div>{ledger.contactDetails.email}</div>
                  </div>
                )}
                {ledger.contactDetails.gstin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">GSTIN</label>
                    <div>{ledger.contactDetails.gstin}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bank Details */}
          {ledger.bankDetails && ledger.bankDetails.accountNumber && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-xl font-semibold mb-4">Bank Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Account Number</label>
                  <div>{ledger.bankDetails.accountNumber}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">IFSC Code</label>
                  <div>{ledger.bankDetails.ifscCode}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Bank Name</label>
                  <div>{ledger.bankDetails.bankName}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Branch</label>
                  <div>{ledger.bankDetails.branch}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-luxury-bg border-b">
            <h2 className="text-xl font-semibold">Transaction History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Voucher No.</th>
                  <th className="px-4 py-3 text-left">Particulars</th>
                  <th className="px-4 py-3 text-right">Debit (₹)</th>
                  <th className="px-4 py-3 text-right">Credit (₹)</th>
                  <th className="px-4 py-3 text-right">Balance (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="bg-luxury-bg font-semibold">
                  <td colSpan="5" className="px-4 py-2">Opening Balance</td>
                  <td className="px-4 py-2 text-right">
                    ₹{(ledger.openingBalance?.amount || 0).toFixed(2)}
                  </td>
                </tr>
                {transactions.length > 0 ? (
                  transactions.map((txn, idx) => (
                    <tr key={idx} className="hover:bg-luxury-bg">
                      <td className="px-4 py-3">{new Date(txn.date).toLocaleDateString()}</td>
                      <td className="px-4 py-3">{txn.voucherNumber}</td>
                      <td className="px-4 py-3">{txn.particulars}</td>
                      <td className="px-4 py-3 text-right">
                        {txn.debit > 0 ? `₹${txn.debit.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {txn.credit > 0 ? `₹${txn.credit.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold">
                        ₹{txn.balance.toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      No transactions found for this ledger
                    </td>
                  </tr>
                )}
                {transactions.length > 0 && (
                  <tr className="bg-blue-100 font-bold">
                    <td colSpan="5" className="px-4 py-3">Closing Balance</td>
                    <td className="px-4 py-3 text-right">
                      ₹{transactions[transactions.length - 1].balance.toFixed(2)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LedgerView;
