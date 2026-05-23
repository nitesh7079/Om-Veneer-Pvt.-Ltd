import React, { useState, useEffect } from 'react';
import { useCompany } from '../../context/CompanyContext';
import api from '../../utils/api';
import Navbar from '../../components/ERPNavbar';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';

const Payables = () => {
  const { selectedCompanyId } = useCompany();
  const [payables, setPayables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vouchers, setVouchers] = useState([]);
  const [creditors, setCreditors] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [ledgersRes, vouchersRes] = await Promise.all([
        api.get(`/ledgers?company=${selectedCompanyId}`),
        api.get(`/vouchers?company=${selectedCompanyId}`)
      ]);
      
      const allLedgers = ledgersRes.data.data || [];
      const creditorLedgers = allLedgers.filter(l => l.group?.name === 'Sundry Creditors');
      setCreditors(creditorLedgers);
      setVouchers(vouchersRes.data.data || []);
      
      calculatePayables(creditorLedgers, vouchersRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePayables = (creditorLedgers, allVouchers) => {
    const payablesList = [];

    creditorLedgers.forEach(creditor => {
      let balance = 0;
      const transactions = [];

      allVouchers.forEach(voucher => {
        voucher.entries.forEach(entry => {
          if (entry.ledger?._id === creditor._id) {
            if (entry.type === 'Cr') {
              balance += entry.amount;
            } else {
              balance -= entry.amount;
            }
            transactions.push({
              date: voucher.date,
              voucherNumber: voucher.voucherNumber,
              type: voucher.voucherType,
              amount: entry.amount,
              entryType: entry.type
            });
          }
        });
      });

      if (balance > 0.01) {
        payablesList.push({
          creditor,
          balance,
          transactions
        });
      }
    });

    setPayables(payablesList);
  };

  const getTotalPayables = () => {
    return payables.reduce((sum, item) => sum + item.balance, 0);
  };

  const handleExportPDF = () => {
    const tableData = payables.map(item => [
      item.creditor.name,
      item.creditor.contactDetails?.mobile || '-',
      item.balance.toFixed(2)
    ]);
    tableData.push(['Total Payables:', '', getTotalPayables().toFixed(2)]);
    exportToPDF('Payables Report', ['Creditor Name', 'Contact', 'Outstanding (₹)'], tableData, 'payables', user.company.name);
  };

  const handleExportExcel = () => {
    const tableData = payables.map(item => [
      item.creditor.name,
      item.creditor.contactDetails?.mobile || '-',
      item.balance.toFixed(2)
    ]);
    tableData.push(['Total Payables:', '', getTotalPayables().toFixed(2)]);
    exportToExcel('Payables Report', ['Creditor Name', 'Contact', 'Outstanding (₹)'], tableData, 'payables', user.company.name);
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
            <h1 className="text-5xl font-bold gradient-text mb-2">Payables</h1>
            <p className="text-gray-600 text-lg">Outstanding amounts to creditors</p>
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

        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border-t-4 border-red-500 animate-fade-in">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border-l-4 border-red-500">
              <div className="text-sm font-bold text-gray-700 mb-1">Total Creditors</div>
              <div className="text-4xl font-bold gradient-text">{payables.length}</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl border-l-4 border-orange-500">
              <div className="text-sm font-bold text-gray-700 mb-1">Total Outstanding</div>
              <div className="text-4xl font-bold text-orange-600">₹{getTotalPayables().toFixed(2)}</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border-l-4 border-yellow-500">
              <div className="text-sm font-bold text-gray-700 mb-1">Average per Creditor</div>
              <div className="text-3xl font-bold text-yellow-600">
                ₹{payables.length > 0 ? (getTotalPayables() / payables.length).toFixed(2) : '0.00'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-red-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Creditor Name</th>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-right">Outstanding Amount (₹)</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payables.map((item, idx) => (
                <tr key={idx} className="hover:bg-luxury-bg">
                  <td className="px-4 py-3 font-semibold">{item.creditor.name}</td>
                  <td className="px-4 py-3">{item.creditor.contactDetails?.mobile || '-'}</td>
                  <td className="px-4 py-3 text-right font-bold text-red-600">
                    ₹{item.balance.toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-red-600 hover:underline text-sm">View Details</button>
                  </td>
                </tr>
              ))}
              <tr className="bg-red-100 font-bold">
                <td colSpan="2" className="px-4 py-3 text-right">Total Payables:</td>
                <td className="px-4 py-3 text-right text-lg">₹{getTotalPayables().toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          {payables.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No outstanding payables
            </div>
          )}
        </div>

        {payables.length > 0 && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4">Top Creditors</h3>
            <div className="space-y-3">
              {payables
                .sort((a, b) => b.balance - a.balance)
                .slice(0, 5)
                .map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-luxury-bg rounded">
                    <div>
                      <div className="font-semibold">{item.creditor.name}</div>
                      <div className="text-sm text-gray-600">{item.transactions.length} transactions</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg text-red-600">₹{item.balance.toFixed(2)}</div>
                      <div className="text-xs text-gray-600">
                        {((item.balance / getTotalPayables()) * 100).toFixed(1)}% of total
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payables;
