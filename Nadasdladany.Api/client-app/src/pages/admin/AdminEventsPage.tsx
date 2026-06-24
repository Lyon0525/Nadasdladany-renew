import { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { eventService, type VillageEvent } from '../../api/eventService';
import { EventForm } from '../../features/admin/events/components/EventForm';
import { Trash2, CalendarPlus, MapPin, Clock, Edit2, ExternalLink, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../lib/imageUtils';

export const AdminEventsPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingEvent, setEditingEvent] = useState<VillageEvent | null>(null);

    const { data: events = [], refetch, isLoading } = useQuery({
        queryKey: ['adminEvents'],
        queryFn: () => eventService.getEvents()
    });

    const handleDelete = async (id: number) => {
        if (!window.confirm('Biztosan törölni szeretné ezt az eseményt?')) return;
        try {
            await eventService.deleteEvent(id);
            toast.success("Esemény sikeresen törölve");
            refetch();
        } catch (err) {
            toast.error("Hiba a törlés során");
        }
    };

    const handleOpenNew = () => { setEditingEvent(null); setIsFormOpen(true); };
    const handleEdit = (event: VillageEvent) => { setEditingEvent(event); setIsFormOpen(true); };

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            if (editingEvent) {
                await eventService.updateEvent(editingEvent.id, formData);
                toast.success("Esemény frissítve!");
            } else {
                await eventService.createEvent(formData);
                toast.success("Esemény közzétéve!");
            }
            setIsFormOpen(false);
            setEditingEvent(null);
            refetch();
        } catch (err) {
            toast.error("Mentési hiba!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-primary">Események kezelése</h1>
                    <p className="text-gray-400 mt-1">A községi eseménynaptárban megjelenő aktív rendezvények.</p>
                </div>
                <button onClick={handleOpenNew} className="bg-accent text-primary font-bold px-8 py-4 rounded-full flex items-center gap-2 hover:scale-105 transition-all shadow-lg cursor-pointer">
                    <CalendarPlus size={20} /> Új esemény meghirdetése
                </button>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 overflow-hidden shadow-sm">
                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" size={32} /></div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 uppercase text-[10px] tracking-widest font-bold text-gray-400">
                            <tr>
                                <th className="px-8 py-5">Esemény</th>
                                <th className="px-8 py-5">Időpont</th>
                                <th className="px-8 py-5">Helyszín</th>
                                <th className="px-8 py-5 text-right">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-sm">
                            {events.map((event) => (
                                <tr key={event.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5 font-bold text-primary">
                                        <div className="flex items-center gap-4">
                                            {event.imageUrl && <img src={getImageUrl(event.imageUrl)} className="w-10 h-10 rounded-lg object-cover border border-gray-100" alt="" />}
                                            <span className="font-bold text-primary">{event.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-gray-500">
                                        <span className="flex items-center gap-1.5"><Clock size={14} className="text-accent" />
                                            {new Date(event.startDate).toLocaleString('hu-HU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            {event.isAllDay && " (Egész napos)"}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-gray-400"><span className="flex items-center gap-1.5"><MapPin size={14} /> {event.location || '-'}</span></td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Link to={`/esemenyek/${event.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-accent cursor-pointer"><ExternalLink size={18} /></Link>
                                            <button onClick={() => handleEdit(event)} className="p-2 text-gray-400 hover:text-primary cursor-pointer"><Edit2 size={18} /></button>
                                            <button onClick={() => handleDelete(event.id)} className="p-2 text-gray-400 hover:text-red-500 cursor-pointer"><Trash2 size={18} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {events.length === 0 && <tr><td colSpan={4} className="text-center py-10 text-gray-400 italic">Jelenleg nincs aktív esemény.</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>

            {isFormOpen && <EventForm event={editingEvent} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} loading={isSubmitting} />}
        </AdminLayout>
    );
};