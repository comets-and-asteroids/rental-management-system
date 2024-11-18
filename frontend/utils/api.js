import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000', // Ваш API Gateway
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Извлекаем токен из localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // Добавляем токен в заголовок
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
