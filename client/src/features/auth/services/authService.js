import api from '@/services/api';

const authService = {
    getCurrentUser: () => api.get('/current_user'),
    login: (credentials) => api.post('/login', credentials),
    signup: (userData) => api.post('/signup', userData),
    verifyOTP: (data) => api.post('/verify-otp', data),
    googleLogin: (credential) => api.post('/google-login', { credential }),
    logout: () => api.get('/logout'),
};

export default authService;
