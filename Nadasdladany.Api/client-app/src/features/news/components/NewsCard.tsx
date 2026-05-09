import { motion } from 'framer-motion';
import { Calendar, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { type Article } from '../../../types/Article';

interface Props {
    article: Article;
    index: number;
}

export const NewsCard = ({ article, index }: Props) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group"
        >
            <Link to={`/hirek/${article.slug}`} className="block relative overflow-hidden rounded-3xl bg-white shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100">
                {/* Kép szekció */}
                <div className="relative h-72 overflow-hidden">
                    <img
                        src={article.featuredImageUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80'}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                        <span className="text-white font-bold flex items-center gap-2">
                            Elolvasom <ArrowRight size={18} />
                        </span>
                    </div>

                    <div className="absolute top-4 left-4">
                        <span className="px-4 py-1 bg-accent/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                            {article.categoryName}
                        </span>
                    </div>
                </div>

                {/* Szöveg szekció */}
                <div className="p-8">
                    <div className="flex items-center gap-2 text-gray-400 text-xs mb-4 uppercase tracking-widest">
                        <Calendar size={14} className="text-accent" />
                        {new Date(article.publishedDate).toLocaleDateString('hu-HU', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>

                    <h3 className="text-xl font-serif font-bold text-primary mb-3 leading-tight group-hover:text-accent transition-colors line-clamp-2">
                        {article.title}
                    </h3>

                    <p className="text-gray-500 text-sm line-clamp-3 leading-relaxed mb-0">
                        {article.excerpt || "Kattintson a részletekért és a teljes tartalom megtekintéséhez."}
                    </p>
                </div>
            </Link>
        </motion.div>
    );
};