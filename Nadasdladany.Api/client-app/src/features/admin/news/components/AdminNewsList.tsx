import { Edit2, Trash2, ExternalLink } from 'lucide-react';
import { type Article } from '../../../../types/Article';
import { Link } from 'react-router-dom';

interface Props {
    articles: Article[];
    onDelete: (id: number) => void;
    onEdit: (article: Article) => void;
}

export const AdminNewsList = ({ articles, onDelete, onEdit }: Props) => {
    return (
        <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-widest text-gray-400">
                        <th className="px-8 py-5">Hír címe</th>
                        <th className="px-8 py-5">Kategória</th>
                        <th className="px-8 py-5">Dátum</th>
                        <th className="px-8 py-5 text-right">Műveletek</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                    {articles.map((art) => (
                        <tr key={art.id} className="hover:bg-gray-50/50 transition-colors group">
                            <td className="px-8 py-5">
                                <div className="flex items-center gap-4">
                                    {art.featuredImageUrl && (
                                        <img src={art.featuredImageUrl} className="w-12 h-12 rounded-lg object-cover" alt="" />
                                    )}
                                    <span className="font-medium text-primary">{art.title}</span>
                                </div>
                            </td>
                            <td className="px-8 py-5 text-sm text-gray-500">
                                <span className="px-3 py-1 bg-secondary rounded-full text-primary text-xs font-bold uppercase tracking-tighter">
                                    {art.categoryName}
                                </span>
                            </td>
                            <td className="px-8 py-5 text-sm text-gray-400">
                                {new Date(art.publishedDate).toLocaleDateString('hu-HU')}
                            </td>
                            <td className="px-8 py-5">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link
                                        to={`/hirek/${art.slug}`}
                                        target="_blank"
                                        className="p-2 text-gray-400 hover:text-accent transition-colors cursor-pointer"
                                    >
                                        <ExternalLink size={18} />
                                    </Link>
                                    <button
                                        onClick={() => onEdit(art)}
                                        className="p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => { if (window.confirm('Biztosan törlöd?')) onDelete(art.id) }}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};