import { type ReactNode } from 'react'; // Fix: 'type' kulcsszó hozzáadva
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Newspaper, FileText, Image as ImageIcon, LogOut, ChevronLeft } from 'lucide-react';
import { authService } from '../api/authService';

export const AdminLayout = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const user = authService.getCurrentUser();

    const handleLogout = () => {
        authService.logout();
        navigate('/');
    };

    const menuItems = [
        { name: 'Irányítópult', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Hírek kezelése', path: '/admin/news', icon: <Newspaper size={20} /> },
        { name: 'Dokumentumok', path: '/admin/documents', icon: <FileText size={20} /> },
        { name: 'Galéria', path: '/admin/gallery', icon: <ImageIcon size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <aside className="w-72 bg-primary text-white p-8 flex flex-col">
                <Link to="/" className="flex items-center gap-2 mb-12 text-accent text-sm font-bold uppercase tracking-widest">
                    <ChevronLeft size={16} /> Weboldalra
                </Link>

                <div className="mb-10">
                    <p className="text-xs text-accent font-bold uppercase tracking-widest mb-2">Adminisztrátor</p>
                    <p className="text-sm font-medium truncate">{user?.email}</p>
                </div>

                <nav className="flex-grow space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.name}
                            to={item.path}
                            className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors"
                        >
                            <span className="text-accent">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-auto flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors"
                >
                    <LogOut size={20} /> Kijelentkezés
                </button>
            </aside>

            <main className="flex-grow p-12 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};