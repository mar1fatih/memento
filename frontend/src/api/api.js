import axios from 'axios';

const API = axios.create({
  baseURL: 'https://memento-production-41f4.up.railway.app/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;