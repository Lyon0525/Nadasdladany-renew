import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface AdminGuardProps {
    children: React.ReactNode;
}

export const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const INACTIVITY_LIMIT = 30 * 60 * 1000;

    const logoutAdmin = () => {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('user');
        localStorage.removeItem('last_activity');
        toast.error("A munkamenet lejárt! Kérjük, jelentkezzen be újra.");
        navigate('/admin/login');
    };

    useEffect(() => {
        const token = localStorage.getItem('admin_token');

        if (!token) {
            navigate('/admin/login');
            return;
        }

        setIsAuthenticated(true);

        let timeoutId: ReturnType<typeof setTimeout>;

        const resetTimer = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(logoutAdmin, INACTIVITY_LIMIT);
            localStorage.setItem('last_activity', Date.now().toString());
        };

        const lastActivity = localStorage.getItem('last_activity');
        if (lastActivity) {
            const timeElapsed = Date.now() - parseInt(lastActivity, 10);
            if (timeElapsed > INACTIVITY_LIMIT) {
                logoutAdmin();
                return;
            }
        }

        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('click', resetTimer);
        window.addEventListener('keydown', resetTimer);
        window.addEventListener('scroll', resetTimer);

        resetTimer();

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            window.removeEventListener('scroll', resetTimer);
        };
    }, [navigate]);

    if (!isAuthenticated) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <p className="font-serif italic text-gray-400">Ellenőrzés és biztonságos kapcsolat felépítése...</p>
            </div>
        );
    }

    return <>{children}</>;
};