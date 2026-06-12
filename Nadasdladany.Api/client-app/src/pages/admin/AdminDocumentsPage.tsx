import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { DocumentUploadForm } from '../../features/admin/documents/components/DocumentUploadForm';
import apiClient from '../../api/apiClient';
import { type DocumentFile } from '../../types/Municipality';
import { type PaginatedResult } from '../../api/articleService';
import { FileText, Plus, Trash2, Download, Folder } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminDocumentsPage = () => {
    const [documents, setDocuments] = useState<DocumentFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const loadDocuments = () => {
        setLoading(true);
        apiClient.get<PaginatedResult<DocumentFile>>('/documents', {
            params: { pageNumber: 1, pageSize: 100 }
        })
            .then(res => {
                setDocuments(res.data && Array.isArray(res.data.items) ? res.data.items : []);
            })
            .catch(() => toast.error("Hiba a dokumentumok betöltésekor"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        loadDocuments();
    }, []);

    const handleDelete = async (id: number) => {
        if (!window.confirm("Biztosan törölni szeretné ezt a dokumentumot?")) return;

        try {
            await apiClient.delete(`/documents/${id}`);
            toast.success("Dokumentum sikeresen törölve!");
            loadDocuments();
        } catch {
            toast.error("Nem sikerült törölni a dokumentumot.");
        }
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
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-accent text-primary font-bold px-6 py-3.5 rounded-full text-xs uppercase tracking-wider hover:bg-primary hover:text-white transition-all shadow-md h-fit w-fit cursor-pointer"
                >
                    <Plus size={16} /> Új dokumentum feltöltése
                </button>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="text-center py-20 font-serif italic text-accent text-lg animate-pulse">Dokumentumok betöltése...</div>
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
                                    <tr key={doc.id} className="hover:bg-gray-50/40 transition-colors">
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
                                                <Folder size={12} className="text-accent" /> {getCategoryName((doc as any).categoryId)}
                                            </span>
                                        </td>
                                        <td className="p-5 text-xs text-gray-400">
                                            {(doc as any).createdAt ? new Date((doc as any).createdAt).toLocaleDateString('hu-HU') : "N/A"}
                                        </td>
                                        <td className="p-5 text-right">
                                            <div className="flex justify-end gap-2">
                                                {(doc as any).fileUrl && (
                                                    <a
                                                        href={(doc as any).fileUrl} target="_blank" rel="noreferrer"
                                                        className="p-2.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-xl transition-colors"
                                                        title="Letöltés / Megtekintés"
                                                    >
                                                        <Download size={16} />
                                                    </a>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(doc.id)}
                                                    className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                                                    title="Dokumentum törlése"
                                                >
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
                    <div className="text-center py-20 text-gray-400 italic">
                        Nincsenek még feltöltött hivatali dokumentumok. Kattintson az "Új dokumentum feltöltése" gombra!
                    </div>
                )}
            </div>

            {isFormOpen && (
                <DocumentUploadForm
                    onClose={() => setIsFormOpen(false)}
                    onSuccess={loadDocuments}
                />
            )}
        </AdminLayout>
    );
};