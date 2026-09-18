const normalizeUrl = (url) => (url || "").replace(/\/+$/, "");

export const API_BASE_URL = normalizeUrl(process.env.REACT_APP_API_URL || "http://localhost:5001");
export const API_URL = API_BASE_URL.endsWith("/api") ? API_BASE_URL : `${API_BASE_URL}/api`;
