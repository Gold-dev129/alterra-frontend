import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Ideally should verify token with backend here
            // For now, we'll assume valid if present and just store it
            const storedUser = localStorage.getItem('user');
            if (storedUser) setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, [token]);

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
        } catch (error) {
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
        } catch (error) {
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
        isAdmin: user?.email === 'goldadeleye645@gmail.com'
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
