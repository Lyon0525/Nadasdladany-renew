import { AdminLayout } from '../../layouts/AdminLayout';
import { motion } from 'framer-motion';
import { Newspaper, Calendar, Image as ImageIcon, FileText, ChevronRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { articleService } from '../../api/articleService';
import { eventService } from '../../api/eventService';
import { galleryService } from '../../api/galleryService';
import apiClient from '../../api/apiClient';

export const DashboardPage = () => {
    const { data: counts, isLoading } = useQuery({
        queryKey: ['dashboardStats'],
        queryFn: async () => {
            const [articles, events, albums, docs] = await Promise.all([
                articleService.getArticles(1, 1).catch(() => ({ totalCount: 0 })),
                eventService.getEvents().catch(() => []),
                galleryService.getAlbums().catch(() => []),
                apiClient.get('/documents', { params: { pageNumber: 1, pageSize: 1 } }).catch(() => ({ data: { totalCount: 0 } }))
            ]);

            return {
                news: (articles as any).totalCount || 0,
                events: Array.isArray(events) ? events.length : ((events as any)?.items?.length || 0),
                gallery: Array.isArray(albums) ? albums.length : 0,
                documents: (docs as any).data?.totalCount || 0
            };
        }
    });

    const stats = [
        { name: 'Hírek', count: counts?.news || 0, icon: <Newspaper />, path: '/admin/news', color: 'bg-blue-500' },
        { name: 'Események', count: counts?.events || 0, icon: <Calendar />, path: '/admin/events', color: 'bg-purple-500' },
        { name: 'Galéria (Albumok)', count: counts?.gallery || 0, icon: <ImageIcon />, path: '/admin/gallery', color: 'bg-amber-500' },
        { name: 'Dokumentumok', count: counts?.documents || 0, icon: <FileText />, path: '/admin/documents', color: 'bg-emerald-500' },
    ];

    return (
        <AdminLayout>
            <div className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-primary">Üdvözöljük az Adminisztrációs felületen!</h1>
                <p className="text-gray-400 mt-2">Válasszon az alábbi modulok közül a tartalom kezeléséhez.</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-accent" size={32} />
                </div>
            ) : (
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
            )}
        </AdminLayout>
    );
};