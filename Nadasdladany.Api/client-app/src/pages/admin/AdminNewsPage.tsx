import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { articleService } from '../../api/articleService';
import type { Article } from '../../types/Article';
import { AdminNewsList } from '../../features/admin/news/components/AdminNewsList';
import { NewsForm } from '../../features/admin/news/components/NewsForm';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminNewsPage = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchNews = async () => {
        try {
            const data = await articleService.getArticles();
            setArticles(data);
        } catch (err) {
            toast.error("Hiba a hírek betöltésekor");
        }
    };

    useEffect(() => { fetchNews(); }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm('Biztosan törölni szeretné ezt a hírt?')) return;
        try {
            await articleService.deleteArticle(id);
            toast.success("Hír törölve");
            fetchNews();
        } catch (err) { toast.error("Hiba a törlés során"); }
    };

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        try {
            await articleService.createArticle(formData);
            toast.success("Hír sikeresen közzétéve!");
            setIsFormOpen(false);
            fetchNews();
        } catch (err) { toast.error("Hiba a feltöltés során"); }
        finally { setLoading(false); }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-primary">Hírek kezelése</h1>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-accent text-primary font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-lg"
                >
                    <Plus size={20} /> Új hír
                </button>
            </div>

            <AdminNewsList articles={articles} onDelete={handleDelete} />

            {isFormOpen && (
                <NewsForm onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} loading={loading} />
            )}
        </AdminLayout>
    );
};