const API_BASE = '/api';

function getAuthHeaders() {
  const token = localStorage.getItem('somna_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = getAuthHeaders();

  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  try {
    const res = await fetch(url, config);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `HTTP error! Status: ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err.message);
    throw err;
  }
}

export const authAPI = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (name, email, password, sleepProfile) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, sleepProfile }),
    }),
  demoLogin: () =>
    request('/auth/demo', {
      method: 'POST',
    }),
  getMe: () => request('/auth/me'),
  updateProfile: (profileData) =>
    request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
};

export const sleepAPI = {
  getLogs: (page = 1, limit = 20) =>
    request(`/sleep?page=${page}&limit=${limit}`),
  getStats: () => request('/sleep/stats'),
  logSleep: (sleepData) =>
    request('/sleep', {
      method: 'POST',
      body: JSON.stringify(sleepData),
    }),
  deleteLog: (id) =>
    request(`/sleep/${id}`, {
      method: 'DELETE',
    }),
};

export const chatAPI = {
  sendMessage: (message, conversationId) =>
    request('/chat/message', {
      method: 'POST',
      body: JSON.stringify({ message, conversationId }),
    }),
  getConversations: () => request('/chat/conversations'),
  getConversation: (id) => request(`/chat/conversations/${id}`),
  deleteConversation: (id) =>
    request(`/chat/conversations/${id}`, {
      method: 'DELETE',
    }),
};

export const analyticsAPI = {
  getTrends: (days = 7) => request(`/analytics/trends?days=${days}`),
  getAudit: () => request('/analytics/audit'),
  calcSleepCycles: (data) =>
    request('/analytics/sleep-cycle', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

