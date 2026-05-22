import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CompanyProvider } from "./context/CompanyContext";
import App from "./App";
import ProductDetailPage from "./ProductDetailPage";
import ScrollToTop from "./components/ScrollToTop";
import PrivateRoute from "./components/PrivateRoute";
import NavigateRegistrar from "./components/NavigateRegistrar";
import CompanyGuard from "./components/CompanyGuard";

// ── Public pages ──
import CompanyPage from "./pages/CompanyPage";
import ProductsPage from "./pages/ProductsPage";
import HistoryPage from "./pages/HistoryPage";
import ContactPage from "./pages/ContactPage";

// ── ERP pages ──
import Login from "./pages/erp/Login";
import Register from "./pages/erp/Register";
import Dashboard from "./pages/erp/Dashboard";
import LedgerList from "./pages/erp/LedgerList";
import LedgerCreate from "./pages/erp/LedgerCreate";
import LedgerView from "./pages/erp/LedgerView";
import LedgerEdit from "./pages/erp/LedgerEdit";
import InventoryList from "./pages/erp/InventoryList";
import InventoryCreate from "./pages/erp/InventoryCreate";
import InventoryView from "./pages/erp/InventoryView";
import InventoryEdit from "./pages/erp/InventoryEdit";
import VoucherList from "./pages/erp/VoucherList";
import VoucherCreate from "./pages/erp/VoucherCreate";
import VoucherView from "./pages/erp/VoucherView";
import VoucherEdit from "./pages/erp/VoucherEdit";
import SalesVoucher from "./pages/erp/SalesVoucher";
import ContraVoucher from "./pages/erp/ContraVoucher";
import PaymentVoucher from "./pages/erp/PaymentVoucher";
import ReceiptVoucher from "./pages/erp/ReceiptVoucher";
import JournalVoucher from "./pages/erp/JournalVoucher";
import PurchaseVoucher from "./pages/erp/PurchaseVoucher";
import Reports from "./pages/erp/Reports";
import TrialBalance from "./pages/erp/TrialBalance";
import CashBook from "./pages/erp/CashBook";
import BankBook from "./pages/erp/BankBook";
import DayBook from "./pages/erp/DayBook";
import StockSummary from "./pages/erp/StockSummary";
import ProfitLoss from "./pages/erp/ProfitLoss";
import BalanceSheet from "./pages/erp/BalanceSheet";
import Receivables from "./pages/erp/Receivables";
import Payables from "./pages/erp/Payables";
import GSTSummary from "./pages/erp/GSTSummary";
import GSTR1 from "./pages/erp/GSTR1";
import GSTR2 from "./pages/erp/GSTR2";
import CompanyList from "./pages/erp/CompanyList";
import CompanyCreate from "./pages/erp/CompanyCreate";
import CompanyView from "./pages/erp/CompanyView";
import CompanyEdit from "./pages/erp/CompanyEdit";

import "./index.css";

// ── Keep-alive ping ──
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'https://backend-ju5k.onrender.com/api';
const pingBackend = () => {
  fetch(`${BACKEND_URL}/health`, { method: 'GET' })
    .then(() => console.log('[Keep-alive] Backend pinged successfully'))
    .catch(() => console.warn('[Keep-alive] Ping failed - server may be starting up'));
};
pingBackend();
setInterval(pingBackend, 60 * 1000);

// Helper: wrap a page component with PrivateRoute + CompanyGuard
const Protected = ({ element }) => (
  <PrivateRoute>
    <CompanyGuard>
      {element}
    </CompanyGuard>
  </PrivateRoute>
);

// Company management pages don't need CompanyGuard (you need to be able to CREATE a company)
const ProtectedNoGuard = ({ element }) => (
  <PrivateRoute>
    {element}
  </PrivateRoute>
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CompanyProvider>
        <BrowserRouter>
          <NavigateRegistrar />
          <ScrollToTop />
          <Routes>
            {/* ── Public routes ── */}
            <Route path="/" element={<App />} />
            <Route path="/company" element={<CompanyPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/product/:name" element={<ProductDetailPage />} />

            {/* ── Auth routes (public) ── */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ── ERP protected routes (need company selected) ── */}
            <Route path="/dashboard" element={<Protected element={<Dashboard />} />} />

            <Route path="/ledgers" element={<Protected element={<LedgerList />} />} />
            <Route path="/ledgers/create" element={<Protected element={<LedgerCreate />} />} />
            <Route path="/ledgers/:id" element={<Protected element={<LedgerView />} />} />
            <Route path="/ledgers/edit/:id" element={<Protected element={<LedgerEdit />} />} />

            <Route path="/inventory" element={<Protected element={<InventoryList />} />} />
            <Route path="/inventory/create" element={<Protected element={<InventoryCreate />} />} />
            <Route path="/inventory/:id" element={<Protected element={<InventoryView />} />} />
            <Route path="/inventory/edit/:id" element={<Protected element={<InventoryEdit />} />} />

            <Route path="/vouchers" element={<Protected element={<VoucherList />} />} />
            <Route path="/vouchers/create" element={<Protected element={<VoucherCreate />} />} />
            <Route path="/vouchers/:id" element={<Protected element={<VoucherView />} />} />
            <Route path="/vouchers/edit/:id" element={<Protected element={<VoucherEdit />} />} />
            <Route path="/vouchers/sales" element={<Protected element={<SalesVoucher />} />} />
            <Route path="/vouchers/purchase" element={<Protected element={<PurchaseVoucher />} />} />
            <Route path="/vouchers/contra" element={<Protected element={<ContraVoucher />} />} />
            <Route path="/vouchers/payment" element={<Protected element={<PaymentVoucher />} />} />
            <Route path="/vouchers/receipt" element={<Protected element={<ReceiptVoucher />} />} />
            <Route path="/vouchers/journal" element={<Protected element={<JournalVoucher />} />} />

            <Route path="/reports" element={<Protected element={<Reports />} />} />
            <Route path="/reports/trial-balance" element={<Protected element={<TrialBalance />} />} />
            <Route path="/reports/cash-book" element={<Protected element={<CashBook />} />} />
            <Route path="/reports/bank-book" element={<Protected element={<BankBook />} />} />
            <Route path="/reports/day-book" element={<Protected element={<DayBook />} />} />
            <Route path="/reports/stock-summary" element={<Protected element={<StockSummary />} />} />
            <Route path="/reports/gst-summary" element={<Protected element={<GSTSummary />} />} />
            <Route path="/reports/gstr1" element={<Protected element={<GSTR1 />} />} />
            <Route path="/reports/gstr2" element={<Protected element={<GSTR2 />} />} />
            <Route path="/reports/profit-loss" element={<Protected element={<ProfitLoss />} />} />
            <Route path="/reports/balance-sheet" element={<Protected element={<BalanceSheet />} />} />
            <Route path="/reports/receivables" element={<Protected element={<Receivables />} />} />
            <Route path="/reports/payables" element={<Protected element={<Payables />} />} />

            {/* ── Company management (NO CompanyGuard — user needs to select/create company here) ── */}
            <Route path="/companies" element={<ProtectedNoGuard element={<CompanyList />} />} />
            <Route path="/companies/create" element={<ProtectedNoGuard element={<CompanyCreate />} />} />
            <Route path="/companies/:id" element={<ProtectedNoGuard element={<CompanyView />} />} />
            <Route path="/companies/edit/:id" element={<ProtectedNoGuard element={<CompanyEdit />} />} />
          </Routes>
        </BrowserRouter>
      </CompanyProvider>
    </AuthProvider>
  </React.StrictMode>
);
