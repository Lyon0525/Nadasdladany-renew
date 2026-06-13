import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import { type VillageEvent } from '../../../api/eventService';

interface Props {
    event: VillageEvent;
    index: number;
}

export const EventCard = ({ event, index }: Props) => {
    const date = new Date(event.startDate);
    const day = date.getDate();
    const month = date.toLocaleDateString('hu-HU', { month: 'short' }).replace('.', '');

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group flex gap-6 p-6 bg-white rounded-[32px] border border-gray-100 hover:shadow-xl transition-all duration-500"
        >
            <div className="flex-shrink-0 w-20 h-24 bg-secondary rounded-2xl flex flex-col items-center justify-center border border-primary/5 group-hover:bg-accent transition-colors duration-500">
                <span className="text-3xl font-serif font-bold text-primary group-hover:text-white">{day}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-accent group-hover:text-white/80">{month}</span>
            </div>

            <div className="flex-grow flex flex-col justify-center">
                <h3 className="text-xl font-serif font-bold text-primary mb-2 group-hover:text-accent transition-colors">
                    {event.title}
                </h3>

                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    {event.location && (
                        <span className="flex items-center gap-1.5"><MapPin size={14} className="text-accent" /> {event.location}</span>
                    )}
                    <span className="flex items-center gap-1.5">
                        <Clock size={14} className="text-accent" />
                        {event.isAllDay ? 'Egész napos' : date.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            </div>

            <div className="flex items-center">
                {event.eventUrl ? (
                    <a
                        href={event.eventUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Esemény részletei (külső hivatkozás)"
                        className="p-4 bg-gray-50 text-primary rounded-full group-hover:bg-primary group-hover:text-white transition-all cursor-pointer shadow-sm"
                    >
                        <ArrowRight size={20} />
                    </a>
                ) : (
                    <div
                        title="Nincs további külső hivatkozás"
                        className="p-4 bg-gray-50/50 text-gray-300 rounded-full"
                    >
                        <Clock size={20} />
                    </div>
                )}
            </div>
        </motion.div>
    );
};