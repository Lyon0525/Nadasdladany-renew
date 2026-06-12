import { useEffect, useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { eventService, type VillageEvent } from '../api/eventService';
import { EventCard } from '../features/events/components/EventCard';
import { Calendar } from 'lucide-react';

export const EventsPage = () => {
    const [events, setEvents] = useState<VillageEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        eventService.getEvents()
            .then(data => setEvents(data || []))
            .catch(() => setEvents([]))
            .finally(() => setLoading(false));
    }, []);

    const sortedEvents = events;

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto px-6 py-16">
                {/* FEJLÉC */}
                <div className="text-center mb-16">
                    <Calendar size={48} className="mx-auto text-accent mb-6" />
                    <h1 className="text-5xl font-serif font-bold text-primary mb-4">Eseménynaptár</h1>
                    <p className="text-gray-500">Közelgő közösségi programok, ünnepek és rendezvények Nádasdladányban.</p>
                </div>

                {/* ESEMÉNYEK LISTÁJA */}
                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center py-20 font-serif italic text-accent text-xl animate-pulse">
                            Események betöltése...
                        </div>
                    ) : sortedEvents.length > 0 ? (
                        sortedEvents.map((event, index) => (
                            <EventCard key={event.id} event={event} index={index} />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200 text-gray-400">
                            Jelenleg nincs meghirdetett közelgő esemény.
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};