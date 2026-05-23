import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import { useCompany } from '../../context/CompanyContext';
import Navbar from '../../components/ERPNavbar';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';

const TrialBalance = () => {
  const { selectedCompanyId, selectedCompany } = useCompany();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!selectedCompanyId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchReport(selectedCompanyId);
  }, [selectedCompanyId]);

  const fetchReport = async (companyId) => {
    try {
      const response = await api.get(`/reports/trial-balance?company=${companyId}`);
      setData(response.data.data);
    } catch (error) {
      console.error('Error fetching trial balance:', error);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    if (!data) return;
    const tableData = data.entries.map(entry => [
      entry.ledger,
      entry.group,
      entry.debit > 0 ? entry.debit.toFixed(2) : '-',
      entry.credit > 0 ? entry.credit.toFixed(2) : '-'
    ]);

    tableData.push([
      'Total',
      '',
      data.totals.debit,
      data.totals.credit
    ]);

    exportToPDF(
      'Trial Balance',
      ['Ledger', 'Group', 'Debit (₹)', 'Credit (₹)'],
      tableData,
      'trial-balance',
      selectedCompany?.name || 'Selected Company'
    );
  };

  const handleExportExcel = () => {
    if (!data) return;
    const tableData = data.entries.map(entry => [
      entry.ledger,
      entry.group,
      entry.debit > 0 ? entry.debit.toFixed(2) : '-',
      entry.credit > 0 ? entry.credit.toFixed(2) : '-'
    ]);

    tableData.push([
      'Total',
      '',
      data.totals.debit,
      data.totals.credit
    ]);

    exportToExcel(
      'Trial Balance',
      ['Ledger', 'Group', 'Debit (₹)', 'Credit (₹)'],
      tableData,
      'trial-balance',
      selectedCompany?.name || 'Selected Company'
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

  if (!data) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">No data available</div>
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
            <h1 className="text-5xl font-bold gradient-text mb-2">Trial Balance</h1>
            <p className="text-gray-600 text-lg">Comprehensive view of all ledger balances</p>
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

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">{selectedCompany?.name || 'Selected Company'}</h2>
            <p className="text-gray-600">As on {new Date().toLocaleDateString()}</p>
          </div>

          <table className="w-full">
            <thead className="bg-luxury-bg">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ledger</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Group</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Debit (₹)</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Credit (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.entries.map((entry, idx) => (
                <tr key={idx} className="hover:bg-luxury-bg">
                  <td className="px-6 py-4">{entry.ledger}</td>
                  <td className="px-6 py-4 text-gray-600">{entry.group}</td>
                  <td className="px-6 py-4 text-right">
                    {entry.debit > 0 ? entry.debit.toFixed(2) : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {entry.credit > 0 ? entry.credit.toFixed(2) : '-'}
                  </td>
                </tr>
              ))}
              <tr className="bg-luxury-bg font-bold">
                <td className="px-6 py-4">Total</td>
                <td className="px-6 py-4"></td>
                <td className="px-6 py-4 text-right">{data.totals.debit}</td>
                <td className="px-6 py-4 text-right">{data.totals.credit}</td>
              </tr>
            </tbody>
          </table>

          {data?.totals && parseFloat(data.totals.difference) > 0 && (
            <div className="p-4 bg-red-50 text-red-700 text-center">
              <strong>Warning:</strong> Difference of ₹{data.totals.difference} found. 
              Debit and Credit should be equal.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrialBalance;
