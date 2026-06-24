import { useState } from 'react';
import { X, Loader2, Upload, Check } from 'lucide-react';
import { type VillageEvent } from '../../../../api/eventService';
import { getImageUrl } from '../../../../lib/imageUtils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const eventSchema = z.object({
    title: z.string().min(1, "A rendezvény neve kötelező!").max(150),
    location: z.string().min(1, "A helyszín megadása kötelező!"),
    startDate: z.string().min(1, "Kérjük adja meg az esemény kezdetét!"),
    eventUrl: z.string().url("Érvénytelen URL! (pl. https://facebook.com/...)").optional().or(z.literal('')),
    isAllDay: z.boolean().default(false),
    description: z.string().optional()
});

type EventFormData = z.infer<typeof eventSchema>;

interface Props {
    event?: VillageEvent | null;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    loading: boolean;
}

export const EventForm = ({ event, onClose, onSubmit, loading }: Props) => {
    const formatDateTimeLocal = (dateStr?: string) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const { register, handleSubmit, formState: { errors } } = useForm<EventFormData>({
        resolver: zodResolver(eventSchema) as any,
        defaultValues: {
            title: event?.title || '',
            location: event?.location || '',
            startDate: formatDateTimeLocal(event?.startDate) || '',
            eventUrl: event?.eventUrl || '',
            isAllDay: event?.isAllDay || false,
            description: event?.description || ''
        }
    });

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(event?.imageUrl ? getImageUrl(event.imageUrl) : null);
    const [isDragging, setIsDragging] = useState(false);

    const processFile = (file: File) => {
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) processFile(file);
            else toast.error("Kérjük, csak képfájlt húzzon ide!");
        }
    };

    const onValidSubmit = (data: EventFormData) => {
        const formData = new FormData();
        if (event) formData.append('Id', event.id.toString());

        formData.append('Title', data.title);
        formData.append('Location', data.location);
        formData.append('StartDate', new Date(data.startDate).toISOString());
        formData.append('IsAllDay', data.isAllDay.toString());

        if (data.eventUrl) formData.append('EventUrl', data.eventUrl);
        if (data.description) formData.append('Description', data.description);
        if (image) formData.append('Image', image);

        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-end bg-primary/40 backdrop-blur-md">
            <div className="w-full max-w-md h-full bg-white shadow-2xl p-10 overflow-y-auto animate-in slide-in-from-right duration-500">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-primary">
                            {event ? 'Esemény szerkesztése' : 'Új esemény'}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">Rendezvény vagy ünnepség rögzítése.</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-3 hover:bg-secondary rounded-full text-primary/50 hover:text-primary cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-5 pb-20">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Esemény megnevezése *</label>
                        <input
                            type="text"
                            className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm font-medium ${errors.title ? 'border-red-400' : 'border-gray-100'}`}
                            {...register('title')}
                        />
                        {errors.title && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Esemény plakátja / Borítóképe</label>
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false); }}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer group overflow-hidden ${isDragging ? 'border-accent bg-accent/5 scale-[1.01]' : 'border-gray-200 hover:border-accent'}`}
                        >
                            {imagePreview ? (
                                <div className="flex items-center gap-3 w-full">
                                    <img src={imagePreview} className="w-12 h-12 object-cover rounded-lg shadow-sm" alt="" />
                                    <span className="text-xs font-bold text-accent truncate max-w-full">{image ? image.name : 'Jelenlegi borítókép'}</span>
                                    <Check className="text-green-500 ml-auto" size={16} />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-1 pointer-events-none py-2">
                                    <Upload className={`transition-colors ${isDragging ? 'text-accent' : 'text-gray-300 group-hover:text-accent'}`} size={20} />
                                    <p className={`text-[10px] font-bold uppercase transition-colors text-center mt-1 ${isDragging ? 'text-accent' : 'text-gray-400 group-hover:text-accent'}`}>Plakát feltöltése</p>
                                </div>
                            )}
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleImageChange} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Helyszín *</label>
                        <input
                            type="text"
                            className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm ${errors.location ? 'border-red-400' : 'border-gray-100'}`}
                            {...register('location')}
                        />
                        {errors.location && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.location.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Időpont (Kezdet) *</label>
                        <input
                            type="datetime-local"
                            className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm text-primary cursor-pointer ${errors.startDate ? 'border-red-400' : 'border-gray-100'}`}
                            {...register('startDate')}
                        />
                        {errors.startDate && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.startDate.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Külső hivatkozás / Facebook (Opcionális)</label>
                        <input
                            type="url"
                            className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm ${errors.eventUrl ? 'border-red-400' : 'border-gray-100'}`}
                            placeholder="https://facebook.com/events/..."
                            {...register('eventUrl')}
                        />
                        {errors.eventUrl && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.eventUrl.message}</p>}
                    </div>

                    <div className="flex items-center gap-3 py-2 pl-1">
                        <input type="checkbox" id="isAllDay" className="w-4 h-4 rounded text-accent focus:ring-accent border-gray-300 cursor-pointer" {...register('isAllDay')} />
                        <label htmlFor="isAllDay" className="text-sm font-medium text-primary cursor-pointer select-none">Egész napos esemény</label>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Rövid tájékoztató szöveg</label>
                        <textarea rows={3} className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm leading-relaxed" {...register('description')} />
                    </div>

                    <div className="fixed bottom-0 right-0 w-full max-w-md p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer">Mégse</button>
                        <button type="submit" disabled={loading} className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl hover:bg-accent transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md">
                            {loading ? <Loader2 className="animate-spin" /> : <>{event ? 'Változtatások mentése' : 'Esemény mentése'}</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};