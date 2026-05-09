import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { eventService, type VillageEvent } from '../../api/eventService';
import { Trash2, CalendarPlus } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminEventsPage = () => {
    const [events, setEvents] = useState<VillageEvent[]>([]);

    useEffect(() => { fetchEvents(); }, []);

    const fetchEvents = async () => {
        const data = await eventService.getEvents();
        setEvents(data);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Törli az eseményt?')) return;
        await eventService.deleteEvent(id);
        toast.success("Esemény törölve");
        fetchEvents();
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-serif font-bold text-primary">Események kezelése</h1>
                <button className="bg-accent text-primary font-bold px-8 py-4 rounded-full flex items-center gap-2">
                    <CalendarPlus size={20} /> Új esemény
                </button>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100 uppercase text-[10px] tracking-widest font-bold text-gray-400">
                        <tr>
                            <th className="px-8 py-5">Esemény</th>
                            <th className="px-8 py-5">Helyszín</th>
                            <th className="px-8 py-5 text-right">Műveletek</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {events.map(event => (
                            <tr key={event.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-5 font-bold text-primary">{event.title}</td>
                                <td className="px-8 py-5 text-sm text-gray-500">{event.location}</td>
                                <td className="px-8 py-5 text-right">
                                    <button onClick={() => handleDelete(event.id)} className="text-red-400 p-2 hover:bg-red-50 rounded-full">
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