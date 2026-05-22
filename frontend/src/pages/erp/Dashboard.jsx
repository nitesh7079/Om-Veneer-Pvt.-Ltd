import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import api, { cachedGet } from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { useCompany } from '../../context/CompanyContext';
import Navbar from '../../components/ERPNavbar';
import { SkeletonCard } from '../../components/TableSkeleton';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useAuth();
  const { selectedCompanyId } = useCompany();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId;
    if (selectedCompanyId) {
      fetchDashboardData(selectedCompanyId);
      intervalId = setInterval(() => fetchDashboardData(selectedCompanyId, true), 30 * 1000);
    } else {
      setLoading(false);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [selectedCompanyId]);

  const fetchDashboardData = async (companyIdOverride, silently = false) => {
    try {
      const companyId = companyIdOverride || selectedCompanyId;
      if (!companyId) return;

      if (!silently) setLoading(true);

      const response = await cachedGet(`/reports/dashboard?company=${companyId}`, 30 * 1000);
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      if (!silently) setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
        <Navbar />
        <div className="container mx-auto px-6 py-8">
          <div className="mb-10">
            <div style={{ height: '48px', width: '300px', borderRadius: '12px', background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.4s infinite', marginBottom: '1rem' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
            {[1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2"><SkeletonCard /></div>
            <div><SkeletonCard /></div>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            No company selected. Please select a company to view the dashboard.
          </div>
        </div>
      </div>
    );
  }

  const { summary, charts } = dashboardData;

  const salesChartData = {
    labels: charts.monthlySales.map(m => m.month),
    datasets: [
      {
        label: 'Monthly Sales',
        data: charts.monthlySales.map(m => m.sales),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4
      }
    ]
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-10 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-3">
                <span className="gradient-text">Business Dashboard</span>
              </h1>
              <p className="text-gray-600 text-lg flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="font-semibold">{dashboardData.company}</span>
              </p>
            </div>
            <div className="bg-white px-6 py-3 rounded-xl shadow-lg border-2 border-blue-100">
              <p className="text-sm text-gray-500 font-semibold">Today's Date</p>
              <p className="text-lg font-bold text-gray-800">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-xl card-hover border-l-4 border-green-500 animate-fade-in card-accent">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 text-xs uppercase font-bold tracking-wider">Total Sales</h3>
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-3 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-1">₹{summary.totalSales}</p>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Revenue Generated</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl card-hover border-l-4 border-red-500 animate-fade-in card-accent" style={{animationDelay: '0.1s'}}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 text-xs uppercase font-bold tracking-wider">Total Purchase</h3>
              <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-red-600 mb-1">₹{summary.totalPurchase}</p>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Expenses Incurred</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl card-hover border-l-4 border-blue-500 animate-fade-in card-accent" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 text-xs uppercase font-bold tracking-wider">Cash Balance</h3>
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-3 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-blue-600 mb-1">₹{summary.cashBalance}</p>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Available Cash</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl card-hover border-l-4 border-cyan-500 animate-fade-in card-accent" style={{animationDelay: '0.3s'}}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 text-xs uppercase font-bold tracking-wider">Bank Balance</h3>
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-3 rounded-xl shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-cyan-600 mb-1">₹{summary.bankBalance}</p>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Bank Deposits</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-xl card-hover border-l-4 border-yellow-500 animate-fade-in card-accent" style={{animationDelay: '0.4s'}}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-600 text-xs uppercase font-bold tracking-wider">Net Profit</h3>
              <div className={`${parseFloat(summary.profit) >= 0 ? 'bg-gradient-to-br from-yellow-500 to-orange-600' : 'bg-gradient-to-br from-red-500 to-red-600'} p-3 rounded-xl shadow-lg`}>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className={`text-3xl font-bold mb-1 ${parseFloat(summary.profit) >= 0 ? 'text-yellow-600' : 'text-red-600'}`}>
              ₹{summary.profit}
            </p>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
              {summary.profitPercentage}% Margin
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-xl card-hover animate-slide-in border-t-4 border-blue-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <svg className="w-7 h-7 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                Monthly Sales Trend
              </h3>
              <span className="badge-professional bg-blue-100 text-blue-800">Analytics</span>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-xl">
              <Line data={salesChartData} options={{ responsive: true, maintainAspectRatio: true, plugins: { legend: { display: true, position: 'bottom' } } }} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl card-hover animate-slide-in border-t-4 border-cyan-500" style={{animationDelay: '0.2s'}}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-800 flex items-center">
                <svg className="w-7 h-7 mr-3 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Quick Actions
              </h3>
            </div>
            <div className="space-y-4">
              <a href="/vouchers/create" className="group block px-5 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white bg-opacity-30 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="font-bold text-white">Create Voucher</span>
                  </div>
                  <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
              <a href="/ledgers/create" className="group block px-5 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white bg-opacity-30 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="font-bold text-white">Create Ledger</span>
                  </div>
                  <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
              <a href="/inventory/create" className="group block px-5 py-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white bg-opacity-30 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="font-bold text-white">Add Inventory</span>
                  </div>
                  <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
              <a href="/reports/trial-balance" className="group block px-5 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-white bg-opacity-30 p-2 rounded-lg">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="font-bold text-white">Trial Balance</span>
                  </div>
                  <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
