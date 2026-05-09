import { useEffect, useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { eventService, type VillageEvent } from '../api/eventService';
import { EventCard } from '../features/events/components/EventCard';
import { Calendar } from 'lucide-react';

export const EventsPage = () => {
    const [events, setEvents] = useState<VillageEvent[]>([]);
    const [filter, setFilter] = useState<'upcoming' | 'past'>('upcoming');

    useEffect(() => {
        eventService.getEvents().then(setEvents);
    }, []);

    const now = new Date();
    const filteredEvents = events
        .filter(e => {
            const eventDate = new Date(e.startDate);
            return filter === 'upcoming' ? eventDate >= now : eventDate < now;
        })
        .sort((a, b) => {
            return filter === 'upcoming'
                ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
                : new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        });

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <Calendar size={48} className="mx-auto text-accent mb-6" />
                    <h1 className="text-5xl font-serif font-bold text-primary mb-4">Eseménynaptár</h1>
                    <p className="text-gray-500">Közösségi programok, ünnepek és rendezvények Nádasdladányban.</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-secondary p-1.5 rounded-full border border-gray-100">
                        <button
                            onClick={() => setFilter('upcoming')}
                            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${filter === 'upcoming' ? 'bg-white text-primary shadow-md' : 'text-gray-400 hover:text-primary'}`}
                        >
                            Közelgő
                        </button>
                        <button
                            onClick={() => setFilter('past')}
                            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all ${filter === 'past' ? 'bg-white text-primary shadow-md' : 'text-gray-400 hover:text-primary'}`}
                        >
                            Múltbéli
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event, index) => (
                            <EventCard key={event.id} event={event} index={index} />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200 text-gray-400">
                            Jelenleg nincs megjeleníthető esemény ebben a kategóriában.
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};