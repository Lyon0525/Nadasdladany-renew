import { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { DocumentUploadForm } from '../../features/admin/documents/components/DocumentUploadForm';
import apiClient from '../../api/apiClient';
import { type DocumentFile } from '../../types/Municipality';
import { type PaginatedResult } from '../../api/articleService';
import { FileText, Plus, Trash2, Download, Folder, Loader2, Edit2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const AdminDocumentsPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingDoc, setEditingDoc] = useState<DocumentFile | null>(null);

    const { data: documents = [], refetch, isLoading } = useQuery({
        queryKey: ['adminDocuments'],
        queryFn: async () => {
            const res = await apiClient.get<PaginatedResult<DocumentFile>>('/documents', {
                params: { pageNumber: 1, pageSize: 100 }
            });
            return res.data && Array.isArray(res.data.items) ? res.data.items : [];
        }
    });

    const handleDelete = async (id: number) => {
        if (!window.confirm("Biztosan törölni szeretné ezt a dokumentumot?")) return;
        try {
            await apiClient.delete(`/documents/${id}`);
            toast.success("Dokumentum sikeresen törölve!");
            refetch();
        } catch {
            toast.error("Nem sikerült törölni a dokumentumot.");
        }
    };

    const handleOpenNew = () => {
        setEditingDoc(null);
        setIsFormOpen(true);
    };

    const handleEdit = (doc: DocumentFile) => {
        setEditingDoc(doc);
        setIsFormOpen(true);
    };

    const getCategoryName = (id: number) => {
        switch (id) {
            case 1: return "Rendelet";
            case 2: return "Hivatali űrlap";
            case 3: return "Pályázat";
            case 4: return "Közérdekű / Jegyzőkönyv";
            case 5: return "Választás";
            default: return "Egyéb";
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-primary">Hivatali Dokumentumok</h1>
                    <p className="text-gray-400 mt-1">Önkormányzati rendeletek, költségvetések és nyomtatványok kezelése.</p>
                </div>
                <button onClick={handleOpenNew} className="flex items-center gap-2 bg-accent text-primary font-bold px-6 py-3.5 rounded-full text-xs uppercase tracking-wider hover:bg-primary hover:text-white transition-all shadow-md cursor-pointer">
                    <Plus size={16} /> Új dokumentum
                </button>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" size={32} /></div>
                ) : documents.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="bg-secondary/60 text-primary font-bold border-b border-gray-100">
                                    <th className="p-5">Dokumentum megnevezése</th>
                                    <th className="p-5">Kategória</th>
                                    <th className="p-5">Feltöltve</th>
                                    <th className="p-5 text-right">Műveletek</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 text-gray-600 font-medium">
                                {documents.map((doc) => (
                                    <tr key={doc.id} className="hover:bg-gray-50/40 transition-colors group">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2.5 bg-gray-50 rounded-xl text-primary"><FileText size={18} /></div>
                                                <div>
                                                    <span className="font-bold text-primary block text-base">{doc.title}</span>
                                                    {doc.description && <span className="text-xs text-gray-400 block mt-0.5 line-clamp-1">{doc.description}</span>}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className="text-xs bg-secondary text-primary font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                                                {/* JAVÍTVA: doc.categoryId helyett doc.documentCategoryId */}
                                                <Folder size={12} className="text-accent" /> {getCategoryName(doc.documentCategoryId)}
                                            </span>
                                        </td>
                                        <td className="p-5 text-xs text-gray-400">
                                            {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('hu-HU') : "N/A"}
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {(doc as any).fileUrl || doc.filePath ? (
                                                    <a href={(doc as any).fileUrl || doc.filePath} target="_blank" rel="noreferrer" className="p-2.5 text-gray-400 hover:text-accent hover:bg-gray-100 rounded-xl transition-colors cursor-pointer" title="Letöltés / Megtekintés">
                                                        <Download size={16} />
                                                    </a>
                                                ) : null}
                                                <button onClick={() => handleEdit(doc)} className="p-2.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-xl transition-colors cursor-pointer" title="Szerkesztés">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(doc.id)} className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer" title="Törlés">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400 italic">Nincsenek még feltöltött hivatali dokumentumok.</div>
                )}
            </div>

            {isFormOpen && <DocumentUploadForm document={editingDoc} onClose={() => setIsFormOpen(false)} onSuccess={() => refetch()} />}
        </AdminLayout>
    );
};