import React, { useCallback, useEffect, useState } from 'react';
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

const emptyBucket = {
  taxableAmount: 0,
  cgst: 0,
  sgst: 0,
  igst: 0,
  totalTax: 0,
  totalAmount: 0
};

const initialSummary = {
  sales: { ...emptyBucket },
  purchase: { ...emptyBucket },
  netTax: 0
};

const GSTSummary = () => {
  const { selectedCompanyId, selectedCompany } = useCompany();
  const [summary, setSummary] = useState(initialSummary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const companyId = selectedCompanyId;

  const fetchSummary = useCallback(async () => {
    if (!companyId) {
      setSummary(initialSummary);
      setError('Select a company to view GST reports.');
      setLoading(false);
      return;
    }

    if (startDate && endDate && startDate > endDate) {
      setError('From Date cannot be later than To Date.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      let url = `/gst/summary?company=${companyId}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;

      const { data } = await api.get(url);
      setSummary({ ...initialSummary, ...data.data });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load GST summary.');
      setSummary(initialSummary);
    } finally {
      setLoading(false);
    }
  }, [companyId, endDate, startDate]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  if (loading) {
    return <TableSkeleton Navbar={Navbar} cols={6} rows={10} />;
  }

  const sales = summary.sales || emptyBucket;
  const purchase = summary.purchase || emptyBucket;

  const statCards = [
    {
      title: 'Sales Output Tax',
      value: formatCurrency(sales.totalTax),
      subtext: `Taxable Value: ${formatCurrency(sales.taxableAmount)}`,
      gradient: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'Purchase Input Tax',
      value: formatCurrency(purchase.totalTax),
      subtext: `Taxable Value: ${formatCurrency(purchase.taxableAmount)}`,
      gradient: 'from-emerald-500 to-teal-500'
    },
    {
      title: summary.netTax >= 0 ? 'Net Tax Payable' : 'Input Credit Available',
      value: formatCurrency(Math.abs(summary.netTax)),
      subtext: summary.netTax >= 0 ? 'Pay this to the department' : 'Carry forward credit',
      gradient: summary.netTax >= 0 ? 'from-rose-500 to-orange-500' : 'from-purple-500 to-pink-500'
    }
  ];

  const taxBreakdown = [
    { label: 'CGST', sales: sales.cgst, purchase: purchase.cgst },
    { label: 'SGST', sales: sales.sgst, purchase: purchase.sgst },
    { label: 'IGST', sales: sales.igst, purchase: purchase.igst }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-10 animate-fade-in">
            <div>
              <h1 className="text-5xl font-bold gradient-text mb-2">GST Summary</h1>
              <p className="text-gray-600 text-lg">Overview of output vs input tax for the selected period</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg px-6 py-4 border border-blue-100">
              <p className="text-sm text-gray-500">Selected Company</p>
              <p className="font-semibold text-gray-800">{selectedCompany?.name || 'No company selected'}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border-t-4 border-cyan-400 p-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">From Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">To Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="text-gray-900 bg-white font-semibold w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchSummary}
                className="w-full btn-gradient text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-2xl transition"
              >
                Refresh Summary
              </button>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => { setStartDate(''); setEndDate(''); }}
                className="w-full bg-luxury-bg text-gray-700 font-semibold py-3 rounded-xl shadow hover:bg-gray-200 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {statCards.map((card) => (
              <div
                key={card.title}
                className={`rounded-2xl p-6 text-white shadow-xl bg-gradient-to-r ${card.gradient} transform hover:-translate-y-1 transition`}
              >
                <p className="text-sm uppercase tracking-wide opacity-80">{card.title}</p>
                <p className="text-4xl font-bold my-2">{card.value}</p>
                <p className="text-sm opacity-80">{card.subtext}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Tax Breakdown</h2>
              <span className="text-sm text-gray-500">Values shown in INR</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wide">Tax Type</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold uppercase tracking-wide">Sales Output</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold uppercase tracking-wide">Purchase Input</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold uppercase tracking-wide">Net Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {taxBreakdown.map((row) => (
                    <tr key={row.label} className="hover:bg-luxury-bg">
                      <td className="px-6 py-4 font-semibold text-gray-700">{row.label}</td>
                      <td className="px-6 py-4 text-right text-gray-800">{formatCurrency(row.sales)}</td>
                      <td className="px-6 py-4 text-right text-gray-800">{formatCurrency(row.purchase)}</td>
                      <td className={`px-6 py-4 text-right font-semibold ${row.sales - row.purchase >= 0 ? 'text-blue-600' : 'text-emerald-600'}`}>
                        {formatCurrency(row.sales - row.purchase)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {[{ title: 'Sales Summary', data: sales }, { title: 'Purchase Summary', data: purchase }].map((section) => (
              <div key={section.title} className="bg-white rounded-2xl shadow-xl border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
                  <p className="text-sm text-gray-500">Taxable value + tax components</p>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Taxable Amount</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(section.data.taxableAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Tax</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(section.data.totalTax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Invoice Value</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(section.data.totalAmount)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default GSTSummary;
