import { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import authService from '../features/auth/services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [socket, setSocket] = useState(null);

    // Check if user is logged in
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const userRes = await authService.getCurrentUser();
                if (userRes.data.user) {
                    setUser(userRes.data.user);
                }
                setLoading(false);
            } catch (_error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, [socket]); 

    // Initialize socket/connection on mount (Public access)
    useEffect(() => {
        const newSocket = io('http://localhost:8080', {
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000
        });


        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    // Handle Socket Authentication when User changes
    useEffect(() => {
        if (socket && user?._id) {
            socket.emit('authenticate', user._id);
        }
    }, [socket, user?._id]);

    const login = async (username, password) => {
        const response = await authService.login({ username, password });
        setUser(response.data.user);
        return response.data;
    };

    const signup = async (userData) => {
        const response = await authService.signup(userData);
        setUser(response.data.user);
        return response.data;
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, signup, logout, loading, socket }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

