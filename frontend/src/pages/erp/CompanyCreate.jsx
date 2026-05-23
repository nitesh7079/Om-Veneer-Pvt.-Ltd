import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Navbar from '../../components/ERPNavbar';

const InputField = ({ label, type = "text", name, value, onChange, required, placeholder, maxLength, hint }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-rose-500">*</span>}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full px-4 py-3 bg-luxury-bg border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
    />
    {hint && <p className="text-xs text-gray-500 mt-1.5 ml-1">{hint}</p>}
  </div>
);

const CompanyCreate = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    address: { street: '', city: '', state: '', country: 'India', pincode: '' },
    gstin: '',
    pan: '',
    email: '',
    phone: '',
    currency: 'INR',
    financialYear: { startDate: '', endDate: '' },
    booksBeginningFrom: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/companies', formData);
      navigate('/companies');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create company');
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-luxury-bg">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-2xl max-w-xl text-center shadow-sm">
            <h3 className="text-xl font-bold mb-2">Access Denied</h3>
            <p>You do not have permission to create companies. Only administrators can perform this action.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/50 pb-20">
      <Navbar />
      
      <div className="container mx-auto px-4 sm:px-6 py-10 max-w-5xl animate-fade-in-up">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold font-heading text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-600 mb-3 tracking-tight">
            Create New Company
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl">
            Set up a completely independent workspace with its own ledger, inventory, and accounting records.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 border-l-4 border-rose-500 text-rose-700 px-6 py-4 rounded-xl shadow-sm mb-8 flex items-start gap-4">
            <svg className="w-6 h-6 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <span className="font-medium text-[15px]">{error}</span>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/60 overflow-hidden">
          <form onSubmit={handleSubmit}>
            <div className="p-8 sm:p-12 space-y-12">
              
              {/* Section 1: Basic Information */}
              <section className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Basic Details</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <InputField label="Company Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Om Veneer Pvt. Ltd." />
                  <InputField label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="contact@company.com" />
                  <InputField label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 xxxxx xxxxx" />
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Base Currency</label>
                    <div className="relative">
                      <select
                        name="currency"
                        value={formData.currency}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-luxury-bg border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none font-medium text-gray-700"
                      >
                        <option value="INR">🇮🇳 INR (₹)</option>
                        <option value="USD">🇺🇸 USD ($)</option>
                        <option value="EUR">🇪🇺 EUR (€)</option>
                        <option value="GBP">🇬🇧 GBP (£)</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 2: Address */}
              <section className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Physical Address</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="md:col-span-2">
                    <InputField label="Street Address" name="address.street" value={formData.address.street} onChange={handleChange} placeholder="123 Industrial Area, Phase 1" />
                  </div>
                  <InputField label="City" name="address.city" value={formData.address.city} onChange={handleChange} placeholder="Mumbai" />
                  <InputField label="State / Province" name="address.state" value={formData.address.state} onChange={handleChange} placeholder="Maharashtra" />
                  <InputField label="Country" name="address.country" value={formData.address.country} onChange={handleChange} placeholder="India" />
                  <InputField label="PIN / ZIP Code" name="address.pincode" value={formData.address.pincode} onChange={handleChange} placeholder="400001" />
                </div>
              </section>

              <hr className="border-gray-100" />

              {/* Section 3: Tax & Financial */}
              <section className="relative">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8a1 1 0 11-2 0 1 1 0 012 0zm5 5a1 1 0 11-2 0 1 1 0 012 0z"/></svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Tax & Reporting Setup</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                  <InputField label="GSTIN" name="gstin" value={formData.gstin} onChange={handleChange} placeholder="22AAAAA0000A1Z5" maxLength="15" hint="Format: 15 characters (e.g., 22AAAAA0000A1Z5)" />
                  <InputField label="PAN Number" name="pan" value={formData.pan} onChange={handleChange} placeholder="AAAAA0000A" maxLength="10" hint="Format: 10 characters (e.g., AAAAA0000A)" />
                </div>
                
                <div className="bg-luxury-bg rounded-2xl p-6 border border-gray-100/80">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">Financial Period</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <InputField label="Fin. Year Start" type="date" name="financialYear.startDate" value={formData.financialYear.startDate} onChange={handleChange} required />
                    <InputField label="Fin. Year End" type="date" name="financialYear.endDate" value={formData.financialYear.endDate} onChange={handleChange} required />
                    <InputField label="Books Began From" type="date" name="booksBeginningFrom" value={formData.booksBeginningFrom} onChange={handleChange} required />
                  </div>
                </div>
              </section>

            </div>

            {/* Actions Footer */}
            <div className="bg-luxury-bg/50 border-t border-gray-100 px-8 py-6 flex flex-col sm:flex-row-reverse items-center gap-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transform transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex justify-center items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Workspace...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    Create Company Profile
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => navigate('/companies')}
                className="w-full sm:w-auto px-6 py-3.5 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 hover:bg-luxury-bg hover:border-gray-300 transition-all duration-200"
              >
                Cancel Process
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyCreate;
