/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        try {
            return storedUser ? JSON.parse(storedUser) : null;
        } catch {
            return null;
        }
    });
    const [loading] = useState(false);

    const login = async (email, password) => {
        try {
            const response = await fetch('https://alterra-node.onrender.com/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    password
                }),
            });
            const data = await response.json();

            if (response.ok) {
                setToken(data.token);
                setUser(data.data.user);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Login failed' };
            }
        } catch {
            return { success: false, message: 'Server error' };
        }
    };

    const signup = async (name, email, password, role = 'user') => {
        try {
            const response = await fetch('https://alterra-node.onrender.com/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    password,
                    role
                }),
            });
            const data = await response.json();

            if (response.ok) {
                setToken(data.token);
                setUser(data.data.user);
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                return { success: true };
            } else {
                return { success: false, message: data.message || 'Signup failed' };
            }
        } catch {
            return { success: false, message: 'Server error' };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };

    const value = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAdmin: user?.role === 'admin'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
