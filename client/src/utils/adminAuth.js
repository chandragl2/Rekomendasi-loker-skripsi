const ADMIN_TOKEN_KEY = "adminToken";

const isLikelyJwt = (token) => (
  typeof token === "string" && token.split(".").length === 3
);

export const getAdminToken = () => {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY) || sessionStorage.getItem(ADMIN_TOKEN_KEY);

  if (!token) {
    return null;
  }

  if (!isLikelyJwt(token)) {
    removeAdminSession();
    return null;
  }

  return token;
};

export const adminAuthHeaders = () => ({
  Authorization: `Bearer ${getAdminToken()}`,
});

export const saveAdminSession = (data) => {
  const token = data?.token || data?.adminToken || data?.accessToken;

  if (isLikelyJwt(token)) {
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    return token;
  }

  return null;
};

export const removeAdminSession = () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  sessionStorage.removeItem(ADMIN_TOKEN_KEY);
};
