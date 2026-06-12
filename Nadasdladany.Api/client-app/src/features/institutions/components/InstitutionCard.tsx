import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Globe, Building, ArrowRight } from 'lucide-react';
import { type Institution } from '../../../api/institutionService';
import { getImageUrl } from '../../../lib/imageUtils';

interface Props {
    inst: Institution;
    index: number;
}

export const InstitutionCard = ({ inst, index }: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 group flex flex-col justify-between"
        >
            <div>
                <div className="relative h-56 overflow-hidden">
                    {inst.imageUrl ? (
                        <img
                            src={getImageUrl(inst.imageUrl)}
                            alt={inst.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center text-primary/10">
                            <Building size={80} />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                    <h3 className="absolute bottom-6 left-8 right-8 text-2xl font-serif font-bold text-white leading-tight">
                        {inst.name}
                    </h3>
                </div>

                <div className="p-8 pb-0">
                    <p className="text-gray-500 text-sm leading-relaxed mb-6 line-clamp-3">
                        {inst.description || "Nádasdladány község alapvető intézménye, amely a lakosság szolgálatában áll."}
                    </p>

                    <div className="space-y-4 border-t border-gray-50 pt-6">
                        {inst.address && (
                            <div className="flex items-start gap-3 text-sm text-gray-400">
                                <MapPin size={16} className="text-accent mt-0.5" />
                                <span>{inst.address}</span>
                            </div>
                        )}
                        {inst.phoneNumber && (
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Phone size={16} className="text-accent" />
                                <a href={`tel:${inst.phoneNumber}`} className="hover:text-primary transition-colors">{inst.phoneNumber}</a>
                            </div>
                        )}
                        {inst.websiteUrl && (
                            <div className="flex items-center gap-3 text-sm text-gray-400">
                                <Globe size={16} className="text-accent" />
                                <a href={inst.websiteUrl} target="_blank" rel="noreferrer" className="hover:text-primary transition-colors truncate">
                                    {inst.websiteUrl.replace(/^https?:\/\//, '')}
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-8 pt-4">
                <Link
                    to={`/intezmenyek/${inst.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-accent transition-colors cursor-pointer"
                >
                    Részletek és Információk <ArrowRight size={16} />
                </Link>
            </div>
        </motion.div>
    );
};