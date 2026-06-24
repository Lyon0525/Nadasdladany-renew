import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import apiClient from '../../../../api/apiClient';
import toast from 'react-hot-toast';

const documentSchema = z.object({
    title: z.string().min(1, "A dokumentum címe kötelező!").max(255),
    categoryId: z.string(),
    description: z.string().optional()
});

type DocumentFormData = z.infer<typeof documentSchema>;

interface Props {
    onClose: () => void;
    onSuccess: () => void;
}

export const DocumentUploadForm = ({ onClose, onSuccess }: Props) => {
    const { register, handleSubmit, formState: { errors } } = useForm<DocumentFormData>({
        resolver: zodResolver(documentSchema),
        defaultValues: { categoryId: '1' }
    });

    const [file, setFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const onValidSubmit = async (data: DocumentFormData) => {
        if (!file) {
            toast.error("Kérjük, válasszon ki egy fájlt a feltöltéshez!");
            return;
        }

        const formData = new FormData();
        formData.append('Title', data.title);
        if (data.description) formData.append('Description', data.description);
        formData.append('CategoryId', data.categoryId);
        formData.append('File', file);

        setIsSubmitting(true);
        try {
            await apiClient.post('/documents', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Dokumentum sikeresen feltöltve!");
            onSuccess();
            onClose();
        } catch {
            toast.error("Hiba történt a dokumentum feltöltése során.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-white h-full p-8 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-primary">Új dokumentum feltöltése</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Adja meg a dokumentum adatait és töltse fel a fájlt.</p>
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
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Fájl kiválasztása *</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center hover:border-accent transition-colors bg-secondary/20 relative">
                            <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileChange} />
                            <Upload className="mx-auto text-gray-400 mb-2" size={24} />
                            <span className="text-xs text-gray-500 font-medium block">
                                {file ? `Kiválasztott fájl: ${file.name}` : "Kattintson ide vagy húzza ide a fájlt"}
                            </span>
                            {file && <span className="text-[10px] text-accent font-bold mt-1 block">{(file.size / 1024 / 1024).toFixed(2)} MB</span>}
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-600 font-bold py-4 rounded-2xl text-sm hover:bg-gray-200 cursor-pointer">Mégse</button>
                        <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-white font-bold py-4 rounded-2xl text-sm hover:bg-accent flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
                            {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                            {isSubmitting ? "Feltöltés..." : "Feltöltés indítása"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};