import { useEffect, useState } from 'react';
import { AdminLayout } from '../layouts/AdminLayout';
import { eventService, type VillageEvent } from '../api/eventService';
import { Trash2, CalendarPlus, MapPin, Clock } from 'lucide-react';

export const AdminEventsPage = () => {
    const [events, setEvents] = useState<VillageEvent[]>([]);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const data = await eventService.getEvents();
        setEvents(data);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Biztosan törölni szeretné ezt az eseményt?')) {
            await eventService.deleteEvent(id);
            fetchEvents();
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-serif font-bold text-primary">Események kezelése</h1>
                <button className="flex items-center gap-2 bg-accent text-primary font-bold px-8 py-4 rounded-full">
                    <CalendarPlus size={20} /> Új esemény
                </button>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr className="text-xs font-bold uppercase tracking-widest text-gray-400">
                            <th className="px-8 py-5">Esemény</th>
                            <th className="px-8 py-5">Helyszín</th>
                            <th className="px-8 py-5">Időpont</th>
                            <th className="px-8 py-5 text-right">Műveletek</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {events.map(event => (
                            <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-5 font-bold text-primary">{event.title}</td>
                                <td className="px-8 py-5 text-sm text-gray-500">
                                    <div className="flex items-center gap-1"><MapPin size={14} /> {event.location || '-'}</div>
                                </td>
                                <td className="px-8 py-5 text-sm text-gray-500">
                                    <div className="flex items-center gap-1"><Clock size={14} /> {new Date(event.startDate).toLocaleDateString('hu-HU')}</div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                    <button
                                        onClick={() => handleDelete(event.id)}
                                        className="p-2 text-red-400 hover:bg-red-50 rounded-full transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};