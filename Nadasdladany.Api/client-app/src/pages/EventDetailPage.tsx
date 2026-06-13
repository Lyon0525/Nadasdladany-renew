import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, User, Loader2 } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { Seo } from '../components/common/Seo';
import apiClient from '../api/apiClient';

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
}

export const EventDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (slug) {
            // Lekérjük a rendezvényeket a meglévő kollekcióból, és kikeresik slug szerint
            apiClient.get('/events')
                .then(response => {
                    const items = Array.isArray(response.data) ? response.data : (response.data?.items || []);
                    const foundEvent = items.find((e: Event) => e.slug === slug);
                    setEvent(foundEvent || null);
                })
                .catch(err => console.error("Hiba az esemény betöltésekor:", err))
                .finally(() => setLoading(false));
        }
    }, [slug]);

    if (loading) return <div className="h-screen flex items-center justify-center font-serif italic text-accent text-2xl gap-3"><Loader2 className="animate-spin" /> Rendezvény adatai betöltése...</div>;
    if (!event) return <div className="h-screen flex items-center justify-center font-serif text-2xl">A program nem található.</div>;

    const eDate = new Date(event.startDate);

    return (
        <MainLayout>
            <Seo title={event.title} description={event.description} image="/img/castle/DJI_0143_retus2.jpg" />

            <div className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-primary/50 hover:text-accent transition-colors mb-12 group uppercase text-xs font-bold tracking-widest cursor-pointer"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Vissza a programokhoz
                </button>

                <header className="mb-12">
                    <span className="px-4 py-1 bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest rounded-full mb-6 inline-block">
                        Közösségi Esemény
                    </span>

                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-8 leading-tight">
                        {event.title}
                    </h1>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm text-gray-500 border-y border-gray-100 py-6">
                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-accent" />
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Dátum</span>
                                <span className="font-medium text-primary">{eDate.toLocaleDateString('hu-HU')}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock size={18} className="text-accent" />
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Időpont</span>
                                <span className="font-medium text-primary">
                                    {event.isAllDay ? "Egész napos" : `${eDate.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })} óra`}
                                </span>
                            </div>
                        </div>
                        {event.location && (
                            <div className="flex items-center gap-3">
                                <MapPin size={18} className="text-accent" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Helyszín</span>
                                    <span className="font-medium text-primary line-clamp-1">{event.location}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <div className="relative h-[450px] rounded-[40px] overflow-hidden mb-16 shadow-2xl">
                    <img src="/img/castle/DJI_0143_retus2.jpg" alt={event.title} className="w-full h-full object-cover" />
                </div>

                <div className="prose prose-lg prose-slate max-w-none shadow-sm bg-white p-8 md:p-16 rounded-[40px] border border-gray-50">
                    {event.organizer && (
                        <div className="flex items-center gap-2 text-xs font-bold text-accent uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">
                            <User size={14} />
                            <span>Szervező: {event.organizer}</span>
                        </div>
                    )}
                    <p className="leading-relaxed text-gray-600 whitespace-pre-line">{event.description}</p>
                </div>
            </div>
        </MainLayout>
    );
};