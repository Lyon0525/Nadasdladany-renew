import { useState } from 'react';
import { X, Upload, Loader2, Check } from 'lucide-react';
import { RichTextEditor } from '../../../../components/ui/RichTextEditor';
import { type Article } from '../../../../types/Article';
import { getImageUrl } from '../../../../lib/imageUtils';
import toast from 'react-hot-toast';

interface Props {
    article?: Article | null;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    loading: boolean;
}

export const NewsForm = ({ article, onClose, onSubmit, loading }: Props) => {
    const [title, setTitle] = useState(article?.title || '');
    const [categoryId, setCategoryId] = useState(article ? (article as any).categoryId?.toString() || '1' : '1');
    const [excerpt, setExcerpt] = useState(article?.excerpt || '');

    const [content, setContent] = useState(article?.content || '');

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        article?.featuredImageUrl ? getImageUrl(article.featuredImageUrl) : null
    );

    const [isDragging, setIsDragging] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            processFile(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); };
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false);
    };
    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                processFile(file);
            } else {
                toast.error("Kérjük, csak képfájlt (jpg, png, webp) húzzon ide!");
            }
        }
    };

    const processFile = (file: File) => {
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();

        if (article) {
            formData.append('Id', article.id.toString());
        }

        formData.append('Title', title);
        formData.append('CategoryId', categoryId);
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
                        <h2 className="text-3xl font-serif font-bold text-primary">
                            {article ? 'Hír szerkesztése' : 'Új hír közzététele'}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            {article ? 'Módosítsa a meglévő hír adatait.' : 'Töltse ki az alábbi mezőket a hír publikálásához.'}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-3 hover:bg-secondary rounded-full transition-colors text-primary/50 hover:text-primary cursor-pointer"
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
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent transition-all appearance-none cursor-pointer"
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

                            <div
                                onDragOver={handleDragOver}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center transition-all cursor-pointer group overflow-hidden ${isDragging ? 'border-accent bg-accent/5 scale-[1.01]' : 'border-gray-200 hover:border-accent'}`}
                            >
                                {imagePreview ? (
                                    <div className="flex flex-col items-center gap-3 w-full">
                                        <img src={imagePreview} className="w-20 h-20 object-cover rounded-xl shadow-sm border border-gray-100" alt="" />
                                        <span className="text-xs font-bold text-accent truncate max-w-full px-4 text-center">
                                            {image ? image.name : 'Jelenlegi borítókép'}
                                        </span>
                                        <Check className="text-green-500" size={20} />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 pointer-events-none py-2">
                                        <Upload className={`transition-colors ${isDragging ? 'text-accent' : 'text-gray-300 group-hover:text-accent'}`} size={28} />
                                        <p className={`text-[10px] font-bold uppercase transition-colors text-center mt-2 ${isDragging ? 'text-accent' : 'text-gray-400 group-hover:text-accent'}`}>
                                            Kattintson vagy húzza ide a képet
                                        </p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
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
                            className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer"
                        >
                            Mégse
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl hover:bg-accent transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin" />
                            ) : (
                                <>{article ? 'Változtatások mentése' : 'Hír közzététele'}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};