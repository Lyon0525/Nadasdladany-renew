import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

interface Props {
    onClose: () => void;
    onSubmit: (eventData: any) => void;
    loading: boolean;
}

export const EventForm = ({ onClose, onSubmit, loading }: Props) => {
    const [title, setTitle] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState('');
    const [eventUrl, setEventUrl] = useState('');
    const [isAllDay, setIsAllDay] = useState(false);
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        onSubmit({
            title,
            location,
            startDate: new Date(startDate).toISOString(),
            eventUrl: eventUrl || null,
            isAllDay,
            description
        });
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-end bg-primary/40 backdrop-blur-md">
            <div className="w-full max-w-md h-full bg-white shadow-2xl p-10 overflow-y-auto animate-in slide-in-from-right duration-500">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-primary">Új esemény</h2>
                        <p className="text-gray-400 text-sm mt-1">Rendezvény vagy ünnepség rögzítése.</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-3 hover:bg-secondary rounded-full text-primary/50 hover:text-primary">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Esemény megnevezése</label>
                        <input
                            type="text" required
                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                            placeholder="Pl. Falunap és Elszármazottak Találkozója"
                            value={title} onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Helyszín</label>
                        <input
                            type="text" required
                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                            placeholder="Pl. Kastélypark vagy Művelődési Ház"
                            value={location} onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Időpont (Kezdet)</label>
                        <input
                            type="datetime-local" required
                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm text-primary"
                            value={startDate} onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Külső hivatkozás / Facebook URL (Opcionális)</label>
                        <input
                            type="url"
                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                            placeholder="https://facebook.com/events/..."
                            value={eventUrl} onChange={(e) => setEventUrl(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 py-2 pl-1">
                        <input
                            type="checkbox" id="isAllDay"
                            className="w-4 h-4 rounded text-accent focus:ring-accent border-gray-300"
                            checked={isAllDay} onChange={(e) => setIsAllDay(e.target.checked)}
                        />
                        <label htmlFor="isAllDay" className="text-sm font-medium text-primary cursor-pointer select-none">Egész napos esemény</label>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Rövid tájékoztató szöveg</label>
                        <textarea
                            rows={3} className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                            placeholder="Részletes leírás a lakosság számára..."
                            value={description} onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50">Mégse</button>
                        <button
                            type="submit" disabled={loading}
                            className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl hover:bg-accent transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Esemény mentése</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};