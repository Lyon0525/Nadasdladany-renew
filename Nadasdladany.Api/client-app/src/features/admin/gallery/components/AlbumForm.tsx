import { useState } from 'react';
import { X, Upload, Loader2, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { galleryService } from '../../../../api/galleryService';
import toast from 'react-hot-toast';

const albumSchema = z.object({
    name: z.string().min(1, "Az album neve kötelező!").max(100),
    description: z.string().optional()
});

type AlbumFormData = z.infer<typeof albumSchema>;

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export const AlbumForm = ({ onClose, onSuccess }: Props) => {
    const { register, handleSubmit, formState: { errors } } = useForm<AlbumFormData>({
        resolver: zodResolver(albumSchema)
    });

    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) processFile(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                processFile(file);
            } else {
                toast.error("Kérjük, csak képfájlt húzzon ide!");
            }
        }
    };

    const processFile = (file: File) => {
        setCoverImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const onValidSubmit = async (data: AlbumFormData) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('Name', data.name);
        if (data.description) formData.append('Description', data.description);
        if (coverImage) formData.append('CoverImage', coverImage);

        try {
            await galleryService.createAlbum(formData);
            toast.success("Album sikeresen létrehozva!");
            onSuccess();
            onClose();
        } catch {
            toast.error("Hiba történt az album létrehozása során.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-white h-full p-8 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-primary">Új fotóalbum létrehozása</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Adja meg az esemény nevét a képek csoportosításához.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-secondary cursor-pointer"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit(onValidSubmit)} className="flex-1 py-6 space-y-6 overflow-y-auto">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Album megnevezése *</label>
                        <input
                            type="text"
                            className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm font-medium ${errors.name ? 'border-red-400' : 'border-gray-100'}`}
                            placeholder="Pl. Falunap 2026"
                            {...register('name')}
                        />
                        {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Rövid leírás / Évszám</label>
                        <textarea rows={3} className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" {...register('description')} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Album borítóképe</label>
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false); }}
                            onDrop={handleDrop}
                            className={`relative h-28 border-2 border-dashed rounded-2xl flex items-center justify-center group transition-all overflow-hidden cursor-pointer ${isDragging ? 'border-accent bg-accent/5 scale-[1.02]' : 'border-gray-200 hover:border-accent bg-white'
                                }`}
                        >
                            {imagePreview ? (
                                <div className="flex items-center gap-3 w-full px-4 relative z-20 pointer-events-none">
                                    <img src={imagePreview} className="w-14 h-14 object-cover rounded-lg" alt="" />
                                    <span className="text-xs font-bold text-accent truncate flex-1">{coverImage?.name}</span>
                                    <Check className="text-green-500" size={16} />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-1 pointer-events-none relative z-20 py-4">
                                    <Upload className={`transition-colors ${isDragging ? 'text-accent' : 'text-gray-300 group-hover:text-accent'}`} size={20} />
                                    <p className={`text-[10px] font-bold uppercase mt-1 transition-colors ${isDragging ? 'text-accent' : 'text-gray-400 group-hover:text-accent'}`}>Borítókép kiválasztása</p>
                                </div>
                            )}
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleImageChange} />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl text-sm hover:bg-gray-200 cursor-pointer">Mégse</button>
                        <button type="submit" disabled={isSubmitting} className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl text-sm hover:bg-accent flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50">
                            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : null} {isSubmitting ? "Létrehozás..." : "Album Létrehozása"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};