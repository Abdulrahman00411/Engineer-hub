const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('eh_token');

const request = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
    ...options.headers
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
};

// Auth
export const api = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  register: (data) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  getMe: () => request('/auth/me'),

  // Engineers
  getEngineers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/engineers${query ? '?' + query : ''}`);
  },

  getEngineer: (id) => request(`/engineers/${id}`),

  updateProfile: (data) =>
    request('/engineers/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Jobs
  getJobs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/jobs${query ? '?' + query : ''}`);
  },

  getJob: (id) => request(`/jobs/${id}`),

  createJob: (data) =>
    request('/jobs', { method: 'POST', body: JSON.stringify(data) }),

  getMyJobs: () => request('/jobs/client/my-jobs'),

  placeBid: (jobId, data) =>
    request(`/jobs/${jobId}/bid`, { method: 'POST', body: JSON.stringify(data) }),

  getJobBids: (jobId) => request(`/jobs/${jobId}/bids`),

  getMyBids: () => request('/jobs/bids/my-bids'),

  acceptBid: (bidId, status) =>
    request(`/jobs/bid/${bidId}`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Gigs
  getGigs: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/gigs${query ? '?' + query : ''}`);
  },

  getGig: (id) => request(`/gigs/${id}`),

  createGig: (data) =>
    request('/gigs', { method: 'POST', body: JSON.stringify(data) }),

  getMyGigs: () => request('/gigs/engineer/my-gigs'),

  orderGig: (gigId, data) =>
    request(`/gigs/${gigId}/order`, { method: 'POST', body: JSON.stringify(data) }),

  // Messages
  getConversations: () => request('/messages'),

  getConversation: (id) => request(`/messages/${id}`),

  startConversation: (data) =>
    request('/messages', { method: 'POST', body: JSON.stringify(data) }),

  sendMessage: (conversationId, text) =>
    request(`/messages/${conversationId}/message`, { method: 'POST', body: JSON.stringify({ text }) }),

  markRead: (conversationId) =>
    request(`/messages/${conversationId}/read`, { method: 'PUT' }),

  // Orders
  getOrders: () => request('/orders'),

  getOrder: (id) => request(`/orders/${id}`),

  updateOrderStatus: (id, status) =>
    request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),

  // Clients
  getClients: () => request('/clients'),
  getClient: (id) => request(`/clients/${id}`),

  updateClientProfile: (data) =>
    request('/clients/profile', { method: 'PUT', body: JSON.stringify(data) }),

  // Admin
  getAdminStats: () => request('/admin/stats')
};

export default api;