import { useState } from 'react';
import { X, Upload, Loader2, Check } from 'lucide-react';

interface Props {
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    loading: boolean;
}

export const DocumentForm = ({ onClose, onSubmit, loading }: Props) => {
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('1');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        if (selectedFile) {
            setFile(selectedFile);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        const formData = new FormData();
        formData.append('Title', title);
        formData.append('CategoryId', categoryId);
        formData.append('Description', description);
        formData.append('File', file);

        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-end bg-primary/40 backdrop-blur-md">
            <div className="w-full max-w-xl h-full bg-white shadow-2xl p-10 overflow-y-auto animate-in slide-in-from-right duration-500">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-primary">Dokumentum feltöltése</h2>
                        <p className="text-gray-400 text-sm mt-1">Töltsön fel hirdetményt, rendeletet vagy nyomtatványt.</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-3 hover:bg-secondary rounded-full text-primary/50 hover:text-primary">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Dokumentum megnevezése</label>
                        <input
                            type="text" required
                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                            placeholder="Pl. 2026. évi Költségvetési rendelet tervezet"
                            value={title} onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Kategória</label>
                        <select
                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm appearance-none"
                            value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="1">Önkormányzati rendeletek</option>
                            <option value="2">Hivatali nyomtatványok / Űrlapok</option>
                            <option value="3">Pályázati dokumentációk</option>
                            <option value="4">Közérdekű adatok / Jegyzőkönyvek</option>
                            <option value="5">Választási közlemények és határozatok</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Rövid leírás (Opcionális)</label>
                        <textarea
                            rows={3} className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                            placeholder="A fájl tartalmának rövid magyarázata..."
                            value={description} onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Fájl kiválasztása (PDF, DOCX, XLSX, ZIP)</label>
                        <div className="relative h-32 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center group hover:border-accent transition-all overflow-hidden bg-gray-50/30">
                            {file ? (
                                <div className="text-center p-4">
                                    <Check className="text-green-500 mx-auto mb-2" size={28} />
                                    <p className="text-sm font-bold text-primary truncate max-w-xs">{file.name}</p>
                                    <p className="text-xs text-gray-400 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                            ) : (
                                <>
                                    <Upload className="text-gray-300 mb-2 group-hover:text-accent transition-colors" size={28} />
                                    <p className="text-xs text-gray-400 font-bold uppercase">Kattintson vagy húzza ide a fájlt</p>
                                </>
                            )}
                            <input type="file" required className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50">Mégse</button>
                        <button
                            type="submit" disabled={loading || !file}
                            className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl hover:bg-accent transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Fájl feltöltése</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};