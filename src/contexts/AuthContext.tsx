import React, {createContext, ReactNode, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {login as apiLogin, register as apiRegister} from '../api/auth.api';
import {isTokenExpired} from "../utils/isTokenExpired.ts";
import {isAdminToken} from "../utils/isAdminToken.ts";

interface AuthContextType {
    token: string | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, username: string, firstName: string, lastName: string) => Promise<void>;
    logout: () => void;
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({children}) => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [isLoading, setIsLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const initAuth = async () => {
            const storedToken = localStorage.getItem('token');

            if (storedToken) {
                if (isTokenExpired(storedToken)) {
                    localStorage.removeItem('token');
                    setToken(null);
                } else {
                    setToken(storedToken);
                }

                if (isAdminToken(storedToken)) {
                    setIsAdmin(true);
                } else {
                    setIsAdmin(false);
                }
            }

            setIsLoading(false);
        };

        initAuth();
    }, [token]);

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
        setIsAdmin(false);
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <AuthContext
            value={{
                token,
                isAuthenticated: !!token,
                isAdmin: isAdmin,
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
