import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, ArrowRight, Newspaper, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchService } from '../../api/searchService';

export const SpotlightSearch = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
    const [query, setQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const navigate = useNavigate();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            setQuery('');
            setDebouncedQuery('');
        }
    }, [isOpen]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(query);
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const { data: results = [], isFetching } = useQuery({
        queryKey: ['spotlightSearch', debouncedQuery],
        queryFn: () => searchService.search(debouncedQuery),
        enabled: debouncedQuery.length > 1,
    });

    const handleSelect = (url: string) => {
        onClose();
        navigate(url);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] px-4">
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-primary/40 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className="relative w-full max-w-2xl bg-white rounded-[32px] shadow-2xl shadow-black/20 overflow-hidden"
                    >
                        <div className="p-6 border-b border-gray-100 flex items-center gap-4">
                            <Search className="text-accent" size={24} />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Keressen hírek, események vagy dokumentumok között..."
                                className="flex-grow text-xl outline-none text-primary placeholder:text-gray-300"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <div className="flex items-center gap-1 px-2 py-1 bg-secondary rounded-lg text-[10px] font-bold text-gray-400">
                                <Command size={10} /> <span>ESC</span>
                            </div>
                        </div>

                        <div className="max-h-[400px] overflow-y-auto p-4">
                            {isFetching ? (
                                <div className="p-10 text-center text-gray-400 italic">Keresés...</div>
                            ) : results.length > 0 ? (
                                <div className="space-y-2">
                                    {results.map((res, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleSelect(res.url)}
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-secondary transition-all text-left group cursor-pointer"
                                        >
                                            <div className="p-2 bg-white rounded-xl shadow-sm text-accent">
                                                {res.resultType === 'Hír' && <Newspaper size={18} />}
                                                {res.resultType === 'Esemény' && <Calendar size={18} />}
                                                {res.resultType === 'Dokumentum' && <FileText size={18} />}
                                            </div>
                                            <div className="flex-grow">
                                                <h4 className="font-bold text-primary">{res.title}</h4>
                                                <p className="text-xs text-gray-400 line-clamp-1">{res.description}</p>
                                            </div>
                                            <ArrowRight size={16} className="text-gray-200 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                                        </button>
                                    ))}
                                </div>
                            ) : debouncedQuery.length > 1 ? (
                                <div className="p-10 text-center text-gray-400">Nincs találat a következőre: "{debouncedQuery}"</div>
                            ) : (
                                <div className="p-10 text-center text-gray-300 text-sm italic">Gépeljen legalább 2 karaktert a kereséshez...</div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};