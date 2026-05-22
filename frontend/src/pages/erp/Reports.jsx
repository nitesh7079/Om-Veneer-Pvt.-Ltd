import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/ERPNavbar';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const reportCategories = [
    {
      title: 'Financial Reports',
      reports: [
        { name: 'Trial Balance', path: '/reports/trial-balance', icon: '⚖️' },
        { name: 'Profit & Loss Account', path: '/reports/profit-loss', icon: '📊' },
        { name: 'Balance Sheet', path: '/reports/balance-sheet', icon: '📋' },
      ]
    },
    {
      title: 'Books',
      reports: [
        { name: 'Cash Book', path: '/reports/cash-book', icon: '💰' },
        { name: 'Bank Book', path: '/reports/bank-book', icon: '🏦' },
        { name: 'Day Book', path: '/reports/day-book', icon: '📖' },
      ]
    },
    {
      title: 'Outstanding Reports',
      reports: [
        { name: 'Receivables', path: '/reports/receivables', icon: '📥' },
        { name: 'Payables', path: '/reports/payables', icon: '📤' },
      ]
    },
    {
      title: 'Inventory Reports',
      reports: [
        { name: 'Stock Summary', path: '/reports/stock-summary', icon: '📦' },
      ]
    },
    {
      title: 'GST Reports',
      reports: [
        { name: 'GST Summary', path: '/reports/gst-summary', icon: '🧾' },
        { name: 'GSTR-1 (Sales)', path: '/reports/gstr1', icon: '📑' },
        { name: 'GSTR-2 (Purchase)', path: '/reports/gstr2', icon: '📄' },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-cyan-50">
      <Navbar />
      <div className="container mx-auto px-6 py-8">
        <div className="mb-10 animate-fade-in">
          <h1 className="text-5xl font-bold gradient-text mb-2">Business Reports</h1>
          <p className="text-gray-600 text-lg">Comprehensive financial and operational insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reportCategories.map((category, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-blue-500 card-hover animate-fade-in"
              style={{animationDelay: `${idx * 0.1}s`}}
            >
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-3 rounded-xl shadow-lg mr-4">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {category.title}
                </h2>
              </div>
              <div className="space-y-3">
                {category.reports.map((report, reportIdx) => (
                  <Link
                    key={reportIdx}
                    to={report.path}
                    className="group flex items-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    <div className="bg-white p-2 rounded-lg mr-3 shadow-sm">
                      <span className="text-2xl">{report.icon}</span>
                    </div>
                    <span className="font-bold text-gray-700 flex-1">{report.name}</span>
                    <svg className="w-5 h-5 text-blue-600 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;
