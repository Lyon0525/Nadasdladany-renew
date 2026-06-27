import { motion } from 'framer-motion';
import { MainLayout } from '../layouts/MainLayout';
import { galleryService } from '../api/galleryService';
import { Image, FolderOpen, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getImageUrl } from '../lib/imageUtils';

export const GalleryPage = () => {
    const { data: albums = [], isLoading: loading } = useQuery({
        queryKey: ['publicGalleryAlbums'],
        queryFn: () => galleryService.getAlbums()
    });

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-20">
                    <Image size={48} className="mx-auto text-accent mb-6" />
                    <h1 className="text-5xl font-serif font-bold text-primary mb-4">Galéria</h1>
                    <p className="text-gray-500">Pillanatképek Nádasdladány mindennapjaiból és ünnepeiből.</p>
                </div>

                {loading ? (
                    <div className="text-center py-20 font-serif italic text-accent text-xl animate-pulse flex flex-col items-center justify-center gap-3">
                        <Loader2 className="animate-spin" size={32} />
                        Galériák betöltése...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {albums.map((album, index) => (
                            <motion.div
                                key={album.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link to={`/galeria/${album.slug}`} className="group block">
                                    <div className="relative h-80 rounded-[40px] overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 border border-gray-100 bg-gray-100">
                                        <img
                                            src={getImageUrl(album.thumbnailUrl)}
                                            alt={album.title}
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-8">
                                            <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-2">
                                                <FolderOpen size={14} /> {album.imageCount} kép
                                            </div>
                                            <h3 className="text-2xl font-serif font-bold text-white group-hover:text-accent transition-colors">
                                                {album.title}
                                            </h3>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};