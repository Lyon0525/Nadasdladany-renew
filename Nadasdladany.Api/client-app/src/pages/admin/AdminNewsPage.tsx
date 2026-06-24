import { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { articleService } from '../../api/articleService';
import type { Article } from '../../types/Article';
import { AdminNewsList } from '../../features/admin/news/components/AdminNewsList';
import { NewsForm } from '../../features/admin/news/components/NewsForm';
import { Plus, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const AdminNewsPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);

    const { data: articles = [], refetch, isLoading } = useQuery({
        queryKey: ['adminNews'],
        queryFn: async () => {
            const data = await articleService.getArticles(1, 100);
            return data && Array.isArray(data.items) ? data.items : [];
        }
    });

    const handleDelete = async (id: number) => {
        if (!window.confirm('Biztosan törölni szeretné ezt a hírt?')) return;
        try {
            await articleService.deleteArticle(id);
            toast.success("Hír törölve");
            refetch();
        } catch (err) {
            toast.error("Hiba a törlés során");
        }
    };

    const handleOpenNew = () => {
        setEditingArticle(null);
        setIsFormOpen(true);
    };

    const handleEdit = (article: Article) => {
        setEditingArticle(article);
        setIsFormOpen(true);
    };

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            if (editingArticle) {
                await articleService.updateArticle(editingArticle.id, formData);
                toast.success("Hír sikeresen frissítve!");
            } else {
                await articleService.createArticle(formData);
                toast.success("Hír sikeresen közzétéve!");
            }
            setIsFormOpen(false);
            setEditingArticle(null);
            refetch();
        } catch (err) {
            toast.error("Hiba a mentés során!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-serif font-bold text-primary">Hírek kezelése</h1>
                <button onClick={handleOpenNew} className="flex items-center gap-2 bg-accent text-primary font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-lg cursor-pointer">
                    <Plus size={20} /> Új hír
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" size={32} /></div>
            ) : (
                <AdminNewsList articles={articles} onDelete={handleDelete} onEdit={handleEdit} />
            )}

            {isFormOpen && (
                <NewsForm article={editingArticle} onClose={() => { setIsFormOpen(false); setEditingArticle(null); }} onSubmit={handleSubmit} loading={isSubmitting} />
            )}
        </AdminLayout>
    );
};