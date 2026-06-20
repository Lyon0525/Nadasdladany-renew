import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('admin_token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            sessionStorage.clear();
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;