import React, { useState, useEffect } from 'react';
import { useCompany } from '../../context/CompanyContext';
import api from '../../utils/api';
import Navbar from '../../components/ERPNavbar';
import TableSkeleton from '../../components/TableSkeleton';
import { exportLedgerDetailsToPDF, exportLedgerDetailsToExcel } from '../../utils/exportUtils';

const CashBook = () => {
  const { selectedCompanyId } = useCompany();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [openingBalance, setOpeningBalance] = useState(0);

  useEffect(() => {
    fetchCashBook();
  }, [startDate, endDate]);

  const fetchCashBook = async () => {
    try {
      let url = `/vouchers?company=${selectedCompanyId}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const response = await api.get(url);
      const vouchers = response.data.data || [];

      // Filter cash transactions
      const cashTransactions = [];
      for (const voucher of vouchers) {
        for (const entry of voucher.entries) {
          if (entry.ledger?.group?.name === 'Cash-in-Hand') {
            cashTransactions.push({
              date: voucher.date,
              voucherNumber: voucher.voucherNumber,
              voucherType: voucher.voucherType,
              particulars: voucher.narration || entry.ledger.name,
              debit: entry.type === 'Dr' ? entry.amount : 0,
              credit: entry.type === 'Cr' ? entry.amount : 0,
              voucher: voucher
            });
          }
        }
      }

      setTransactions(cashTransactions);
    } catch (error) {
      console.error('Error fetching cash book:', error);
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
    exportLedgerDetailsToPDF('Cash Book', transactionsWithBalance, openingBalance, closingBalance, user.company.name);
  };

  const handleExportExcel = () => {
    exportLedgerDetailsToExcel('Cash Book', transactionsWithBalance, openingBalance, closingBalance, user.company.name);
  };

  if (loading) return <TableSkeleton Navbar={Navbar} cols={5} rows={10} />;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-10 animate-fade-in">
            <div>
              <h1 className="text-5xl font-bold gradient-text mb-2">Cash Book</h1>
              <p className="text-gray-600 text-lg">Cash transactions and balances</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleExportPDF}
                className="btn-gradient text-white px-6 py-3 rounded-xl hover:shadow-2xl flex items-center gap-2 font-semibold shadow-xl transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF
              </button>
              <button
                onClick={handleExportExcel}
                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-2xl flex items-center gap-2 font-semibold shadow-xl transition-all duration-300"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 mb-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 tracking-wide mb-2">From Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="text-gray-900 bg-white font-semibold w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-semibold text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 tracking-wide mb-2">To Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="text-gray-900 bg-white font-semibold w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-semibold text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 tracking-wide mb-2">Opening Balance</label>
                <input
                  type="number"
                  value={openingBalance}
                  onChange={(e) => setOpeningBalance(parseFloat(e.target.value) || 0)}
                  className="text-gray-900 bg-white font-semibold w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-semibold text-gray-900 bg-white"
                  step="0.01"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
            <table className="w-full professional-table">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
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
                <tr className="bg-blue-100 font-bold">
                  <td colSpan="6" className="px-4 py-3">Closing Balance</td>
                  <td className="px-4 py-3 text-right">₹{closingBalance.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            {transactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No cash transactions found
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CashBook;
