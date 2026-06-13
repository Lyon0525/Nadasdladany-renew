import { useState } from 'react';
import { X, Upload, Loader2, Check } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export const AlbumForm = ({ onClose, onSuccess }: Props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setCoverImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('Name', name);
        formData.append('Description', description);
        if (coverImage) {
            formData.append('CoverImage', coverImage);
        }

        try {
            const response = await fetch('/api/gallery/albums', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                toast.success("Album sikeresen létrehozva!");
                onSuccess();
                onClose();
            } else {
                throw new Error();
            }
        } catch {
            toast.error("Hiba történt az album létrehozása során.");
        } finally {
            setLoading(false);
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
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-secondary transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 py-6 space-y-6 overflow-y-auto">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Album megnevezése *</label>
                        <input
                            type="text" required placeholder="Pl. Falunap 2026 vagy Idősek Karácsonya"
                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm font-medium"
                            value={name} onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Rövid leírás / Évszám (Opcionális)</label>
                        <textarea
                            rows={3} placeholder="Pl. Összefoglaló a 2026-os nyári rendezvénysorozat képeiből..."
                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                            value={description} onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Album borítóképe</label>
                        <div className="relative h-28 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center group hover:border-accent transition-all overflow-hidden bg-white">
                            {imagePreview ? (
                                <div className="flex items-center gap-3 w-full px-4">
                                    <img src={imagePreview} className="w-14 h-14 object-cover rounded-lg" alt="" />
                                    <span className="text-xs font-bold text-accent truncate flex-1">{coverImage?.name}</span>
                                    <Check className="text-green-500" size={16} />
                                </div>
                            ) : (
                                <>
                                    <Upload className="text-gray-300 mr-2 group-hover:text-accent transition-colors" size={18} />
                                    <p className="text-xs text-gray-400 font-bold uppercase">Borítókép kiválasztása</p>
                                </>
                            )}
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                        </div>
                    </div>
                </form>

                <div className="border-t border-gray-100 pt-4 flex gap-4">
                    <button
                        type="button" onClick={onClose}
                        className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                        Mégse
                    </button>
                    <button
                        type="submit" disabled={loading}
                        className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl text-sm hover:bg-accent transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : null}
                        {loading ? "Létrehozás..." : "Album Létrehozása"}
                    </button>
                </div>

            </div>
        </div>
    );
};