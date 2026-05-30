const COMPANY_TOKEN_KEY = "companyToken";

export const getCompanyToken = () => localStorage.getItem(COMPANY_TOKEN_KEY);

export const companyAuthHeaders = () => ({
  Authorization: `Bearer ${getCompanyToken()}`,
});

export const saveCompanySession = (data) => {
  const token = data?.token || data?.companyToken || data?.accessToken;
  const company = data?.company || data?.data?.company || data?.user || null;

  if (token) {
    localStorage.setItem(COMPANY_TOKEN_KEY, token);
  }

  if (company) {
    localStorage.setItem("companyProfile", JSON.stringify(company));
  }

  return token;
};

export const removeCompanySession = () => {
  localStorage.removeItem(COMPANY_TOKEN_KEY);
  localStorage.removeItem("companyProfile");
};
