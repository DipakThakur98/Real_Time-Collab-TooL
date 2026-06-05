import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { disconnectSocket } from '../services/socket';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accounts, setAccounts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyToken = async () => {
            const storedUser = sessionStorage.getItem('user');
            const token = sessionStorage.getItem('token');
            
            // Load all active accounts
            try {
                const storedAccounts = JSON.parse(sessionStorage.getItem('accounts') || '{}');
                setAccounts(storedAccounts);
            } catch (e) {
                console.error("Failed to load accounts:", e);
            }

            if (!token) {
                setLoading(false);
                return;
            }
            try {
                // Populate user state immediately from sessionStorage for fast load experience
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
                // Call verify endpoint on server to check if JWT is valid
                const response = await api.get('/auth/verify');
                if (response.data && response.data.user) {
                    const verifiedUser = response.data.user;
                    setUser(verifiedUser);
                    sessionStorage.setItem('user', JSON.stringify(verifiedUser));

                    // Sync inside accounts list too
                    const storedAccounts = JSON.parse(sessionStorage.getItem('accounts') || '{}');
                    if (storedAccounts[verifiedUser.id]) {
                        storedAccounts[verifiedUser.id].user = verifiedUser;
                        sessionStorage.setItem('accounts', JSON.stringify(storedAccounts));
                        setAccounts(storedAccounts);
                    }
                }
            } catch (error) {
                console.error("Token verification failed, logging out:", error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;
        
        // Save current active session
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('user', JSON.stringify(user));
        setUser(user);

        // Add/update in accounts registry
        const storedAccounts = JSON.parse(sessionStorage.getItem('accounts') || '{}');
        storedAccounts[user.id] = { token, user };
        sessionStorage.setItem('accounts', JSON.stringify(storedAccounts));
        setAccounts(storedAccounts);

        return user;
    };

    const register = async (username, fullName, email, password) => {
        await api.post('/auth/register', { username, full_name: fullName, email, password });
    };

    const switchAccount = (userId) => {
        const storedAccounts = JSON.parse(sessionStorage.getItem('accounts') || '{}');
        const target = storedAccounts[userId];
        if (target) {
            disconnectSocket();
            sessionStorage.setItem('token', target.token);
            sessionStorage.setItem('user', JSON.stringify(target.user));
            setUser(target.user);
            window.location.reload();
        }
    };

    const removeAccount = (userId) => {
        const storedAccounts = JSON.parse(sessionStorage.getItem('accounts') || '{}');
        delete storedAccounts[userId];
        sessionStorage.setItem('accounts', JSON.stringify(storedAccounts));
        setAccounts(storedAccounts);

        const activeUser = JSON.parse(sessionStorage.getItem('user') || 'null');
        if (activeUser && activeUser.id === userId) {
            const remainingKeys = Object.keys(storedAccounts);
            if (remainingKeys.length > 0) {
                switchAccount(remainingKeys[0]);
            } else {
                disconnectSocket();
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('accounts');
                setUser(null);
                setAccounts({});
                window.location.reload();
            }
        }
    };

    const logout = () => {
        disconnectSocket();
        const activeUser = JSON.parse(sessionStorage.getItem('user') || 'null');
        const storedAccounts = JSON.parse(sessionStorage.getItem('accounts') || '{}');
        
        if (activeUser && storedAccounts[activeUser.id]) {
            delete storedAccounts[activeUser.id];
            sessionStorage.setItem('accounts', JSON.stringify(storedAccounts));
            setAccounts(storedAccounts);
        }

        const remainingKeys = Object.keys(storedAccounts);
        if (remainingKeys.length > 0) {
            const nextKey = remainingKeys[0];
            const nextAccount = storedAccounts[nextKey];
            sessionStorage.setItem('token', nextAccount.token);
            sessionStorage.setItem('user', JSON.stringify(nextAccount.user));
            setUser(nextAccount.user);
            window.location.reload();
        } else {
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('user');
            sessionStorage.removeItem('accounts');
            setUser(null);
            setAccounts({});
            window.location.reload();
        }
    };

    return (
        <AuthContext.Provider value={{ user, accounts, login, register, logout, switchAccount, removeAccount, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
