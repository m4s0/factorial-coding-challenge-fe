import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {login as apiLogin, register as apiRegister} from '../api/auth.api';

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, username: string, firstName: string, lastName: string) => Promise<void>;
    logout: () => void;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');

            if (storedToken) {
                setToken(storedToken);
            }

            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);

        const response = await apiLogin({email, password});
        setToken(response.accessToken);
        localStorage.setItem('token', response.accessToken);
        setIsLoading(false);
    };

    const register = async (email: string, password: string, username: string, firstName: string, lastName: string) => {
        setIsLoading(true);

        await apiRegister({email, password, username, firstName, lastName});
        setIsLoading(false);
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext
            value={{
                token,
                isAuthenticated: !!token,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext>
    );
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);
