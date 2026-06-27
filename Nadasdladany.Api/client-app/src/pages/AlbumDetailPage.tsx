import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MainLayout } from '../layouts/MainLayout';
import { galleryService, type GalleryImage } from '../api/galleryService';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { OptimizedImage } from '../components/ui/OptimizedImage';

export const AlbumDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

    const { data: images = [] } = useQuery<GalleryImage[]>({
        queryKey: ['albumImages', slug],
        queryFn: () => galleryService.getImagesByAlbum(slug!),
        enabled: !!slug
    });

    const openLightbox = (index: number) => setSelectedImageIndex(index);
    const closeLightbox = () => setSelectedImageIndex(null);
    const nextImage = () => setSelectedImageIndex(i => (i !== null && i < images.length - 1 ? i + 1 : 0));
    const prevImage = () => setSelectedImageIndex(i => (i !== null && i > 0 ? i - 1 : images.length - 1));

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-16">
                <h1 className="text-4xl font-serif font-bold text-primary mb-12 capitalize">
                    {slug?.replace('-', ' ')}
                </h1>

                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {images.map((img, index) => (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="relative group cursor-pointer overflow-hidden rounded-3xl bg-gray-100"
                            onClick={() => openLightbox(index)}
                        >
                            <OptimizedImage src={img.imageUrl} alt={`Galéria kép ${index + 1}`} className="w-full h-auto group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize2 className="text-white" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedImageIndex !== null && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4 md:p-10"
                    >
                        <button onClick={closeLightbox} className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors"><X size={32} /></button>
                        <button onClick={prevImage} className="absolute left-4 md:left-10 text-white/50 hover:text-white transition-colors"><ChevronLeft size={48} /></button>

                        <OptimizedImage
                            key={selectedImageIndex}
                            src={images[selectedImageIndex].imageUrl}
                            alt="Nagyított kép"
                            isHero={true}
                            className="max-w-full max-h-full rounded-xl shadow-2xl"
                        />

                        <button onClick={nextImage} className="absolute right-4 md:right-10 text-white/50 hover:text-white transition-colors"><ChevronRight size={48} /></button>

                        <div className="absolute bottom-10 text-white/50 font-medium">
                            {selectedImageIndex + 1} / {images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </MainLayout>
    );
};