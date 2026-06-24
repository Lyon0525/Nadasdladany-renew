import { type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Newspaper, FileText, Image as ImageIcon, LogOut, ChevronLeft, Award, Building2, Users, Briefcase, Mail, ShieldAlert, UserCheck, Map, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const AdminLayout = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
        { name: 'Irányítópult', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Hírek kezelése', path: '/admin/news', icon: <Newspaper size={20} /> },
        { name: 'Események', path: '/admin/events', icon: <Calendar size={20} /> },
        { name: 'Pályázatok', path: '/admin/projects', icon: <Award size={20} /> },
        { name: 'Intézmények', path: '/admin/institutions', icon: <Building2 size={20} /> },
        { name: 'Polgármesteri köszöntő', path: '/admin/welcome', icon: <UserCheck size={20} /> },
        { name: 'Térképszerkesztő', path: '/admin/map', icon: <Map size={20} /> },
        { name: 'Képviselők & Hivatal', path: '/admin/representatives', icon: <UserCheck size={20} /> },
        { name: 'Civil & Egyházak', path: '/admin/organizations', icon: <Users size={20} /> },
        { name: 'Álláshirdetések', path: '/admin/careers', icon: <Briefcase size={20} /> },
        { name: 'Dokumentumok', path: '/admin/documents', icon: <FileText size={20} /> },
        { name: 'Galéria', path: '/admin/gallery', icon: <ImageIcon size={20} /> },
        { name: 'Hírlevél küldés', path: '/admin/newsletter', icon: <Mail size={20} /> },
        { name: 'Adatigénylések', path: '/admin/data-requests', icon: <ShieldAlert size={20} /> },
        { name: 'Felhasználók', path: '/admin/users', icon: <Users size={20} /> },
        { name: 'Beérkező üzenetek', path: '/admin/messages', icon: <Mail size={20} /> },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <aside className="w-72 bg-primary text-white p-8 flex flex-col flex-shrink-0 border-r border-gray-100/10">
                <Link to="/" className="flex items-center gap-2 mb-12 text-accent text-sm font-bold uppercase tracking-widest hover:text-white transition-colors">
                    <ChevronLeft size={16} /> Weboldalra
                </Link>

                <div className="mb-10">
                    <p className="text-xs text-accent font-bold uppercase tracking-widest mb-2">Adminisztrátor</p>
                    <p className="text-sm font-medium truncate">{user?.email}</p>
                </div>

                <nav className="flex-grow space-y-1.5 overflow-y-auto pr-1 select-none">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-150 font-medium text-sm
                                ${isActive
                                    ? 'bg-white/15 text-white shadow-sm font-semibold'
                                    : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                }
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={isActive ? 'text-accent scale-105 transition-transform' : 'text-gray-400'}>
                                        {item.icon}
                                    </span>
                                    {item.name}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <button
                    onClick={handleLogout}
                    className="mt-6 flex items-center gap-4 px-4 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-colors cursor-pointer text-sm font-medium"
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