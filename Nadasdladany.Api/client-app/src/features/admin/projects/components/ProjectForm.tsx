import { useState } from 'react';
import { X, Upload, Loader2, Check } from 'lucide-react';
import { RichTextEditor } from '../../../../components/ui/RichTextEditor';

interface Props {
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    loading: boolean;
}

export const ProjectForm = ({ onClose, onSubmit, loading }: Props) => {
    const [title, setTitle] = useState('');
    const [projectCode, setProjectCode] = useState('');
    const [totalFunding, setTotalFunding] = useState('');
    const [supportRate, setSupportRate] = useState('100%');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('<p>Írja ide a pályázat leírását, részleteit...</p>');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('Title', title);
        formData.append('ProjectCode', projectCode);
        formData.append('TotalFunding', totalFunding);
        formData.append('SupportRate', supportRate);
        formData.append('Excerpt', excerpt);
        formData.append('Content', content);
        if (image) {
            formData.append('Image', image);
        }
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-end bg-primary/40 backdrop-blur-md">
            <div className="w-full max-w-3xl h-full bg-white shadow-2xl p-10 overflow-y-auto animate-in slide-in-from-right duration-500">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-primary">Új pályázat rögzítése</h2>
                        <p className="text-gray-400 text-sm mt-1">Adja meg a nyertes projekt hivatalos adatait.</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-3 hover:bg-secondary rounded-full text-primary/50 hover:text-primary">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">Projekt megnevezése</label>
                        <input
                            type="text" required
                            className="w-full border-b-2 border-gray-100 focus:border-accent outline-none py-3 text-xl font-serif text-primary placeholder:text-gray-200 transition-colors"
                            placeholder="Pl. Belterületi utak felújítása Nádasdladányban"
                            value={title} onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Pályázati azonosító (Kód)</label>
                            <input
                                type="text" placeholder="Pl. MFP-UFT/2026"
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent"
                                value={projectCode} onChange={(e) => setProjectCode(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Támogatás összege</label>
                            <input
                                type="text" placeholder="Pl. 24 500 000 Ft"
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent"
                                value={totalFunding} onChange={(e) => setTotalFunding(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Támogatási intenzitás</label>
                            <input
                                type="text" placeholder="Pl. 100%"
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent"
                                value={supportRate} onChange={(e) => setSupportRate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Kiemelt kép</label>
                            <div className="relative h-14 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center group hover:border-accent transition-all overflow-hidden bg-white">
                                {imagePreview ? (
                                    <div className="flex items-center gap-3 w-full px-4">
                                        <img src={imagePreview} className="w-8 h-8 object-cover rounded-lg" alt="" />
                                        <span className="text-xs font-bold text-accent truncate">{image?.name}</span>
                                        <Check className="ml-auto text-green-500" size={16} />
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="text-gray-300 mr-2 group-hover:text-accent" size={16} />
                                        <p className="text-xs text-gray-400 font-bold uppercase">Fájl kiválasztása</p>
                                    </>
                                )}
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Rövid kivonat (Bevezető)</label>
                        <textarea
                            rows={2} className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                            placeholder="A főoldalon és listákban megjelenő rövid összefoglaló..."
                            value={excerpt} onChange={(e) => setExcerpt(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Részletes leírás és tájékoztató</label>
                        <RichTextEditor content={content} onChange={(html: string) => setContent(html)} />
                    </div>

                    <div className="fixed bottom-0 right-0 w-full max-w-3xl p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50">Mégse</button>
                        <button
                            type="submit" disabled={loading}
                            className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl hover:bg-accent transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Mentés és Közzététel</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};