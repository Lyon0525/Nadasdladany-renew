import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const ProtectedRoute = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout, extendSession, isLoading } = useAuth();
    const [showWarning, setShowWarning] = useState(false);
    const [extending, setExtending] = useState(false);

    useEffect(() => {
        if (!user) return;

        const checkSession = () => {
            const token = sessionStorage.getItem('admin_token');
            if (!token) {
                logout();
                navigate('/admin/login', { replace: true });
                return;
            }

            try {
                const base64Url = token.split('.')[1];
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                const payload = JSON.parse(jsonPayload);
                const expTime = payload.exp * 1000;
                const timeRemaining = expTime - Date.now();
                const CLOCK_SKEW = 60 * 1000;

                if (timeRemaining <= -CLOCK_SKEW) {
                    logout();
                    toast.error("A munkamenet lejárt! Kérjük, jelentkezzen be újra.");
                    navigate('/admin/login', { replace: true });
                } else if (timeRemaining <= 5 * 60 * 1000) {
                    setShowWarning(true);
                } else {
                    setShowWarning(false);
                }
            } catch (e) {
                logout();
                navigate('/admin/login', { replace: true });
            }
        };

        checkSession();
        const checkInterval = setInterval(checkSession, 10000);
        return () => clearInterval(checkInterval);
    }, [user, navigate, location.pathname, logout]);

    const handleExtendSession = async () => {
        setExtending(true);
        try {
            await extendSession();
            setShowWarning(false);
            toast.success("Munkamenet sikeresen meghosszabbítva!");
        } catch (error) {
            toast.error("Hiba történt a munkamenet meghosszabbítása során.");
            logout();
            navigate('/admin/login', { replace: true });
        } finally {
            setExtending(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/admin/login', { replace: true });
    };

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-accent" size={32} />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <>
            <Outlet />
            {showWarning && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary/60 backdrop-blur-sm px-4">
                    <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="w-16 h-16 bg-amber-100 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-center text-primary mb-2">A munkamenet hamarosan lejár!</h3>
                        <p className="text-center text-gray-500 mb-8 text-sm">
                            Biztonsági okokból a munkamenete 5 percen belül automatikusan lezárul. Szeretné meghosszabbítani a hozzáférést?
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={handleLogout}
                                className="flex-1 py-3.5 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors text-sm cursor-pointer"
                            >
                                Kijelentkezés
                            </button>
                            <button
                                onClick={handleExtendSession}
                                disabled={extending}
                                className="flex-[2] py-3.5 rounded-2xl font-bold text-primary bg-accent hover:scale-105 transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-50 text-sm cursor-pointer"
                            >
                                {extending && <Loader2 className="animate-spin" size={16} />}
                                Munkamenet folytatása
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};