import { useState } from 'react';
import { X, Upload, Loader2, Check } from 'lucide-react';
import { RichTextEditor } from '../../../../components/ui/RichTextEditor';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type Project } from '../../../../api/projectService';
import { getImageUrl } from '../../../../lib/imageUtils';
import toast from 'react-hot-toast';
import { OptimizedImage } from '../../../../components/ui/OptimizedImage';

const projectSchema = z.object({
    title: z.string().min(1, "A projekt neve kötelező!").max(250),
    projectCode: z.string().optional(),
    totalFunding: z.string().optional(),
    supportRate: z.string().optional(),
    excerpt: z.string().max(500).optional(),
    content: z.string().min(5, "A tartalom kötelező!")
});

type ProjectFormData = z.infer<typeof projectSchema>;

interface Props {
    project?: Project | null;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    loading: boolean;
}

export const ProjectForm = ({ project, onClose, onSubmit, loading }: Props) => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProjectFormData>({
        resolver: zodResolver(projectSchema),
        defaultValues: {
            title: project?.title || '',
            projectCode: project?.projectCode || '',
            totalFunding: project?.totalFunding || '',
            supportRate: project?.supportRate || '100%',
            excerpt: project?.excerpt || '',
            content: project?.content || ''
        }
    });

    const contentValue = watch('content');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        project?.featuredImageUrl ? getImageUrl(project.featuredImageUrl) : null
    );
    const [isDragging, setIsDragging] = useState(false);

    const processFile = (file: File) => {
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) processFile(e.target.files[0]);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) processFile(file);
            else toast.error("Kérjük, csak képfájlt húzzon ide!");
        }
    };

    const onValidSubmit = (data: ProjectFormData) => {
        const formData = new FormData();
        if (project) formData.append('Id', project.id.toString());
        formData.append('Title', data.title);
        formData.append('Content', data.content);
        if (data.projectCode) formData.append('ProjectCode', data.projectCode);
        if (data.totalFunding) formData.append('TotalFunding', data.totalFunding);
        if (data.supportRate) formData.append('SupportRate', data.supportRate);
        if (data.excerpt) formData.append('Excerpt', data.excerpt);
        if (image) formData.append('Image', image);
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-end bg-primary/40 backdrop-blur-md">
            <div className="w-full max-w-3xl h-full bg-white shadow-2xl p-10 overflow-y-auto animate-in slide-in-from-right duration-500">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-primary">{project ? 'Pályázat szerkesztése' : 'Új pályázat rögzítése'}</h2>
                    </div>
                    <button type="button" onClick={onClose} className="p-3 hover:bg-secondary rounded-full text-primary/50 cursor-pointer"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-8 pb-20">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 ml-1">Projekt megnevezése *</label>
                        <input
                            type="text"
                            className={`w-full border-b-2 py-3 text-xl font-serif text-primary outline-none transition-colors ${errors.title ? 'border-red-400' : 'border-gray-100 focus:border-accent'}`}
                            {...register('title')}
                        />
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Pályázati azonosító (Kód)</label>
                            <input type="text" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent" {...register('projectCode')} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Támogatás összege</label>
                            <input type="text" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent" {...register('totalFunding')} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Támogatási intenzitás</label>
                            <input type="text" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent" {...register('supportRate')} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Kiemelt kép</label>
                            <div
                                onDragOver={(e) => e.preventDefault()}
                                onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                                onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false); }}
                                onDrop={handleDrop}
                                className={`relative h-14 border-2 border-dashed rounded-2xl flex items-center justify-center group hover:border-accent overflow-hidden transition-all cursor-pointer ${isDragging ? 'border-accent bg-accent/5' : 'border-gray-200'}`}
                            >
                                {imagePreview ? (
                                    <div className="flex items-center gap-3 px-4 w-full">
                                        <OptimizedImage 
                                            src={imagePreview} 
                                            className="w-8 h-8 object-cover rounded-lg" 
                                            alt="" 
                                        />
                                        <span className="text-xs font-bold text-accent truncate">{image ? image.name : 'Jelenlegi kép'}</span>
                                        <Check className="ml-auto text-green-500" size={16} />
                                    </div>
                                ) : (
                                    <><Upload className="text-gray-300 mr-2 group-hover:text-accent" size={16} /><p className="text-xs text-gray-400 font-bold uppercase">Fájl kiválasztása</p></>
                                )}
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Rövid kivonat</label>
                        <textarea rows={2} className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" {...register('excerpt')} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Részletes leírás *</label>
                        <div className={errors.content ? "rounded-3xl border border-red-400" : ""}>
                            <RichTextEditor
                                content={contentValue}
                                onChange={(html) => setValue('content', html, { shouldValidate: true })}
                                placeholder="Írja ide a pályázat leírását..."
                            />
                        </div>
                        {errors.content && <p className="text-red-500 text-xs mt-2">{errors.content.message}</p>}
                    </div>

                    <div className="fixed bottom-0 right-0 w-full max-w-3xl p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 cursor-pointer">Mégse</button>
                        <button type="submit" disabled={loading} className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl hover:bg-accent flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50">
                            {loading ? <Loader2 className="animate-spin" /> : <>{project ? 'Változtatások mentése' : 'Mentés és Közzététel'}</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};