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
import { ChevronDown, User, Bell, CalendarDays, Newspaper } from 'lucide-react';
import { newsletterService } from '../api/newsletterService';
import { siteSettingsService, type SiteSetting } from '../api/siteSettingsService';
import toast from 'react-hot-toast';
import { MiniCalendar } from '../components/common/MiniCalendar';

export const HomePage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<SiteSetting | null>(null);
    const [email, setEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        articleService.getArticles(1, 2)
            .then(data => setArticles(data && Array.isArray(data.items) ? data.items : []))
            .catch(() => setArticles([]))
            .finally(() => setLoading(false));

        siteSettingsService.getSettings()
            .then(data => setSettings(data || null))
            .catch(err => console.error("Hiba a köszöntő betöltésekor:", err));
    }, []);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await newsletterService.subscribe(email);
            toast.success("Sikeresen feliratkozott a községi hírlevélre!");
            setEmail('');
        } catch {
            toast.error("Hiba történt a feliratkozás során.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <MainLayout>
            <section className="relative h-screen flex items-center justify-center overflow-hidden w-full">
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
                    className="relative z-10 text-center px-6 selection:bg-accent selection:text-primary"
                >
                    <h1
                        className="text-6xl md:text-9xl font-serif font-black text-white mb-6 tracking-tight"
                        style={{
                            textShadow: '0 4px 20px rgba(0, 0, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.4)'
                        }}
                    >
                        Nádasdladány
                    </h1>

                    <p
                        className="text-accent text-lg md:text-2xl font-bold tracking-[0.35em] uppercase selection:bg-white selection:text-primary"
                        style={{
                            textShadow: `
                                -1px -1px 0 #000,  
                                 1px -1px 0 #000,
                                -1px  1px 0 #000,
                                 1px  1px 0 #000,
                                 0px  4px 10px rgba(0, 0, 0, 0.9)
                            `
                        }}
                    >
                        Ahol a múlt és jövő összeér
                    </p>
                </motion.div>

                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white opacity-50"
                >
                    <ChevronDown size={32} />
                </motion.div>
            </section>

            <section className="bg-white py-24 px-6 md:px-12 xl:px-20 w-full">
                <div className="w-full">
                    <div className="relative bg-secondary/30 rounded-[60px] p-8 md:p-20 flex flex-col md:flex-row items-center gap-16 shadow-inner border border-gray-100">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />

                        <div className="w-64 h-64 md:w-80 md:h-80 flex-shrink-0 relative">
                            <div className="absolute inset-0 border-2 border-accent rounded-[40px] rotate-6 translate-x-4 translate-y-4" />
                            <div className="relative w-full h-full bg-secondary rounded-[40px] shadow-2xl z-10 overflow-hidden flex items-center justify-center border border-gray-100">
                                {settings?.mayorImageUrl ? (
                                    <img
                                        src={getImageUrl(settings.mayorImageUrl) || '/aboutpage/polgarmester_placeholder.png'}
                                        className="w-full h-full object-cover"
                                        alt="Polgármester"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-primary/10 bg-secondary/80">
                                        <User size={100} strokeWidth={1} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-grow text-center md:text-left">
                            <h2 className="text-accent font-bold uppercase tracking-[0.3em] text-sm mb-4">Köszöntő</h2>
                            <h3 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-8 leading-tight">
                                {settings?.welcomeTitle || "Tisztelt Nádasdladányiak, Kedves Látogatók! (köszöntő cím nem elérhető)"}
                            </h3>
                            <div className="text-gray-600 space-y-6 leading-relaxed italic text-lg max-w-2xl whitespace-pre-line">
                                <p>
                                    {settings?.welcomeText || "Szeretettel köszöntöm Önöket Nádasdladány község megújult hivatalos weboldalán... (köszöntő szöveg nem elérhető)"}
                                </p>
                            </div>
                            <div className="mt-10">
                                <p className="font-bold text-primary text-xl">{settings?.mayorName || "Polgármester névenek betöltése sikertelen volt..."}</p>
                                <p className="text-accent font-medium uppercase tracking-widest text-xs">Polgármester</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-gradient-to-b from-white to-secondary/30 py-24 px-6 md:px-12 xl:px-20 w-full border-t border-gray-50">
                <div className="w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 xl:gap-16 items-start w-full">
                        <div className="lg:col-span-2 space-y-8">
                            <div className="flex justify-between items-end border-b border-gray-100 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-primary/5 text-primary rounded-xl">
                                        <Newspaper size={22} />
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">Aktuális híreink</h2>
                                </div>
                                <Link to="/hirek" className="text-accent font-bold uppercase tracking-widest text-xs hover:underline whitespace-nowrap mb-1">
                                    Összes hír →
                                </Link>
                            </div>

                            {loading ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {[...Array(2)].map((_, i) => <NewsCardSkeleton key={i} />)}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {articles.length > 0 ? (
                                        articles.slice(0, 2).map((art, index) => (
                                            <NewsCard key={art.id} article={art} index={index} />
                                        ))
                                    ) : (
                                        <p className="text-gray-400 py-10 italic text-sm">Jelenleg nincsenek közzétett hírek.</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="lg:col-span-1 space-y-8">
                            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                                <div className="p-2.5 bg-accent/10 text-accent rounded-xl">
                                    <CalendarDays size={22} />
                                </div>
                                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">Közösségi Iránytű</h2>
                            </div>

                            <div className="w-full border border-gray-100/50 rounded-[28px] overflow-hidden">
                                <MiniCalendar />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full py-24 px-6 md:px-12 xl:px-20">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Fedezze fel községünket</h2>
                    <p className="text-gray-500 italic">Nádasdladány legfontosabb pontjai egy interaktív térképen</p>
                </div>
                <div className="w-full rounded-[40px] overflow-hidden border border-gray-100 shadow-sm">
                    <VillageMap />
                </div>
            </section>

            <section className="w-full pb-24 px-6 md:px-12 xl:px-20">
                <div className="bg-primary text-white py-16 px-8 md:px-16 rounded-[40px] text-center shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        <div className="p-4 bg-white/10 text-accent rounded-2xl w-fit mx-auto mb-6">
                            <Bell size={28} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold mb-3">Értesüljön elsőként a hírekről!</h2>
                        <p className="text-gray-300 text-sm max-w-md mx-auto mb-8">
                            Iratkozzon fel hírlevelünkre, hogy azonnal értesüljön a legfrissebb önkormányzati döntésekről, pályázatokról és rendezvényekről.
                        </p>

                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                required
                                placeholder="Az Ön e-mail címe..."
                                className="flex-grow bg-white/10 border border-white/10 px-6 py-4 rounded-full text-white placeholder:text-gray-400 outline-none focus:border-accent transition-all text-sm"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={submitting}
                                className="bg-accent text-primary font-bold px-8 py-4 rounded-full text-sm hover:scale-105 transition-all flex-shrink-0 disabled:opacity-50 shadow-md cursor-pointer"
                            >
                                {submitting ? "Feliratkozás..." : "Feliratkozás"}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
};