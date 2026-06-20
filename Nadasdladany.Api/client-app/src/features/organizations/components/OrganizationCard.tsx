import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Globe, Shield, Heart, Church, User, ExternalLink } from 'lucide-react';
import { type Organization, OrganizationType } from '../../../api/organizationService';
import { getImageUrl } from '../../../lib/imageUtils';

interface Props {
    org: Organization;
    index: number;
}

export const OrganizationCard = ({ org, index }: Props) => {
    const getIcon = (type: OrganizationType) => {
        if (type === OrganizationType.CivilSzervezet) return <Shield className="text-accent" size={22} />;
        if (type === OrganizationType.Egyhaz) return <Church className="text-accent" size={22} />;
        return <Heart className="text-accent" size={22} />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="bg-white rounded-[40px] p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col md:flex-row gap-8 items-start"
        >
            {org.imageUrl && (
                <div className="w-full md:w-40 h-40 flex-shrink-0 rounded-[24px] overflow-hidden shadow-inner bg-secondary/30 border border-gray-50">
                    <img 
                        src={getImageUrl(org.imageUrl)} 
                        alt={org.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                </div>
            )}

            <div className="flex-grow space-y-4 w-full flex flex-col justify-between h-full">
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-secondary rounded-2xl group-hover:bg-accent/10 transition-colors">
                            {getIcon(org.type)}
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-primary leading-snug group-hover:text-accent transition-colors">
                            {org.name}
                        </h3>
                    </div>

                    {org.description && (
                        <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
                            {org.description}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-xs text-gray-400 font-medium">
                        {org.leaderName && (
                            <p className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100/50">
                                <User size={14} className="text-accent" />
                                <span className="font-bold text-primary">Képviselő:</span> {org.leaderName}
                            </p>
                        )}
                        {org.address && (
                            <p className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100/50">
                                <MapPin size={14} className="text-accent" />
                                {org.address}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-50 w-full items-center">
                    {org.phoneNumber && (
                        <a
                            href={`tel:${org.phoneNumber}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-primary font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-200 transition-colors cursor-pointer border border-gray-100"
                        >
                            <Phone size={14} className="text-accent" />
                            Hívás indítása
                        </a>
                    )}

                    {org.email && (
                        <a
                            href={`mailto:${org.email}`}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-primary font-bold text-xs uppercase tracking-wider rounded-xl hover:bg-gray-200 transition-colors cursor-pointer border border-gray-100"
                        >
                            <Mail size={14} className="text-accent" />
                            E-mail küldése
                        </a>
                    )}

                    {org.websiteUrl && (
                        <a
                            href={org.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent text-primary font-bold text-xs uppercase tracking-wider rounded-xl hover:scale-[1.03] transition-all cursor-pointer shadow-sm shadow-accent/10 ml-auto"
                        >
                            <Globe size={14} />
                            Hivatalos Honlap
                            <ExternalLink size={12} className="opacity-60" />
                        </a>
                    )}
                </div>
            </div>
        </motion.div>
    );
};