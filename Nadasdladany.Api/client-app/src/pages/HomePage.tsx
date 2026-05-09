import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { articleService } from '../api/articleService';
import type { Article } from '../types/Article';
import { NewsCard } from '../features/news/components/NewsCard';
import { NewsCardSkeleton } from '../features/news/components/NewsCardSkeleton';
import { VillageMap } from '../features/map/components/VillageMap';
import { getImageUrl } from '../lib/imageUtils';
import { ChevronDown, User } from 'lucide-react';

export const HomePage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        articleService.getArticles()
            .then(data => setArticles(Array.isArray(data) ? data : []))
            .catch(() => setArticles([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <MainLayout>
            {/* HERO BANNER */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <img
                        src="/Nadasdladany-hero-banner.jpg"
                        alt="Nádasdladány"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                    className="relative z-10 text-center px-6"
                >
                    <h1 className="text-6xl md:text-9xl font-serif font-bold text-white mb-6">Nádasdladány</h1>
                    <p className="text-accent text-xl md:text-2xl font-light tracking-[0.4em] uppercase">Ahol a múlt és jövő összeér</p>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white opacity-50"
                >
                    <ChevronDown size={32} />
                </motion.div>
            </section>

            {/* POLGÁRMESTERI KÖSZÖNTŐ */}
            <section className="bg-white py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="relative bg-secondary/30 rounded-[60px] p-8 md:p-20 flex flex-col md:flex-row items-center gap-16 shadow-inner border border-gray-100">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />

                        <div className="w-64 h-64 md:w-80 md:h-80 flex-shrink-0 relative">
                            <div className="absolute inset-0 border-2 border-accent rounded-[40px] rotate-6 translate-x-4 translate-y-4" />
                            <div className="relative w-full h-full bg-gray-200 rounded-[40px] shadow-2xl z-10 overflow-hidden flex items-center justify-center">
                                {/* Ha van mayor.jpg, azt használja, ha nincs, egy ikont */}
                                <img
                                    src={getImageUrl('/img/reps/mayor.jpg')}
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                    alt="Polgármester"
                                />
                                <User size={80} className="text-primary/20 absolute" />
                            </div>
                        </div>

                        <div className="flex-grow text-center md:text-left">
                            <h2 className="text-accent font-bold uppercase tracking-[0.3em] text-sm mb-4">Köszöntő</h2>
                            <h3 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8 leading-tight">
                                Tisztelt Nádasdladányiak, <br /> Kedves Látogatók!
                            </h3>
                            <div className="text-gray-600 space-y-6 leading-relaxed italic text-lg max-w-2xl">
                                <p>
                                    "Nádasdladány nem csupán egy falu a térképen, hanem egy olyan közösség, ahol a gazdag történelmi múlt és a modern fejlődés kéz a kézben jár. Célunk, hogy ez a honlap kaput nyisson mindenki számára, aki szeretné megismerni községünk mindennapjait."
                                </p>
                            </div>
                            <div className="mt-10">
                                <p className="font-bold text-primary text-xl">Pálfi Kristóf</p>
                                <p className="text-accent font-medium uppercase tracking-widest text-xs">Polgármester</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HÍREK SZEKCIÓ */}
            <section className="max-w-7xl mx-auto py-24 px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Aktuális híreink</h2>
                        <div className="w-24 h-1 bg-accent mx-auto md:mx-0" />
                    </div>
                    <Link to="/hirek" className="text-accent font-bold uppercase tracking-widest text-sm hover:underline">
                        Összes hír böngészése →
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[...Array(3)].map((_, i) => <NewsCardSkeleton key={i} />)}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {articles.length > 0 ? (
                            articles.slice(0, 3).map((art, index) => (
                                <NewsCard key={art.id} article={art} index={index} />
                            ))
                        ) : (
                            <p className="col-span-full text-center text-gray-400 py-20 italic">Jelenleg nincsenek közzétett hírek.</p>
                        )}
                    </div>
                )}
            </section>

            {/* TÉRKÉP */}
            <section className="max-w-7xl mx-auto py-24 px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Fedezze fel községünket</h2>
                    <p className="text-gray-500 italic">Nádasdladány legfontosabb pontjai egy interaktív térképen</p>
                </div>
                <VillageMap />
            </section>
        </MainLayout>
    );
};