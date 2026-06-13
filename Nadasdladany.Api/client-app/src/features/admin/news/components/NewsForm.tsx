import { useState } from 'react';
import { X, Upload, Loader2, Check } from 'lucide-react';
import { RichTextEditor } from '../../../../components/ui/RichTextEditor';

interface Props {
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    loading: boolean;
}

export const NewsForm = ({ onClose, onSubmit, loading }: Props) => {
    const [title, setTitle] = useState('');
    const [categoryId, setCategoryId] = useState('1');
    const [excerpt, setExcerpt] = useState('');
    const [content, setContent] = useState('<p>Írja ide a hír tartalmát...</p>');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('Title', title);
        formData.append('CategoryId', categoryId);
        formData.append('Excerpt', excerpt);
        formData.append('Content', content);
        if (image) {
            formData.append('FeaturedImageFile', image);
        }

        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-end bg-primary/40 backdrop-blur-md">
            <div className="w-full max-w-3xl h-full bg-white shadow-2xl p-10 overflow-y-auto animate-in slide-in-from-right duration-500">

                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-primary">Új hír közzététele</h2>
                        <p className="text-gray-400 text-sm mt-1">Töltse ki az alábbi mezőket a hír publikálásához.</p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-3 hover:bg-secondary rounded-full transition-colors text-primary/50 hover:text-primary"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8 pb-20">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">Hír címe</label>
                        <input
                            type="text"
                            required
                            className="w-full border-b-2 border-gray-100 focus:border-accent outline-none py-3 text-2xl font-serif text-primary placeholder:text-gray-200 transition-colors"
                            placeholder="Pl. Új játszótér épül a községben"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">Kategória</label>
                            <select
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent transition-all appearance-none"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                <option value="1">Közösségi hírek</option>
                                <option value="2">Önkormányzati hirdetmények</option>
                                <option value="3">Esemény beszámolók</option>
                                <option value="4">Kastély hírek</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">Borítókép</label>
                            <div className="relative h-16 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center group hover:border-accent transition-all overflow-hidden">
                                {imagePreview ? (
                                    <div className="flex items-center gap-3 w-full px-4">
                                        <img src={imagePreview} className="w-10 h-10 object-cover rounded-lg" alt="" />
                                        <span className="text-sm font-bold text-accent truncate">{image?.name}</span>
                                        <Check className="ml-auto text-green-500" size={18} />
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="text-gray-300 mr-2 group-hover:text-accent transition-colors" size={18} />
                                        <p className="text-xs text-gray-400 font-bold uppercase">Kép kiválasztása</p>
                                    </>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={handleImageChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">Rövid kivonat (Bevezető)</label>
                        <textarea
                            rows={3}
                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent transition-all text-sm leading-relaxed"
                            placeholder="Egy-két mondat, ami megjelenik a hírlistában..."
                            value={excerpt}
                            onChange={(e) => setExcerpt(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">Teljes tartalom</label>
                        <RichTextEditor
                            content={content}
                            onChange={(html: string) => setContent(html)}
                        />
                    </div>

                    <div className="fixed bottom-0 right-0 w-full max-w-3xl p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-colors"
                        >
                            Mégse
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl hover:bg-accent transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>Hír közzététele</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};