const ADMIN_TOKEN_KEY = "adminToken";

export const getAdminToken = () => (
  localStorage.getItem(ADMIN_TOKEN_KEY) || sessionStorage.getItem(ADMIN_TOKEN_KEY)
);

export const adminAuthHeaders = () => ({
  Authorization: `Bearer ${getAdminToken()}`,
});

export const saveAdminSession = (data) => {
  const token = data?.token || data?.adminToken || data?.accessToken;

  if (token) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  }

  return token;
};

export const removeAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
};
