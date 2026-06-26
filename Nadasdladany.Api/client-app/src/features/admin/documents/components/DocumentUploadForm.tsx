import { useState } from 'react';
import { X, Upload, Loader2, FileText, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { documentService } from '../../../../api/documentService';
import { type DocumentFile } from '../../../../types/Municipality';
import toast from 'react-hot-toast';

const documentSchema = z.object({
    title: z.string().min(1, "A dokumentum címe kötelező!").max(255),
    categoryId: z.string(),
    description: z.string().optional()
});

type DocumentFormData = z.infer<typeof documentSchema>;

interface Props {
    document?: DocumentFile | null;
    onClose: () => void;
    onSuccess: () => void;
}

export const DocumentUploadForm = ({ document, onClose, onSuccess }: Props) => {
    const { register, handleSubmit, formState: { errors } } = useForm<DocumentFormData>({
        resolver: zodResolver(documentSchema),
        defaultValues: {
            title: document?.title || '',
            categoryId: document?.documentCategoryId?.toString() || '1',
            description: document?.description || ''
        }
    });

    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => e.preventDefault();
    const handleDragEnter = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragging(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const onValidSubmit = async (data: DocumentFormData) => {
        if (!document && !file) {
            toast.error("Kérjük, válasszon ki egy fájlt a feltöltéshez!");
            return;
        }

        const formData = new FormData();
        if (document) formData.append('Id', document.id.toString());
        formData.append('Title', data.title);
        if (data.description) formData.append('Description', data.description);
        formData.append('CategoryId', data.categoryId);
        if (file) formData.append('File', file);

        setIsSubmitting(true);
        try {
            if (document) {
                await documentService.updateDocument(document.id, formData);
                toast.success("Dokumentum adatai sikeresen frissítve!");
            } else {
                await documentService.uploadDocument(formData);
                toast.success("Dokumentum sikeresen feltöltve!");
            }
            onSuccess();
            onClose();
        } catch (error: any) {
            const errorMsg = error.response?.data?.detail || error.response?.data?.message || "Hiba történt a mentés során.";
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-white h-full p-8 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-primary">{document ? 'Dokumentum módosítása' : 'Új dokumentum feltöltése'}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Adja meg a dokumentum adatait {document ? '(Fájl csere csak szükség esetén)' : 'és töltse fel a fájlt'}.</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-secondary cursor-pointer"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit(onValidSubmit)} className="flex-1 py-6 space-y-6 overflow-y-auto">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Dokumentum címe *</label>
                        <input
                            type="text"
                            className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm ${errors.title ? 'border-red-400' : 'border-gray-100'}`}
                            placeholder="Pl. 2026. évi költségvetési rendelet"
                            {...register('title')}
                        />
                        {errors.title && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.title.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Hivatali Kategória *</label>
                        <select className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm appearance-none" {...register('categoryId')}>
                            <option value="1">Önkormányzati rendeletek</option>
                            <option value="2">Hivatali űrlapok / Nyomtatványok</option>
                            <option value="3">Pályázati dokumentumok</option>
                            <option value="4">Jegyzőkönyvek / Közérdekű adatok</option>
                            <option value="5">Választási információk</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Rövid leírás (Opcionális)</label>
                        <textarea rows={3} className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" placeholder="A dokumentum tartalmának rövid összefoglalása..." {...register('description')} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                            {document ? 'Új fájl feltöltése (opcionális)' : 'Fájl kiválasztása *'}
                        </label>
                        <div
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer relative group overflow-hidden ${isDragging ? 'border-accent bg-accent/5 scale-[1.02]' : 'border-gray-200 hover:border-accent bg-secondary/20'
                                }`}
                        >
                            <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={handleFileChange} />

                            {file ? (
                                <div className="flex flex-col items-center gap-3 relative z-20 pointer-events-none">
                                    <div className="p-4 bg-white rounded-xl shadow-sm text-accent">
                                        <FileText size={32} />
                                    </div>
                                    <span className="text-sm font-bold text-primary max-w-full truncate px-4">{file.name}</span>
                                    <span className="text-xs text-accent font-bold px-3 py-1 bg-white rounded-full shadow-sm">{formatFileSize(file.size)}</span>
                                </div>
                            ) : document ? (
                                <div className="flex flex-col items-center gap-3 relative z-20 pointer-events-none">
                                    <div className="p-4 bg-white rounded-xl shadow-sm text-green-500">
                                        <Check size={32} />
                                    </div>
                                    <span className="text-sm font-bold text-gray-600">Jelenlegi fájl megmarad</span>
                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-1 group-hover:text-accent transition-colors">Új fájl húzása ide a cseréhez</span>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-2 py-4 pointer-events-none relative z-20">
                                    <Upload className={`transition-colors ${isDragging ? 'text-accent' : 'text-gray-300 group-hover:text-accent'}`} size={32} />
                                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-2">Kattintson vagy húzza ide a fájlt</span>
                                    <span className="text-[10px] text-gray-400">Támogatott formátumok: PDF, DOCX, XLSX, ZIP (Max 25 MB)</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl text-sm hover:bg-gray-200 cursor-pointer">Mégse</button>
                        <button type="submit" disabled={isSubmitting} className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl text-sm hover:bg-accent flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-md">
                            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : (document ? <Check size={16} /> : <Upload size={16} />)}
                            {isSubmitting ? "Mentés..." : (document ? "Változtatások Mentése" : "Feltöltés indítása")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};