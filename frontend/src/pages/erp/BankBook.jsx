import React, { useState, useEffect } from 'react';
import { useCompany } from '../../context/CompanyContext';
import api from '../../utils/api';
import Navbar from '../../components/ERPNavbar';
import { exportLedgerDetailsToPDF, exportLedgerDetailsToExcel } from '../../utils/exportUtils';

const BankBook = () => {
  const { selectedCompanyId } = useCompany();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [bankLedgers, setBankLedgers] = useState([]);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBankLedgers();
  }, []);

  useEffect(() => {
    if (selectedBank) {
      fetchBankBook();
    }
  }, [selectedBank, startDate, endDate]);

  const fetchBankLedgers = async () => {
    try {
      setError('');
      const response = await api.get(`/ledgers?company=${selectedCompanyId}`);
      const banks = response.data.data.filter(l => l.group?.name === 'Bank Accounts');
      setBankLedgers(banks);
      if (banks.length > 0) {
        setSelectedBank(banks[0]._id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching bank ledgers:', error);
      setError('Failed to load bank ledgers. Please try again.');
      setLoading(false);
    }
  };

  const fetchBankBook = async () => {
    try {
      setError('');
      setLoading(true);
      let url = `/vouchers?company=${selectedCompanyId}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      
      const response = await api.get(url);
      const vouchers = response.data.data || [];
      
      const bankTransactions = [];
      for (const voucher of vouchers) {
        for (const entry of voucher.entries) {
          if (entry.ledger?._id === selectedBank) {
            bankTransactions.push({
              date: voucher.date,
              voucherNumber: voucher.voucherNumber,
              voucherType: voucher.voucherType,
              particulars: voucher.narration || entry.ledger.name,
              debit: entry.type === 'Dr' ? entry.amount : 0,
              credit: entry.type === 'Cr' ? entry.amount : 0
            });
          }
        }
      }
      
      setTransactions(bankTransactions);
    } catch (error) {
      console.error('Error fetching bank book:', error);
      setError('Failed to load bank book data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateRunningBalance = () => {
    let balance = openingBalance;
    return transactions.map(txn => {
      balance = balance + txn.debit - txn.credit;
      return { ...txn, balance };
    });
  };

  const transactionsWithBalance = calculateRunningBalance();
  const closingBalance = transactionsWithBalance.length > 0 
    ? transactionsWithBalance[transactionsWithBalance.length - 1].balance 
    : openingBalance;

  const handleExportPDF = () => {
    const selectedBankName = bankLedgers.find(b => b._id === selectedBank)?.name || 'Bank Book';
    exportLedgerDetailsToPDF(selectedBankName, transactionsWithBalance, openingBalance, closingBalance, user.company.name);
  };

  const handleExportExcel = () => {
    const selectedBankName = bankLedgers.find(b => b._id === selectedBank)?.name || 'Bank Book';
    exportLedgerDetailsToExcel(selectedBankName, transactionsWithBalance, openingBalance, closingBalance, user.company.name);
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

  if (bankLedgers.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Bank Book</h1>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <p className="text-lg text-yellow-800">
              No bank accounts found. Please create a bank account ledger under the "Bank Accounts" group first.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-10 animate-fade-in">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">Bank Book</h1>
            <p className="text-gray-600 text-lg">Bank transactions and account balances</p>
          </div>
          <div className="flex gap-3">
            <button onClick={handleExportPDF} className="btn-gradient text-white px-6 py-3 rounded-xl hover:shadow-2xl flex items-center gap-2 font-semibold shadow-xl transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              PDF
            </button>
            <button onClick={handleExportExcel} className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-2xl flex items-center gap-2 font-semibold shadow-xl transition-all duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Excel
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 text-red-800 px-5 py-4 rounded-lg mb-6 animate-fade-in shadow-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border-t-4 border-teal-500 animate-fade-in">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800">Filters</h3>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">Bank Account</label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-500 transition-all"
              >
                {bankLedgers.map(bank => (
                  <option key={bank._id} value={bank._id}>{bank.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-teal-100 focus:border-teal-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Opening Balance</label>
              <input
                type="number"
                value={openingBalance}
                onChange={(e) => setOpeningBalance(parseFloat(e.target.value) || 0)}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Voucher No.</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Particulars</th>
                <th className="px-4 py-3 text-right">Debit (₹)</th>
                <th className="px-4 py-3 text-right">Credit (₹)</th>
                <th className="px-4 py-3 text-right">Balance (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="bg-luxury-bg font-semibold">
                <td colSpan="6" className="px-4 py-2">Opening Balance</td>
                <td className="px-4 py-2 text-right">₹{openingBalance.toFixed(2)}</td>
              </tr>
              {transactionsWithBalance.map((txn, idx) => (
                <tr key={idx} className="hover:bg-luxury-bg">
                  <td className="px-4 py-3">{new Date(txn.date).toLocaleDateString()}</td>
                  <td className="px-4 py-3">{txn.voucherNumber}</td>
                  <td className="px-4 py-3">{txn.voucherType}</td>
                  <td className="px-4 py-3">{txn.particulars}</td>
                  <td className="px-4 py-3 text-right">{txn.debit > 0 ? `₹${txn.debit.toFixed(2)}` : '-'}</td>
                  <td className="px-4 py-3 text-right">{txn.credit > 0 ? `₹${txn.credit.toFixed(2)}` : '-'}</td>
                  <td className="px-4 py-3 text-right font-semibold">₹{txn.balance.toFixed(2)}</td>
                </tr>
              ))}
              <tr className="bg-purple-100 font-bold">
                <td colSpan="6" className="px-4 py-3">Closing Balance</td>
                <td className="px-4 py-3 text-right">₹{closingBalance.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          {transactions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No bank transactions found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BankBook;
