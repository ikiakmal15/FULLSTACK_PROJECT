import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Mengarah ke port endpoint backend kelompok BERES
});

api.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;