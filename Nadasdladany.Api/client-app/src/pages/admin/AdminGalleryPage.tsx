import { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { galleryService } from '../../api/galleryService';
import { Upload, Trash2, FolderPlus, Loader2 } from 'lucide-react';
import { AlbumForm } from '../../features/admin/gallery/components/AlbumForm';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const AdminGalleryPage = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [isAlbumFormOpen, setIsAlbumFormOpen] = useState(false);

    const { data: albums = [], refetch, isLoading } = useQuery({
        queryKey: ['adminAlbums'],
        queryFn: () => galleryService.getAlbums()
    });

    const handleFileUpload = async (albumId: number, files: FileList | null) => {
        if (!files) return;
        setIsUploading(true);
        try {
            await galleryService.uploadImages(albumId, files);
            toast.success('Képek sikeresen hozzáadva az albumhoz!');
            refetch();
        } catch (err) {
            toast.error('Hiba történt a képek feltöltése során.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleAlbumDelete = async (id: number) => {
        if (!window.confirm("Biztosan törölni szeretné ezt az albumot a benne lévő összes képpel együtt?")) return;
        try {
            await galleryService.deleteAlbum(id);
            toast.success("Album sikeresen törölve!");
            refetch();
        } catch {
            toast.error("Hiba történt a törlés során.");
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-serif font-bold text-primary">Galériák kezelése</h1>
                <button onClick={() => setIsAlbumFormOpen(true)} className="flex items-center gap-2 bg-accent text-primary font-bold px-8 py-4 rounded-full hover:scale-105 transition-all cursor-pointer shadow-md">
                    <FolderPlus size={20} /> Új album
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" size={32} /></div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {albums.map(album => (
                        <div key={album.id} className="bg-white p-8 rounded-[32px] border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
                            <div>
                                <h3 className="text-xl font-bold text-primary">{album.title}</h3>
                                <p className="text-gray-400 text-sm">{album.imageCount} kép az albumban</p>
                            </div>

                            <div className="flex items-center gap-4">
                                <label className={`flex items-center gap-2 px-6 py-3 bg-secondary rounded-full transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-200'}`}>
                                    {isUploading ? <Loader2 className="animate-spin" size={18} /> : <><Upload size={18} /> Képek hozzáadása</>}
                                    <input type="file" multiple accept="image/*" className="hidden" disabled={isUploading} onChange={(e) => handleFileUpload(album.id, e.target.files)} />
                                </label>
                                <button onClick={() => handleAlbumDelete(album.id)} className="p-3 text-red-400 hover:bg-red-50 rounded-full transition-colors cursor-pointer" title="Album törlése">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {albums.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200 text-gray-400">
                            Nincsenek még galériák. Hozzon létre egyet az "Új album" gombbal!
                        </div>
                    )}
                </div>
            )}

            {isAlbumFormOpen && <AlbumForm onClose={() => setIsAlbumFormOpen(false)} onSuccess={() => refetch()} />}
        </AdminLayout>
    );
};