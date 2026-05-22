// Helper function to get the currently selected company ID
export const getSelectedCompanyId = (user) => {
  // First check localStorage for selected company
  const selectedCompanyId = localStorage.getItem('selectedCompanyId');
  if (selectedCompanyId) {
    return selectedCompanyId;
  }
  
  // Fall back to user's default company
  return user?.company?._id || '';
};
