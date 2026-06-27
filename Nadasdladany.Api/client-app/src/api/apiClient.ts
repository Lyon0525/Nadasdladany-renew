import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 10000,
    withCredentials: true,
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('user');
            localStorage.removeItem('last_activity');
            window.location.href = '/admin/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;