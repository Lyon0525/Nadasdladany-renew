import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Globe, Shield, Heart, Church } from 'lucide-react';
import { type Organization, OrganizationType } from '../../../api/organizationService';
import { getImageUrl } from '../../../lib/imageUtils';

interface Props {
    org: Organization;
    index: number;
}

export const OrganizationCard = ({ org, index }: Props) => {
    const getIcon = (type: OrganizationType) => {
        if (type === OrganizationType.CivilSzervezet) return <Shield className="text-accent" size={20} />;
        if (type === OrganizationType.Egyhaz) return <Church className="text-accent" size={20} />;
        return <Heart className="text-accent" size={20} />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col md:flex-row gap-6 items-start"
        >
            {org.imageUrl && (
                <div className="w-full md:w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden shadow-sm">
                    <img src={getImageUrl(org.imageUrl)} alt={org.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
            )}

            <div className="flex-grow space-y-3">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-secondary rounded-xl">{getIcon(org.type)}</div>
                    <h3 className="text-xl font-serif font-bold text-primary leading-snug">{org.name}</h3>
                </div>

                {org.description && <p className="text-gray-500 text-sm leading-relaxed">{org.description}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 pt-2 border-t border-gray-50 text-xs text-gray-400">
                    {org.leaderName && <p><span className="font-bold text-primary">Képviselő:</span> {org.leaderName}</p>}
                    {org.address && <p className="flex items-center gap-1"><MapPin size={12} /> {org.address}</p>}
                    {org.phoneNumber && <p className="flex items-center gap-1"><Phone size={12} /> {org.phoneNumber}</p>}
                    {org.email && <p className="flex items-center gap-1"><Mail size={12} /> {org.email}</p>}
                    {org.websiteUrl && (
                        <p className="flex items-center gap-1 col-span-full">
                            <Globe size={12} />
                            <a href={org.websiteUrl} target="_blank" rel="noreferrer" className="text-accent hover:underline truncate max-w-xs">{org.websiteUrl}</a>
                        </p>
                    )}
                </div>
            </div>
        </motion.div>
    );
};