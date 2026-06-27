import { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import type { Article } from '../../types/Article';
import { AdminNewsList } from '../../features/admin/news/components/AdminNewsList';
import { NewsForm } from '../../features/admin/news/components/NewsForm';
import { Plus, Loader2 } from 'lucide-react';
import { useArticles, useSaveArticle, useDeleteArticle } from '../../hooks/useArticles';

export const AdminNewsPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);

    const { data: articlesData, isLoading } = useArticles(1, 100);
    const saveArticle = useSaveArticle();
    const deleteArticle = useDeleteArticle();

    const articles = articlesData?.items || [];

    const handleDelete = async (id: number) => {
        if (window.confirm('Biztosan törölni szeretné ezt a hírt?')) {
            await deleteArticle.mutateAsync(id);
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
        await saveArticle.mutateAsync({ id: editingArticle?.id, formData });
        setIsFormOpen(false);
        setEditingArticle(null);
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-12">
                <h1 className="text-4xl font-serif font-bold text-primary">Hírek kezelése</h1>
                <button
                    onClick={handleOpenNew}
                    className="flex items-center gap-2 bg-accent text-primary font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-lg cursor-pointer"
                >
                    <Plus size={20} /> Új hír
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-accent" size={32} />
                </div>
            ) : (
                <AdminNewsList
                    articles={articles}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            )}

            {isFormOpen && (
                <NewsForm
                    article={editingArticle}
                    onClose={() => { setIsFormOpen(false); setEditingArticle(null); }}
                    onSubmit={handleSubmit}
                    loading={saveArticle.isPending}
                />
            )}
        </AdminLayout>
    );
};