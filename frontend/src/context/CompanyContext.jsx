import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { cachedGet } from '../utils/api';
import { cacheClear } from '../utils/cache';

const CompanyContext = createContext();

export const useCompany = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error('useCompany must be used within CompanyProvider');
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null); // full company object
  const [companiesLoading, setCompaniesLoading] = useState(true);

  // Restore from localStorage on mount
  useEffect(() => {
    const savedId = localStorage.getItem('selectedCompanyId');
    const savedName = localStorage.getItem('selectedCompanyName');
    if (savedId && savedName) {
      setSelectedCompany({ _id: savedId, name: savedName });
    }
  }, []);

  const fetchCompanies = useCallback(async () => {
    try {
      setCompaniesLoading(true);
      const response = await cachedGet('/companies');
      const list = response.data.data || [];
      setCompanies(list);

      // Re-hydate selectedCompany with full object now that we have the list
      const savedId = localStorage.getItem('selectedCompanyId');
      if (savedId) {
        const found = list.find(c => c._id === savedId);
        if (found) {
          setSelectedCompany(found);
        }
      }
    } catch (err) {
      console.error('Failed to fetch companies:', err);
    } finally {
      setCompaniesLoading(false);
    }
  }, []);

  const selectCompany = useCallback((company) => {
    if (!company) {
      localStorage.removeItem('selectedCompanyId');
      localStorage.removeItem('selectedCompanyName');
      setSelectedCompany(null);
      cacheClear();
      return;
    }
    localStorage.setItem('selectedCompanyId', company._id);
    localStorage.setItem('selectedCompanyName', company.name || company.companyName || '');
    setSelectedCompany(company);
    cacheClear(); // bust all caches so new company data loads fresh
    // Notify any legacy listeners
    window.dispatchEvent(new Event('companyChanged'));
  }, []);

  const clearCompany = useCallback(() => {
    localStorage.removeItem('selectedCompanyId');
    localStorage.removeItem('selectedCompanyName');
    setSelectedCompany(null);
  }, []);

  const value = {
    companies,
    selectedCompany,
    selectedCompanyId: selectedCompany?._id || null,
    companiesLoading,
    fetchCompanies,
    selectCompany,
    clearCompany,
    hasCompany: !!selectedCompany,
  };

  return (
    <CompanyContext.Provider value={value}>
      {children}
    </CompanyContext.Provider>
  );
};
