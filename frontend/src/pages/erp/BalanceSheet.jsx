import React, { useState, useEffect } from 'react';
import { useCompany } from '../../context/CompanyContext';
import api, { cachedGet } from '../../utils/api';
import Navbar from '../../components/ERPNavbar';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';
import TableSkeleton from '../../components/TableSkeleton';

const BalanceSheet = () => {
  const { selectedCompanyId } = useCompany();
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [asOnDate, setAsOnDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    fetchData();
  }, [asOnDate]);

  const fetchData = async () => {
    try {
      const [ledgersRes, vouchersRes] = await Promise.all([
        cachedGet(`/ledgers?company=${selectedCompanyId}`),
        cachedGet(`/vouchers?company=${selectedCompanyId}&endDate=${asOnDate}`)
      ]);
      
      setLedgers(ledgersRes.data.data || []);
      setVouchers(vouchersRes.data.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateLedgerBalance = (ledgerId) => {
    let balance = 0;
    vouchers.forEach(voucher => {
      voucher.entries.forEach(entry => {
        if (entry.ledger?._id === ledgerId) {
          if (entry.type === 'Dr') {
            balance += entry.amount;
          } else {
            balance -= entry.amount;
          }
        }
      });
    });
    return balance;
  };

  const getBalanceSheetData = () => {
    const assets = {
      fixedAssets: [],
      currentAssets: [],
      investments: []
    };
    const liabilities = {
      capital: [],
      loans: [],
      currentLiabilities: [],
      reserves: []
    };

    ledgers.forEach(ledger => {
      const balance = calculateLedgerBalance(ledger._id);
      if (Math.abs(balance) > 0.01) {
        const groupName = ledger.group?.name || '';
        const nature = ledger.group?.nature || '';

        if (nature === 'Assets') {
          if (groupName.includes('Fixed Assets')) {
            assets.fixedAssets.push({ ...ledger, balance: Math.abs(balance) });
          } else if (groupName.includes('Current Assets') || groupName.includes('Bank') || groupName.includes('Cash')) {
            assets.currentAssets.push({ ...ledger, balance: Math.abs(balance) });
          } else if (groupName.includes('Investment')) {
            assets.investments.push({ ...ledger, balance: Math.abs(balance) });
          } else {
            assets.currentAssets.push({ ...ledger, balance: Math.abs(balance) });
          }
        } else if (nature === 'Liabilities') {
          if (groupName.includes('Capital')) {
            liabilities.capital.push({ ...ledger, balance: Math.abs(balance) });
          } else if (groupName.includes('Loan') || groupName.includes('Duties & Taxes')) {
            liabilities.loans.push({ ...ledger, balance: Math.abs(balance) });
          } else if (groupName.includes('Current Liabilities') || groupName.includes('Creditors')) {
            liabilities.currentLiabilities.push({ ...ledger, balance: Math.abs(balance) });
          } else if (groupName.includes('Reserves')) {
            liabilities.reserves.push({ ...ledger, balance: Math.abs(balance) });
          } else {
            liabilities.currentLiabilities.push({ ...ledger, balance: Math.abs(balance) });
          }
        }
      }
    });

    return { assets, liabilities };
  };

  const { assets, liabilities } = getBalanceSheetData();

  const totalAssets = [
    ...assets.fixedAssets,
    ...assets.currentAssets,
    ...assets.investments
  ].reduce((sum, item) => sum + item.balance, 0);

  const totalLiabilities = [
    ...liabilities.capital,
    ...liabilities.loans,
    ...liabilities.currentLiabilities,
    ...liabilities.reserves
  ].reduce((sum, item) => sum + item.balance, 0);

  const handleExportPDF = () => {
    const tableData = [
      ['LIABILITIES', '', 'ASSETS', ''],
      ['Capital Account:', '', 'Fixed Assets:', ''],
      ...liabilities.capital.map(l => [`  ${l.name}`, l.balance.toFixed(2), '', '']),
      ...assets.fixedAssets.map((a, i) => [i === 0 ? '' : '', '', `  ${a.name}`, a.balance.toFixed(2)]),
      ['Current Liabilities:', '', 'Current Assets:', ''],
      ...liabilities.currentLiabilities.map(l => [`  ${l.name}`, l.balance.toFixed(2), '', '']),
      ...assets.currentAssets.map((a, i) => [i === 0 ? '' : '', '', `  ${a.name}`, a.balance.toFixed(2)]),
      ['Total:', totalLiabilities.toFixed(2), 'Total:', totalAssets.toFixed(2)]
    ];
    exportToPDF('Balance Sheet', ['Liabilities', 'Amount (₹)', 'Assets', 'Amount (₹)'], tableData, 'balance-sheet', user.company.name);
  };

  const handleExportExcel = () => {
    const tableData = [
      ['LIABILITIES', '', 'ASSETS', ''],
      ['Capital Account:', '', 'Fixed Assets:', ''],
      ...liabilities.capital.map(l => [`  ${l.name}`, l.balance.toFixed(2), '', '']),
      ...assets.fixedAssets.map((a, i) => [i === 0 ? '' : '', '', `  ${a.name}`, a.balance.toFixed(2)]),
      ['Current Liabilities:', '', 'Current Assets:', ''],
      ...liabilities.currentLiabilities.map(l => [`  ${l.name}`, l.balance.toFixed(2), '', '']),
      ...assets.currentAssets.map((a, i) => [i === 0 ? '' : '', '', `  ${a.name}`, a.balance.toFixed(2)]),
      ['Total:', totalLiabilities.toFixed(2), 'Total:', totalAssets.toFixed(2)]
    ];
    exportToExcel('Balance Sheet', ['Liabilities', 'Amount (₹)', 'Assets', 'Amount (₹)'], tableData, 'balance-sheet', user.company.name);
  };

  if (loading) return <TableSkeleton Navbar={Navbar} cols={4} rows={12} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-20">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-10 animate-fade-in">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">Balance Sheet</h1>
            <p className="text-gray-600 text-lg">Statement of assets and liabilities</p>
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

        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-gray-100 animate-fade-in">
          <div className="flex items-center gap-4">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <label className="block text-sm font-bold text-gray-700 tracking-wide">As on Date:</label>
            <input
              type="date"
              value={asOnDate}
              onChange={(e) => setAsOnDate(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all font-semibold text-gray-900 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Liabilities Side */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 font-bold text-lg">Liabilities</div>
            <div className="p-4">
              {liabilities.capital.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2 text-blue-700">Capital Account</h3>
                  {liabilities.capital.map(ledger => (
                    <div key={ledger._id} className="flex justify-between py-1">
                      <span>{ledger.name}</span>
                      <span>₹{ledger.balance.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {liabilities.reserves.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2 text-blue-700">Reserves & Surplus</h3>
                  {liabilities.reserves.map(ledger => (
                    <div key={ledger._id} className="flex justify-between py-1">
                      <span>{ledger.name}</span>
                      <span>₹{ledger.balance.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {liabilities.loans.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2 text-blue-700">Loans & Advances</h3>
                  {liabilities.loans.map(ledger => (
                    <div key={ledger._id} className="flex justify-between py-1">
                      <span>{ledger.name}</span>
                      <span>₹{ledger.balance.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {liabilities.currentLiabilities.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2 text-blue-700">Current Liabilities</h3>
                  {liabilities.currentLiabilities.map(ledger => (
                    <div key={ledger._id} className="flex justify-between py-1">
                      <span>{ledger.name}</span>
                      <span>₹{ledger.balance.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t-2 pt-2 mt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">₹{totalLiabilities.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Assets Side */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-4 font-bold text-lg">Assets</div>
            <div className="p-4">
              {assets.fixedAssets.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2 text-green-700">Fixed Assets</h3>
                  {assets.fixedAssets.map(ledger => (
                    <div key={ledger._id} className="flex justify-between py-1">
                      <span>{ledger.name}</span>
                      <span>₹{ledger.balance.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {assets.investments.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2 text-green-700">Investments</h3>
                  {assets.investments.map(ledger => (
                    <div key={ledger._id} className="flex justify-between py-1">
                      <span>{ledger.name}</span>
                      <span>₹{ledger.balance.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              {assets.currentAssets.length > 0 && (
                <div className="mb-4">
                  <h3 className="font-semibold text-lg mb-2 text-green-700">Current Assets</h3>
                  {assets.currentAssets.map(ledger => (
                    <div key={ledger._id} className="flex justify-between py-1">
                      <span>{ledger.name}</span>
                      <span>₹{ledger.balance.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t-2 pt-2 mt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-green-600">₹{totalAssets.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">Balance Check</h3>
            <div className={`text-2xl font-bold ${Math.abs(totalAssets - totalLiabilities) < 0.01 ? 'text-green-600' : 'text-red-600'}`}>
              {Math.abs(totalAssets - totalLiabilities) < 0.01 ? '✓ Balanced' : '⚠ Not Balanced'}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6 mt-4">
            <div className="flex justify-between py-2">
              <span>Total Assets:</span>
              <span className="font-bold">₹{totalAssets.toFixed(2)}</span>
            </div>
            <div className="flex justify-between py-2">
              <span>Total Liabilities:</span>
              <span className="font-bold">₹{totalLiabilities.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
