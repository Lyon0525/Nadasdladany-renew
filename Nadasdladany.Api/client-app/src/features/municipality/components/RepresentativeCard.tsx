import { motion } from 'framer-motion';
import { Mail, Phone, User } from 'lucide-react';
import { type Representative } from '../../../types/Municipality';
import { OptimizedImage } from '../../../components/ui/OptimizedImage';

interface Props {
    rep: Representative;
    index: number;
}

export const RepresentativeCard = ({ rep, index }: Props) => {

    const getRoleName = (role: number | string) => {
        const r = Number(role);
        if (r === 0) return 'Polgármester';
        if (r === 1) return 'Alpolgármester';
        if (r === 3) return 'Jegyző';
        return 'Képviselő';
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500 text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
                <div className="absolute inset-0 bg-accent rounded-full opacity-10 animate-pulse" />
                {rep.imageUrl ? (
                    <OptimizedImage src={rep.imageUrl} alt={rep.name} className="w-full h-full rounded-full border-4 border-white shadow-lg" />
                ) : (
                    <div className="w-full h-full bg-secondary rounded-full flex items-center justify-center text-primary/20"><User size={48} /></div>
                )}
            </div>

            <h3 className="text-xl font-serif font-bold text-primary mb-1">{rep.name}</h3>
            <p className="text-accent text-sm font-bold uppercase tracking-widest mb-6">{rep.customTitleOverride || getRoleName(rep.role)}</p>

            <div className="space-y-3">
                {rep.email && (
                    <a href={`mailto:${rep.email}`} className="flex items-center justify-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm">
                        <Mail size={16} className="text-accent" /> {rep.email}
                    </a>
                )}
                {rep.phoneNumber && (
                    <a href={`tel:${rep.phoneNumber}`} className="flex items-center justify-center gap-2 text-gray-500 hover:text-primary transition-colors text-sm">
                        <Phone size={16} className="text-accent" /> {rep.phoneNumber}
                    </a>
                )}
            </div>
        </motion.div>
    );
};