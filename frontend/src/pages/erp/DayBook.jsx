import React, { useState, useEffect } from 'react';
import { useCompany } from '../../context/CompanyContext';
import api from '../../utils/api';
import Navbar from '../../components/ERPNavbar';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';

const DayBook = () => {
  const { selectedCompanyId } = useCompany();
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-CA'));

  useEffect(() => {
    fetchDayBook();
  }, [selectedDate]);

  const fetchDayBook = async () => {
    try {
      const url = `/vouchers?company=${selectedCompanyId}&startDate=${selectedDate}&endDate=${selectedDate}`;
      const response = await api.get(url);
      setVouchers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching day book:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalDebit = () => {
    return vouchers.reduce((sum, voucher) => {
      const debitSum = voucher.entries
        .filter(e => e.type === 'Dr')
        .reduce((s, e) => s + e.amount, 0);
      return sum + debitSum;
    }, 0);
  };

  const getTotalCredit = () => {
    return vouchers.reduce((sum, voucher) => {
      const creditSum = voucher.entries
        .filter(e => e.type === 'Cr')
        .reduce((s, e) => s + e.amount, 0);
      return sum + creditSum;
    }, 0);
  };

  const handleExportPDF = () => {
    const tableData = [];
    vouchers.forEach(voucher => {
      tableData.push([voucher.voucherNumber, voucher.voucherType, voucher.narration || '-', '', '']);
      voucher.entries.forEach(entry => {
        tableData.push(['', '', `${entry.type} ${entry.ledger?.name || 'Unknown'}`, entry.type === 'Dr' ? entry.amount.toFixed(2) : '-', entry.type === 'Cr' ? entry.amount.toFixed(2) : '-']);
      });
    });
    tableData.push(['Total', '', '', getTotalDebit().toFixed(2), getTotalCredit().toFixed(2)]);
    exportToPDF('Day Book', ['Voucher No.', 'Type', 'Particulars', 'Debit (₹)', 'Credit (₹)'], tableData, `day-book-${selectedDate}`, user.company.name);
  };

  const handleExportExcel = () => {
    const tableData = [];
    vouchers.forEach(voucher => {
      tableData.push([voucher.voucherNumber, voucher.voucherType, voucher.narration || '-', '', '']);
      voucher.entries.forEach(entry => {
        tableData.push(['', '', `${entry.type} ${entry.ledger?.name || 'Unknown'}`, entry.type === 'Dr' ? entry.amount.toFixed(2) : '-', entry.type === 'Cr' ? entry.amount.toFixed(2) : '-']);
      });
    });
    tableData.push(['Total', '', '', getTotalDebit().toFixed(2), getTotalCredit().toFixed(2)]);
    exportToExcel('Day Book', ['Voucher No.', 'Type', 'Particulars', 'Debit (₹)', 'Credit (₹)'], tableData, `day-book-${selectedDate}`, user.company.name);
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
            <h1 className="text-5xl font-bold gradient-text mb-2">Day Book</h1>
            <p className="text-gray-600 text-lg">Daily transactions and voucher entries</p>
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

        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border-t-4 border-indigo-500 animate-fade-in">
          <div className="flex items-center gap-4">
            <label className="block text-sm font-medium">Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left">Voucher No.</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Particulars</th>
                <th className="px-4 py-3 text-right">Debit (₹)</th>
                <th className="px-4 py-3 text-right">Credit (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {vouchers.map((voucher) => (
                <React.Fragment key={voucher._id}>
                  <tr className="bg-luxury-bg font-semibold">
                    <td className="px-4 py-2">{voucher.voucherNumber}</td>
                    <td className="px-4 py-2">{voucher.voucherType}</td>
                    <td className="px-4 py-2" colSpan="3">{voucher.narration || '-'}</td>
                  </tr>
                  {voucher.entries.map((entry, idx) => (
                    <tr key={idx} className="hover:bg-luxury-bg">
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2"></td>
                      <td className="px-4 py-2 pl-8">
                        {entry.type === 'Dr' ? 'Dr ' : 'Cr '} {entry.ledger?.name || 'Unknown'}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {entry.type === 'Dr' ? `₹${entry.amount.toFixed(2)}` : '-'}
                      </td>
                      <td className="px-4 py-2 text-right">
                        {entry.type === 'Cr' ? `₹${entry.amount.toFixed(2)}` : '-'}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
              <tr className="bg-green-100 font-bold">
                <td colSpan="3" className="px-4 py-3 text-right">Total:</td>
                <td className="px-4 py-3 text-right">₹{getTotalDebit().toFixed(2)}</td>
                <td className="px-4 py-3 text-right">₹{getTotalCredit().toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          {vouchers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No transactions found for this date
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DayBook;
