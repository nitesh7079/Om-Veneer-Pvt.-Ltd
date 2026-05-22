import React, { useState, useEffect } from 'react';
import { useCompany } from '../../context/CompanyContext';
import api from '../../utils/api';
import Navbar from '../../components/ERPNavbar';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';

const ProfitLoss = () => {
  const { selectedCompanyId } = useCompany();
  const [ledgers, setLedgers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    fetchData();
  }, [startDate, endDate]);

  const fetchData = async () => {
    try {
      const [ledgersRes, vouchersRes] = await Promise.all([
        api.get(`/ledgers?company=${selectedCompanyId}`),
        api.get(`/vouchers?company=${selectedCompanyId}${startDate ? `&startDate=${startDate}` : ''}${endDate ? `&endDate=${endDate}` : ''}`)
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

  const getIncomeExpenses = () => {
    const directIncome = [];
    const indirectIncome = [];
    const directExpenses = [];
    const indirectExpenses = [];

    ledgers.forEach(ledger => {
      const balance = calculateLedgerBalance(ledger._id);
      if (Math.abs(balance) > 0.01) {
        const groupName = ledger.group?.name || '';
        
        if (groupName.includes('Sales') || groupName.includes('Direct Income')) {
          directIncome.push({ ...ledger, balance: Math.abs(balance) });
        } else if (groupName.includes('Indirect Income')) {
          indirectIncome.push({ ...ledger, balance: Math.abs(balance) });
        } else if (groupName.includes('Purchase') || groupName.includes('Direct Expenses')) {
          directExpenses.push({ ...ledger, balance: Math.abs(balance) });
        } else if (groupName.includes('Indirect Expenses')) {
          indirectExpenses.push({ ...ledger, balance: Math.abs(balance) });
        }
      }
    });

    return { directIncome, indirectIncome, directExpenses, indirectExpenses };
  };

  const { directIncome, indirectIncome, directExpenses, indirectExpenses } = getIncomeExpenses();

  const totalDirectIncome = directIncome.reduce((sum, item) => sum + item.balance, 0);
  const totalIndirectIncome = indirectIncome.reduce((sum, item) => sum + item.balance, 0);
  const totalDirectExpenses = directExpenses.reduce((sum, item) => sum + item.balance, 0);
  const totalIndirectExpenses = indirectExpenses.reduce((sum, item) => sum + item.balance, 0);

  const grossProfit = totalDirectIncome - totalDirectExpenses;
  const netProfit = grossProfit + totalIndirectIncome - totalIndirectExpenses;

  const handleExportPDF = () => {
    const tableData = [
      ['EXPENSES', '', 'INCOME', ''],
      ['Direct Expenses:', totalDirectExpenses.toFixed(2), 'Direct Income:', totalDirectIncome.toFixed(2)],
      ...directExpenses.map(l => [`  ${l.name}`, l.balance.toFixed(2), '', '']),
      ...directIncome.map((l, i) => [i === 0 ? '' : '', '', `  ${l.name}`, l.balance.toFixed(2)]),
      ['Gross Profit:', grossProfit > 0 ? grossProfit.toFixed(2) : '0.00', '', ''],
      ['Indirect Expenses:', totalIndirectExpenses.toFixed(2), 'Indirect Income:', totalIndirectIncome.toFixed(2)],
      ...indirectExpenses.map(l => [`  ${l.name}`, l.balance.toFixed(2), '', '']),
      ...indirectIncome.map((l, i) => [i === 0 ? '' : '', '', `  ${l.name}`, l.balance.toFixed(2)]),
      ['Net Profit:', netProfit >= 0 ? netProfit.toFixed(2) : `(${Math.abs(netProfit).toFixed(2)})`, '', '']
    ];
    exportToPDF('Profit & Loss Account', ['Expenditure', 'Amount (₹)', 'Income', 'Amount (₹)'], tableData, 'profit-loss', user.company.name);
  };

  const handleExportExcel = () => {
    const tableData = [
      ['EXPENSES', '', 'INCOME', ''],
      ['Direct Expenses:', totalDirectExpenses.toFixed(2), 'Direct Income:', totalDirectIncome.toFixed(2)],
      ...directExpenses.map(l => [`  ${l.name}`, l.balance.toFixed(2), '', '']),
      ...directIncome.map((l, i) => [i === 0 ? '' : '', '', `  ${l.name}`, l.balance.toFixed(2)]),
      ['Gross Profit:', grossProfit > 0 ? grossProfit.toFixed(2) : '0.00', '', ''],
      ['Indirect Expenses:', totalIndirectExpenses.toFixed(2), 'Indirect Income:', totalIndirectIncome.toFixed(2)],
      ...indirectExpenses.map(l => [`  ${l.name}`, l.balance.toFixed(2), '', '']),
      ...indirectIncome.map((l, i) => [i === 0 ? '' : '', '', `  ${l.name}`, l.balance.toFixed(2)]),
      ['Net Profit:', netProfit >= 0 ? netProfit.toFixed(2) : `(${Math.abs(netProfit).toFixed(2)})`, '', '']
    ];
    exportToExcel('Profit & Loss Account', ['Expenditure', 'Amount (₹)', 'Income', 'Amount (₹)'], tableData, 'profit-loss', user.company.name);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-10 animate-fade-in">
          <div>
            <h1 className="text-5xl font-bold gradient-text mb-2">Profit & Loss Account</h1>
            <p className="text-gray-600 text-lg">Income and expenditure statement</p>
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

        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border-t-4 border-green-500 animate-fade-in">
          <div className="flex items-center mb-4">
            <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <h3 className="text-xl font-bold text-gray-800">Date Range Filters</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-2 text-gray-700">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-100 focus:border-green-500 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Expenses Side */}
          <div className="bg-white rounded-lg shadow">
            <div className="bg-red-600 text-white px-4 py-3 font-bold">Expenditure</div>
            <div className="p-4">
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2 text-red-700">Direct Expenses</h3>
                {directExpenses.map(ledger => (
                  <div key={ledger._id} className="flex justify-between py-1">
                    <span>{ledger.name}</span>
                    <span>₹{ledger.balance.toFixed(2)}</span>
                  </div>
                ))}
                {directExpenses.length === 0 && <div className="text-gray-500 text-sm">No direct expenses</div>}
              </div>

              <div className="border-t pt-2 mb-4">
                <div className="flex justify-between font-semibold">
                  <span>Gross Profit c/d</span>
                  <span className="text-green-600">₹{grossProfit > 0 ? grossProfit.toFixed(2) : '0.00'}</span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2 text-red-700">Indirect Expenses</h3>
                {indirectExpenses.map(ledger => (
                  <div key={ledger._id} className="flex justify-between py-1">
                    <span>{ledger.name}</span>
                    <span>₹{ledger.balance.toFixed(2)}</span>
                  </div>
                ))}
                {indirectExpenses.length === 0 && <div className="text-gray-500 text-sm">No indirect expenses</div>}
              </div>

              <div className="border-t-2 pt-2">
                <div className="flex justify-between font-bold text-lg">
                  <span>Net Profit</span>
                  <span className={netProfit >= 0 ? 'text-green-600' : 'text-red-600'}>
                    ₹{Math.abs(netProfit).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Income Side */}
          <div className="bg-white rounded-lg shadow">
            <div className="bg-green-600 text-white px-4 py-3 font-bold">Income</div>
            <div className="p-4">
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2 text-green-700">Direct Income</h3>
                {directIncome.map(ledger => (
                  <div key={ledger._id} className="flex justify-between py-1">
                    <span>{ledger.name}</span>
                    <span>₹{ledger.balance.toFixed(2)}</span>
                  </div>
                ))}
                {directIncome.length === 0 && <div className="text-gray-500 text-sm">No direct income</div>}
              </div>

              <div className="border-t pt-2 mb-4">
                <div className="flex justify-between font-semibold">
                  <span>Gross Profit b/d</span>
                  <span className="text-green-600">₹{grossProfit > 0 ? grossProfit.toFixed(2) : '0.00'}</span>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2 text-green-700">Indirect Income</h3>
                {indirectIncome.map(ledger => (
                  <div key={ledger._id} className="flex justify-between py-1">
                    <span>{ledger.name}</span>
                    <span>₹{ledger.balance.toFixed(2)}</span>
                  </div>
                ))}
                {indirectIncome.length === 0 && <div className="text-gray-500 text-sm">No indirect income</div>}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">Summary</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between py-2">
                <span>Total Direct Income:</span>
                <span className="font-semibold">₹{totalDirectIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Total Direct Expenses:</span>
                <span className="font-semibold">₹{totalDirectExpenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2">
                <span className="font-bold">Gross Profit:</span>
                <span className={`font-bold ${grossProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{Math.abs(grossProfit).toFixed(2)}
                </span>
              </div>
            </div>
            <div>
              <div className="flex justify-between py-2">
                <span>Total Indirect Income:</span>
                <span className="font-semibold">₹{totalIndirectIncome.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span>Total Indirect Expenses:</span>
                <span className="font-semibold">₹{totalIndirectExpenses.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-t-2">
                <span className="font-bold">Net Profit:</span>
                <span className={`font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ₹{Math.abs(netProfit).toFixed(2)} {netProfit < 0 ? '(Loss)' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfitLoss;
