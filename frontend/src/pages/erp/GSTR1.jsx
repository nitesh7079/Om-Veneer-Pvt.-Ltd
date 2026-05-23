import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Navbar from '../../components/ERPNavbar';
import TableSkeleton from '../../components/TableSkeleton';
import { useCompany } from '../../context/CompanyContext';
import api from '../../utils/api';

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2
});

const formatCurrency = (value = 0) => currencyFormatter.format(value || 0);
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const GSTR1 = () => {
  const { selectedCompanyId } = useCompany();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const now = useMemo(() => new Date(), []);
  const [filters, setFilters] = useState({
    month: now.getMonth() + 1,
    year: now.getFullYear()
  });

  const companyId = selectedCompanyId;

  const fetchReport = useCallback(async () => {
    if (!companyId) {
      setReport(null);
      setError('Select a company to view GST reports.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const { month, year } = filters;
      const { data } = await api.get(`/gst/gstr1?company=${companyId}&month=${month}&year=${year}`);
      setReport(data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load GSTR-1 report.');
      setReport(null);
    } finally {
      setLoading(false);
    }
  }, [companyId, filters]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return <TableSkeleton Navbar={Navbar} cols={7} rows={10} />;
  }

  const b2b = report?.b2b || [];
  const b2c = report?.b2c || [];
  const summary = report?.summary || { totalInvoices: 0, totalTaxableValue: 0, totalTax: 0 };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-10 animate-fade-in">
            <div>
              <h1 className="text-5xl font-bold gradient-text mb-2">GSTR-1 (Sales)</h1>
              <p className="text-gray-600 text-lg">Monthly outward supplies summary</p>
            </div>
            <div className="flex gap-4 bg-white rounded-2xl shadow-lg px-6 py-4 border border-blue-100">
              <div>
                <p className="text-sm text-gray-500">Period</p>
                <p className="text-lg font-semibold text-gray-800">{monthNames[filters.month - 1]} {filters.year}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border-t-4 border-cyan-400 p-6 mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Month</label>
              <select
                value={filters.month}
                onChange={(e) => handleFilterChange('month', Number(e.target.value))}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
              >
                {monthNames.map((name, idx) => (
                  <option key={name} value={idx + 1}>{name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Year</label>
              <input
                type="number"
                value={filters.year}
                onChange={(e) => handleFilterChange('year', Number(e.target.value))}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
                min="2017"
                max="2099"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchReport}
                className="w-full btn-gradient text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-2xl transition"
              >
                Refresh Report
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-blue-500">
              <p className="text-sm text-gray-500">Total Invoices</p>
              <p className="text-4xl font-bold text-gray-800 mt-2">{summary.totalInvoices}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-emerald-500">
              <p className="text-sm text-gray-500">Taxable Value</p>
              <p className="text-4xl font-bold text-gray-800 mt-2">{formatCurrency(summary.totalTaxableValue)}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6 border-l-4 border-rose-500">
              <p className="text-sm text-gray-500">Total Tax</p>
              <p className="text-4xl font-bold text-gray-800 mt-2">{formatCurrency(summary.totalTax)}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 mb-10">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">B2B Invoices</h2>
                <p className="text-sm text-gray-500">Registered customers with GSTIN</p>
              </div>
              <span className="text-sm text-gray-500">{b2b.length} records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Invoice No.</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">GSTIN</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold uppercase tracking-wide">Taxable Value</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold uppercase tracking-wide">Tax</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {b2b.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No B2B invoices for this period.</td>
                    </tr>
                  )}
                  {b2b.map((entry) => (
                    <tr key={entry._id} className="hover:bg-luxury-bg">
                      <td className="px-6 py-4">{new Date(entry.date).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4">{entry.invoiceNumber || entry.voucher?.voucherNumber || '—'}</td>
                      <td className="px-6 py-4">{entry.party?.name || '—'}</td>
                      <td className="px-6 py-4">{entry.party?.contactDetails?.gstin || entry.gstin || '—'}</td>
                      <td className="px-6 py-4 text-right">{formatCurrency(entry.taxableAmount)}</td>
                      <td className="px-6 py-4 text-right font-semibold">{formatCurrency(entry.totalTax)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">B2C Invoices</h2>
                <p className="text-sm text-gray-500">Unregistered / retail customers</p>
              </div>
              <span className="text-sm text-gray-500">{b2c.length} records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Invoice No.</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Customer</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Place of Supply</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold uppercase tracking-wide">Taxable Value</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold uppercase tracking-wide">Tax</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {b2c.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No B2C invoices for this period.</td>
                    </tr>
                  )}
                  {b2c.map((entry) => (
                    <tr key={entry._id} className="hover:bg-luxury-bg">
                      <td className="px-6 py-4">{new Date(entry.date).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4">{entry.invoiceNumber || entry.voucher?.voucherNumber || '—'}</td>
                      <td className="px-6 py-4">{entry.party?.name || 'Retail Customer'}</td>
                      <td className="px-6 py-4">{entry.placeOfSupply || '—'}</td>
                      <td className="px-6 py-4 text-right">{formatCurrency(entry.taxableAmount)}</td>
                      <td className="px-6 py-4 text-right font-semibold">{formatCurrency(entry.totalTax)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GSTR1;
