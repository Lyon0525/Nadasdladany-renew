import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowLeft, User, Share2, Loader2 } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import apiClient from '../api/apiClient';
import type { Article } from '../types/Article';
import { Seo } from '../components/common/Seo';

export const NewsDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            // Lekérjük a híreket (mivel a backend PaginatedList-et ad vissza, a .items-ben van a tömb)
            apiClient.get('/articles?pageNumber=1&pageSize=100')
                .then(res => {
                    const items = res.data?.items || [];
                    const foundArticle = items.find((a: Article) => a.slug === slug);
                    setArticle(foundArticle || null);
                })
                .catch(err => console.error("Hiba a hír betöltésekor:", err))
                .finally(() => setLoading(false));
        }
    }, [slug]);

    if (loading) return <div className="h-screen flex items-center justify-center font-serif italic text-accent text-2xl gap-3"><Loader2 className="animate-spin" /> Bejegyzés betöltése...</div>;
    if (!article) return <div className="h-screen flex items-center justify-center font-serif text-2xl">A hír nem található.</div>;

    return (
        <MainLayout>
            <Seo title={article.title} description={article.excerpt} image={article.featuredImageUrl} />
            <article className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-primary/50 hover:text-accent transition-colors mb-12 group uppercase text-xs font-bold tracking-widest cursor-pointer"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Vissza a listához
                </button>

                <header className="mb-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-6">
                        <span className="px-4 py-1 bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest rounded-full">
                            {article.categoryName || "Közösségi hírek"}
                        </span>
                        <div className="h-px flex-grow bg-gray-100" />
                    </motion.div>

                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-6xl font-serif font-bold text-primary mb-8 leading-tight">
                        {article.title}
                    </motion.h1>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex flex-wrap gap-6 text-sm text-gray-400 border-y border-gray-100 py-6">
                        <span className="flex items-center gap-2">
                            <Calendar size={16} className="text-accent" />
                            {article.publishedDate ? new Date(article.publishedDate).toLocaleDateString('hu-HU') : "Friss hír"}
                        </span>
                        <span className="flex items-center gap-2"><User size={16} className="text-accent" /> Önkormányzat</span>
                        <span className="flex items-center gap-2 ml-auto cursor-pointer hover:text-accent transition-colors"><Share2 size={16} /> Megosztás</span>
                    </motion.div>
                </header>

                {article.featuredImageUrl && (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative h-[500px] rounded-[40px] overflow-hidden mb-16 shadow-2xl">
                        <img src={article.featuredImageUrl} alt={article.title} className="w-full h-full object-cover" />
                    </motion.div>
                )}

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="prose prose-lg prose-slate max-w-none prose-headings:font-serif prose-headings:text-primary prose-p:leading-relaxed prose-img:rounded-3xl shadow-sm bg-white p-8 md:p-16 rounded-[40px] border border-gray-50">
                    <div dangerouslySetInnerHTML={{ __html: article.content }} className="content-area" />
                </motion.div>
            </article>
        </MainLayout>
    );
};