const API_BASE_URL = "http://localhost:5001/api";

type RequestOptions = {
  method?: string;
  body?: Record<string, unknown> | unknown[];
  token?: string | null;
};

export const apiRequest = async (endpoint: string, options: RequestOptions = {}) => {
  const { method = "GET", body, token } = options;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const config: RequestInit = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Something went wrong");
  return data;
};

export const authAPI = {
  login: (email: string, password: string) => apiRequest("/auth/login", { method: "POST", body: { email, password } }),
  getMe: (token: string) => apiRequest("/auth/me", { token }),
};

export const sessionAPI = {
  planDay: (token: string, goals: { goal: string; duration: number }[]) => 
    apiRequest("/sessions/plan", { method: "POST", body: { goals }, token }),
  
  breakdown: (token: string, sessionId: string, subtasks: string[]) => 
    apiRequest(`/sessions/${sessionId}/breakdown`, { method: "PUT", body: { subtasks }, token }),
  
  start: (token: string, sessionId: string) => 
    apiRequest(`/sessions/${sessionId}/start`, { method: "POST", token }),
    
  complete: (token: string, sessionId: string) => 
    apiRequest(`/sessions/${sessionId}/complete`, { method: "POST", token }),
    
  reflect: (token: string, sessionId: string, reflection: string) => 
    apiRequest(`/sessions/${sessionId}/reflect`, { method: "POST", body: { reflection }, token }),
    
  getDashboard: (token: string) => 
    apiRequest("/sessions/dashboard", { token }),
};
