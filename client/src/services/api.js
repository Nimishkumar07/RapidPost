import axios from 'axios';

let inMemoryToken = null;

export const setAccessToken = (token) => {
    inMemoryToken = token;
};

export const getAccessToken = () => {
    return inMemoryToken;
};

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = getAccessToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                // If it fails on /current_user due to F5 flush, it catches here
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/refresh-token`, {
                    withCredentials: true 
                });
                const { accessToken } = res.data;
                setAccessToken(accessToken);
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (err) {
                setAccessToken(null);
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
