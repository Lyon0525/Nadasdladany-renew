import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { authService, type LoginCredentials } from '../api/authService';
import { type LoginResponse } from '../types/Auth';

interface AuthContextType {
    user: LoginResponse | null;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    extendSession: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<LoginResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setIsLoading(false);
    }, []);

    const login = async (credentials: LoginCredentials) => {
        const data = await authService.login(credentials);
        setUser(data);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    const extendSession = async () => {
        const data = await authService.extendSession();
        setUser(data);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, extendSession, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};