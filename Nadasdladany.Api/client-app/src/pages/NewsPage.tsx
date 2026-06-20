import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { articleService } from '../api/articleService';
import type { Article } from '../types/Article';
import { Seo } from '../components/common/Seo';
import { cn } from '../lib/utils';

export const NewsPage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<string>('Mind');

    useEffect(() => {
        articleService.getArticles()
            .then(data => {
                if (data && data.items) {
                    setArticles(data.items);
                } else if (Array.isArray(data)) {
                    setArticles(data);
                }
            })
            .catch(err => console.error("Hiba a hírek betöltésekor:", err))
            .finally(() => setLoading(false));
    }, []);

    const categories = ['Mind', ...Array.from(new Set(articles.map(a => a.categoryName)))];

    const filteredArticles = activeCategory === 'Mind'
        ? articles
        : articles.filter(a => a.categoryName === activeCategory);

    return (
        <MainLayout>
            <Seo
                title="Hírek & Aktualitások"
                description="Nádasdladány község legfrissebb hírei, önkormányzati hirdetményei és esemény beszámolói."
            />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-4">Hírek & Aktualitások</h1>
                    <p className="text-gray-500 max-w-2xl">Értesüljön első kézből Nádasdladány legfrissebb önkormányzati döntéseiről, fejlesztéseiről és a helyi közösség eseményeiről.</p>
                </div>

                <div className="flex flex-wrap gap-2 mb-12 justify-center md:justify-start">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={cn(
                                "px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer border",
                                activeCategory === category
                                    ? "bg-accent border-accent text-primary shadow-md"
                                    : "bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:text-primary"
                            )}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="animate-spin text-accent" size={36} />
                        <span className="font-serif italic text-gray-400">Hírek betöltése folyamatban...</span>
                    </div>
                ) : filteredArticles.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                        <p className="text-xl font-serif text-gray-400">Jelenleg nincs megjeleníthető hír ebben a kategóriában.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredArticles.map((article, index) => (
                            <motion.article
                                key={article.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white rounded-[32px] overflow-hidden border border-gray-50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
                            >
                                <div className="h-60 overflow-hidden relative bg-gray-100">
                                    <img
                                        src={article.featuredImageUrl || '/Nadasdladany-hero-banner.jpg'}
                                        alt={article.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm">
                                        {article.categoryName}
                                    </span>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-4 font-medium">
                                        <Calendar size={14} className="text-accent" />
                                        {new Date(article.publishedDate).toLocaleDateString('hu-HU')}
                                    </div>

                                    <h2 className="text-xl font-serif font-bold text-primary mb-3 line-clamp-2 group-hover:text-accent transition-colors leading-snug">
                                        {article.title}
                                    </h2>

                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                        {article.excerpt}
                                    </p>

                                    <Link
                                        to={`/hirek/${article.slug}`}
                                        className="mt-auto inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary group-hover:text-accent transition-colors"
                                    >
                                        Elolvasom a cikket
                                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};