import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { Seo } from '../components/common/Seo';
import apiClient from '../api/apiClient';
import { cn } from '../lib/utils';
import { MiniCalendar } from '../components/common/MiniCalendar';

interface Event {
    id: number;
    title: string;
    slug: string;
    description: string;
    location?: string;
    startDate: string;
    endDate?: string;
    isAllDay: boolean;
    organizer?: string;
    isPublished: boolean;
}

export const EventsPage = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

    useEffect(() => {
        console.log("Események lekérése a következő címről: /api/events...");

        apiClient.get('/events')
            .then(response => {
                console.log("Szerver válasz érkezett:", response.data);

                if (Array.isArray(response.data)) {
                    setEvents(response.data);
                } else if (response.data && Array.isArray(response.data.items)) {
                    setEvents(response.data.items);
                }
            })
            .catch(err => {
                console.error("Hiba történt az események lekérésekor:", err);
            })
            .finally(() => setLoading(false));
    }, []);

    const now = new Date();

    const upcomingEvents = events.filter(e => new Date(e.startDate) >= now)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const pastEvents = events.filter(e => new Date(e.startDate) < now)
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());

    const displayedEvents = filter === 'upcoming' ? upcomingEvents : pastEvents;

    return (
        <MainLayout>
            <Seo
                title="Események & Programok"
                description="Nádasdladány község közelgő rendezvényei, kulturális programjai és közösségi eseményei."
            />

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="mb-12 text-center md:text-left">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-4">Események & Programok</h1>
                    <p className="text-gray-500 max-w-2xl">Böngésszen Nádasdladány kulturális, sport és önkormányzati rendezvényei között.</p>
                </div>

                <div className="mb-20">
                    <MiniCalendar />
                </div>

                <div className="flex gap-2 mb-12 justify-center md:justify-start">
                    <button
                        onClick={() => setFilter('upcoming')}
                        className={cn(
                            "px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer border",
                            filter === 'upcoming' ? "bg-accent border-accent text-primary shadow-md" : "bg-white border-gray-100 text-gray-500 hover:text-primary"
                        )}
                    >
                        Közelgő programok ({upcomingEvents.length})
                    </button>
                    <button
                        onClick={() => setFilter('past')}
                        className={cn(
                            "px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all cursor-pointer border",
                            filter === 'past' ? "bg-accent border-accent text-primary shadow-md" : "bg-white border-gray-100 text-gray-500 hover:text-primary"
                        )}
                    >
                        Lezajlott rendezvények ({pastEvents.length})
                    </button>
                </div>

                {loading ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="animate-spin text-accent" size={36} />
                        <span className="font-serif italic text-gray-400">Programok betöltése...</span>
                    </div>
                ) : displayedEvents.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
                        <p className="text-xl font-serif text-gray-400">Jelenleg nincs megjeleníthető rendezvény ebben a kategóriában.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {displayedEvents.map((event, index) => {
                            const eDate = new Date(event.startDate);
                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white rounded-[32px] overflow-hidden border border-gray-50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group relative"
                                >
                                    {/* Kép konténer gyári kastélyos háttérképpel */}
                                    <div className="h-52 overflow-hidden relative bg-gray-100">
                                        <img
                                            src="/Nadasdladany-hero-banner.jpg"
                                            alt={event.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md py-2 px-3 rounded-2xl text-center shadow-md flex items-center gap-2">
                                            <span className="text-xl font-bold font-serif text-primary">{eDate.getDate()}</span>
                                            <div className="flex flex-col text-left border-l border-gray-200 pl-2">
                                                <span className="text-[10px] uppercase font-bold tracking-wider text-accent">
                                                    {eDate.toLocaleString('hu-HU', { month: 'short' })}
                                                </span>
                                                <span className="text-[9px] text-gray-400">{eDate.getFullYear()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 flex flex-col flex-1">
                                        <h2 className="text-xl font-serif font-bold text-primary mb-4 line-clamp-2 group-hover:text-accent transition-colors leading-snug">
                                            {event.title}
                                        </h2>

                                        <div className="space-y-2 text-xs text-gray-500 mb-6 font-medium">
                                            <div className="flex items-center gap-2">
                                                <Clock size={14} className="text-accent" />
                                                <span>
                                                    {event.isAllDay ? "Egész napos" : `${eDate.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })} óra`}
                                                </span>
                                            </div>
                                            {event.location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={14} className="text-accent" />
                                                    <span className="line-clamp-1">{event.location}</span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                                            {event.description}
                                        </p>

                                        <Link
                                            to={`/esemenyek/${event.slug}`}
                                            className="mt-auto inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-primary group-hover:text-accent transition-colors"
                                        >
                                            Részletek és infók
                                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};