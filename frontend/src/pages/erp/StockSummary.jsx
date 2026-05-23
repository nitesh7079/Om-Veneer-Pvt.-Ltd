import React, { useState, useEffect } from 'react';
import { useCompany } from '../../context/CompanyContext';
import api from '../../utils/api';
import Navbar from '../../components/ERPNavbar';
import { exportToPDF, exportToExcel } from '../../utils/exportUtils';

const StockSummary = () => {
  const { selectedCompanyId } = useCompany();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStockSummary();
  }, []);

  const fetchStockSummary = async () => {
    try {
      const response = await api.get(`/inventory?company=${selectedCompanyId}`);
      setItems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching stock summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTotalValue = () => {
    return items.reduce((sum, item) => sum + (item.currentStock?.value || 0), 0);
  };

  const getTotalQuantity = () => {
    return items.reduce((sum, item) => sum + (item.currentStock?.quantity || 0), 0);
  };

  const handleExportPDF = () => {
    const tableData = items.map(item => [
      item.code || '-',
      item.name,
      item.unit,
      (item.currentStock?.quantity || 0).toFixed(2),
      item.rate?.toFixed(2),
      (item.currentStock?.value || 0).toFixed(2),
      item.currentStock?.quantity <= item.reorderLevel ? 'Low Stock' : 'In Stock'
    ]);
    tableData.push(['', 'Total', '', '', '', getTotalValue().toFixed(2), '']);
    exportToPDF('Stock Summary', ['Code', 'Name', 'Unit', 'Quantity', 'Rate', 'Value (₹)', 'Status'], tableData, 'stock-summary', user.company.name);
  };

  const handleExportExcel = () => {
    const tableData = items.map(item => [
      item.code || '-',
      item.name,
      item.unit,
      (item.currentStock?.quantity || 0).toFixed(2),
      item.rate?.toFixed(2),
      (item.currentStock?.value || 0).toFixed(2),
      item.currentStock?.quantity <= item.reorderLevel ? 'Low Stock' : 'In Stock'
    ]);
    tableData.push(['', 'Total', '', '', '', getTotalValue().toFixed(2), '']);
    exportToExcel('Stock Summary', ['Code', 'Name', 'Unit', 'Quantity', 'Rate', 'Value (₹)', 'Status'], tableData, 'stock-summary', user.company.name);
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
            <h1 className="text-5xl font-bold gradient-text mb-2">Stock Summary</h1>
            <p className="text-gray-600 text-lg">Current inventory levels and valuation</p>
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

        <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border-t-4 border-purple-500 animate-fade-in">
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-l-4 border-blue-500">
              <div className="text-sm font-bold text-gray-700 mb-1">Total Items</div>
              <div className="text-4xl font-bold gradient-text">{items.length}</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border-l-4 border-green-500">
              <div className="text-sm font-bold text-gray-700 mb-1">Total Quantity</div>
              <div className="text-4xl font-bold text-green-600">{getTotalQuantity().toFixed(2)}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border-l-4 border-purple-500">
              <div className="text-sm font-bold text-gray-700 mb-1">Total Value</div>
              <div className="text-4xl font-bold text-purple-600">₹{getTotalValue().toFixed(2)}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in border-t-4 border-orange-500">
          <table className="w-full professional-table">
            <thead className="bg-gradient-to-r from-orange-600 to-orange-500">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Item Code</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Item Name</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-white uppercase tracking-wider">Unit</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">Quantity</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">Rate</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-white uppercase tracking-wider">Value</th>
                <th className="px-6 py-4 text-center text-xs font-bold text-white uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {items.map((item) => {
                const isLowStock = item.currentStock?.quantity <= item.reorderLevel;
                return (
                  <tr key={item._id} className="hover:bg-luxury-bg">
                    <td className="px-4 py-3">{item.code || '-'}</td>
                    <td className="px-4 py-3 font-semibold">{item.name}</td>
                    <td className="px-4 py-3">{item.unit}</td>
                    <td className="px-4 py-3 text-right">
                      {item.currentStock?.quantity?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-4 py-3 text-right">₹{item.rate?.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-semibold">
                      ₹{item.currentStock?.value?.toFixed(2) || '0.00'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {isLowStock ? (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-semibold">
                          Low Stock
                        </span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
                          In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-orange-100 font-bold">
                <td colSpan="5" className="px-4 py-3 text-right">Total Stock Value:</td>
                <td className="px-4 py-3 text-right">₹{getTotalValue().toFixed(2)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          {items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No inventory items found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StockSummary;
