import axios from 'axios';

const api = axios.create({
    baseURL: 'https://rapidpost-r4ds.onrender.com', // Backend URL
    withCredentials: true, // Send cookies with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
