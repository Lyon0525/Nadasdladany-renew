import { useState } from 'react';
import { X, Upload, Loader2, Trash2, Image as ImageIcon, Save, Edit3 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { galleryService, type GalleryAlbum } from '../../../../api/galleryService';
import toast from 'react-hot-toast';
import { getImageUrl } from '../../../../lib/imageUtils';

interface Props {
    album: GalleryAlbum;
    onClose: () => void;
}

export const AlbumManagerModal = ({ album, onClose }: Props) => {
    const queryClient = useQueryClient();
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const [title, setTitle] = useState(album.title);
    const [description, setDescription] = useState(album.description || '');
    const [isSavingInfo, setIsSavingInfo] = useState(false);

    const { data: images = [], isLoading } = useQuery({
        queryKey: ['albumImages', album.slug],
        queryFn: () => galleryService.getImagesByAlbum(album.slug)
    });

    const handleSaveInfo = async () => {
        if (!title.trim()) {
            toast.error("Az album címe nem lehet üres!");
            return;
        }
        setIsSavingInfo(true);
        try {
            await galleryService.updateAlbum(album.id, { id: album.id, name: title, description });
            toast.success("Album adatai sikeresen frissítve!");
            queryClient.invalidateQueries({ queryKey: ['adminAlbums'] });
        } catch (err) {
            toast.error("Hiba történt a mentés során.");
        } finally {
            setIsSavingInfo(false);
        }
    };

    const handleUpload = async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setIsUploading(true);
        try {
            await galleryService.uploadImages(album.id, files);
            toast.success(`${files.length} kép sikeresen feltöltve!`);
            queryClient.invalidateQueries({ queryKey: ['albumImages', album.slug] });
            queryClient.invalidateQueries({ queryKey: ['adminAlbums'] });
        } catch (err) {
            toast.error('Hiba történt a képek feltöltése során.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteImage = async (imageId: number) => {
        if (!window.confirm("Biztosan törölni szeretné ezt a képet?")) return;
        try {
            await galleryService.deleteImage(imageId);
            toast.success("Kép törölve!");
            queryClient.invalidateQueries({ queryKey: ['albumImages', album.slug] });
            queryClient.invalidateQueries({ queryKey: ['adminAlbums'] });
        } catch (err) {
            toast.error("Hiba a kép törlésekor.");
        }
    };

    return (
        <div className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-200">
            <div className="w-full max-w-5xl bg-gray-50 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

                <div className="bg-white p-8 border-b border-gray-100 flex justify-between items-center shadow-sm z-10">
                    <div>
                        <h3 className="text-3xl font-serif font-bold text-primary">{title}</h3>
                        <p className="text-xs font-bold uppercase tracking-widest text-accent mt-1">{images.length} feltöltött kép</p>
                    </div>
                    <button onClick={onClose} className="p-3 text-gray-400 hover:text-primary rounded-full hover:bg-secondary cursor-pointer transition-colors"><X size={24} /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                        <h4 className="text-sm font-bold text-primary mb-6 flex items-center gap-2">
                            <Edit3 size={18} className="text-accent" /> Album adatainak szerkesztése
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Album megnevezése</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={e => setTitle(e.target.value)}
                                    className="w-full bg-secondary/30 border border-gray-100 p-4 rounded-xl outline-none focus:border-accent text-sm font-bold text-primary"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5">Rövid leírás / Évszám</label>
                                <textarea
                                    rows={2}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    className="w-full bg-secondary/30 border border-gray-100 p-4 rounded-xl outline-none focus:border-accent text-sm text-primary leading-relaxed"
                                />
                            </div>
                            <button
                                onClick={handleSaveInfo}
                                disabled={isSavingInfo}
                                className="bg-primary text-white font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider hover:bg-accent transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
                            >
                                {isSavingInfo ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                                Változtatások mentése
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
                        <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                            <Upload size={18} className="text-accent" /> Új képek hozzáadása
                        </h4>
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false); }}
                            onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                handleUpload(e.dataTransfer.files);
                            }}
                            className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${isDragging ? 'border-accent bg-accent/5 scale-[1.01]' : 'border-gray-200 hover:border-accent bg-gray-50/50'
                                }`}
                        >
                            <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={(e) => handleUpload(e.target.files)} disabled={isUploading} />

                            {isUploading ? (
                                <div className="flex flex-col items-center gap-3 text-accent">
                                    <Loader2 className="animate-spin" size={36} />
                                    <span className="font-bold text-sm">Feltöltés folyamatban...</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 pointer-events-none">
                                    <ImageIcon className={`transition-colors ${isDragging ? 'text-accent' : 'text-gray-300'}`} size={40} />
                                    <span className="text-sm font-bold text-primary mt-2">Kattintson vagy húzza ide a képeket!</span>
                                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Több fájl is kiválasztható (.jpg, .png)</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2">
                            <ImageIcon size={18} className="text-accent" /> Albumban lévő képek
                        </h4>

                        {isLoading ? (
                            <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" size={32} /></div>
                        ) : images.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {images.map((img) => (
                                    <div key={img.id} className="relative group rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white aspect-square">
                                        <img src={getImageUrl(img.imageUrl)} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />

                                        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-end p-4">
                                            <button
                                                onClick={() => handleDeleteImage(img.id)}
                                                className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors shadow-lg cursor-pointer"
                                                title="Kép törlése"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-white rounded-[32px] border border-dashed border-gray-200 text-gray-400">
                                Még nincsenek feltöltött képek ebben az albumban.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};