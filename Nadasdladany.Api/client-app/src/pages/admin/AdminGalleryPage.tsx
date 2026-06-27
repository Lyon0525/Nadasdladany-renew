import { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { galleryService, type GalleryAlbum } from '../../api/galleryService';
import { Trash2, FolderPlus, Loader2, Image as ImageIcon } from 'lucide-react';
import { AlbumForm } from '../../features/admin/gallery/components/AlbumForm';
import { AlbumManagerModal } from '../../features/admin/gallery/components/AlbumManagerModal';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { OptimizedImage } from '../../components/ui/OptimizedImage';

export const AdminGalleryPage = () => {
    const [isAlbumFormOpen, setIsAlbumFormOpen] = useState(false);
    const [managingAlbum, setManagingAlbum] = useState<GalleryAlbum | null>(null);

    const { data: albums = [], refetch, isLoading } = useQuery({
        queryKey: ['adminAlbums'],
        queryFn: () => galleryService.getAlbums()
    });

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
                <div>
                    <h1 className="text-4xl font-serif font-bold text-primary">Galériák kezelése</h1>
                    <p className="text-gray-400 mt-1">Községi események fényképeinek feltöltése és menedzselése.</p>
                </div>
                <button onClick={() => setIsAlbumFormOpen(true)} className="flex items-center gap-2 bg-accent text-primary font-bold px-8 py-4 rounded-full hover:scale-105 transition-all cursor-pointer shadow-md">
                    <FolderPlus size={20} /> Új album létrehozása
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" size={32} /></div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {albums.map(album => (
                        <div key={album.id} className="bg-white p-6 rounded-[32px] border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 rounded-2xl bg-secondary overflow-hidden border border-gray-100 flex-shrink-0">
                                    {album.thumbnailUrl ? (
                                        <OptimizedImage
                                            src={album.thumbnailUrl}
                                            className="w-full h-full object-cover"
                                            alt="Album borító"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-primary/10">
                                            <ImageIcon size={32} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-xl font-serif font-bold text-primary mb-1">{album.title}</h3>
                                    <span className="text-[10px] font-bold uppercase tracking-widest bg-secondary text-accent px-3 py-1 rounded-full">
                                        {album.imageCount} fotó
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setManagingAlbum(album)}
                                    className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-accent transition-colors cursor-pointer shadow-sm"
                                >
                                    <ImageIcon size={16} /> Képek kezelése
                                </button>
                                <button
                                    onClick={() => handleAlbumDelete(album.id)}
                                    className="p-3.5 bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                    title="Album törlése"
                                >
                                    <Trash2 size={18} />
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
            {managingAlbum && <AlbumManagerModal album={managingAlbum} onClose={() => setManagingAlbum(null)} />}
        </AdminLayout>
    );
};