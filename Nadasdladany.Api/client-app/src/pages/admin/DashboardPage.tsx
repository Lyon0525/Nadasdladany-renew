import { AdminLayout } from '../../layouts/AdminLayout';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, Image as ImageIcon, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
    const stats = [
        { name: 'Hírek', count: '12', icon: <Newspaper />, path: '/admin/news', color: 'bg-blue-500' },
        { name: 'Események', count: '5', icon: <Calendar />, path: '/admin/events', color: 'bg-purple-500' },
        { name: 'Galéria', count: '8', icon: <ImageIcon />, path: '/admin/gallery', color: 'bg-amber-500' },
        { name: 'Dokumentumok', count: '24', icon: <FileText />, path: '/admin/documents', color: 'bg-emerald-500' },
    ];

    return (
        <AdminLayout>
            <div className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-primary">Üdvözöljük az Adminisztrációs felületen!</h1>
                <p className="text-gray-400 mt-2">Válasszon az alábbi modulok közül a tartalom kezeléséhez.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <Link to={stat.path} className="block group">
                            <div className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300">
                                <div className={`w-12 h-12 ${stat.color} text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                    {stat.icon}
                                </div>
                                <h3 className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">{stat.name}</h3>
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl font-bold text-primary">{stat.count}</span>
                                    <ChevronRight className="text-gray-200 group-hover:text-accent transition-colors" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </AdminLayout>
    );
};