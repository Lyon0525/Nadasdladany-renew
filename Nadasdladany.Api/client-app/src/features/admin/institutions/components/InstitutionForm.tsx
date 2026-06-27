import { useState } from 'react';
import { X, Upload, Loader2, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type Institution } from '../../../../api/institutionService';
import { getImageUrl } from '../../../../lib/imageUtils';
import { RichTextEditor } from '../../../../components/ui/RichTextEditor';
import toast from 'react-hot-toast';
import { OptimizedImage } from '../../../../components/ui/OptimizedImage';

const institutionSchema = z.object({
    name: z.string().min(1, "Az intézmény neve kötelező!").max(150),
    address: z.string().min(1, "A cím megadása kötelező!").max(255),
    leaderName: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().email("Érvénytelen e-mail formátum!").optional().or(z.literal('')),
    websiteUrl: z.string().url("Érvénytelen URL formátum!").optional().or(z.literal('')),
    openingHours: z.string().optional(),
    description: z.string().max(300, "Maximum 300 karakter!").optional(),
    content: z.string().optional(),
    displayOrder: z.coerce.number().int().default(0),
});

type InstitutionFormData = z.infer<typeof institutionSchema>;

interface Props {
    institution?: Institution | null;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    loading: boolean;
}

export const InstitutionForm = ({ institution, onClose, onSubmit, loading }: Props) => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<InstitutionFormData>({
        resolver: zodResolver(institutionSchema) as any,
        defaultValues: {
            name: institution?.name || '',
            address: institution?.address || '',
            leaderName: institution?.leaderName || '',
            phoneNumber: institution?.phoneNumber || '',
            email: institution?.email || '',
            websiteUrl: institution?.websiteUrl || '',
            openingHours: institution?.openingHours || '',
            description: institution?.description || '',
            content: institution?.content || '',
            displayOrder: institution?.displayOrder || 0,
        }
    });

    const contentValue = watch('content');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        institution?.imageUrl ? getImageUrl(institution.imageUrl) : null
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

    const onValidSubmit = (data: InstitutionFormData) => {
        const formData = new FormData();

        if (institution) formData.append('Id', institution.id.toString());
        formData.append('Name', data.name);
        formData.append('Address', data.address);
        formData.append('DisplayOrder', data.displayOrder.toString());

        if (data.description) formData.append('Description', data.description);
        if (data.leaderName) formData.append('LeaderName', data.leaderName);
        if (data.openingHours) formData.append('OpeningHours', data.openingHours);
        if (data.phoneNumber) formData.append('PhoneNumber', data.phoneNumber);
        if (data.email) formData.append('Email', data.email);
        if (data.websiteUrl) formData.append('WebsiteUrl', data.websiteUrl);
        if (data.content) formData.append('Content', data.content);
        if (image) formData.append('Image', image);

        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-end bg-primary/40 backdrop-blur-md">
            <div className="w-full max-w-3xl h-full bg-white shadow-2xl p-10 overflow-y-auto animate-in slide-in-from-right duration-500">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-primary">{institution ? 'Intézmény módosítása' : 'Intézmény rögzítése'}</h2>
                    </div>
                    <button type="button" onClick={onClose} className="p-3 hover:bg-secondary rounded-full text-primary/50 hover:text-primary transition-colors cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-6 pb-20">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Intézmény megnevezése *</label>
                        <input type="text" className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm ${errors.name ? 'border-red-400' : 'border-gray-100'}`} {...register('name')} />
                        {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.name.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Vezető / Igazgató neve</label>
                            <input type="text" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" {...register('leaderName')} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Megjelenítési sorrend</label>
                            <input type="number" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm text-accent font-bold" {...register('displayOrder')} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Cím / Elérhetőség *</label>
                            <input type="text" className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm ${errors.address ? 'border-red-400' : 'border-gray-100'}`} {...register('address')} />
                            {errors.address && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.address.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Telefonszám</label>
                            <input type="tel" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" {...register('phoneNumber')} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">E-mail cím</label>
                            <input type="email" className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm ${errors.email ? 'border-red-400' : 'border-gray-100'}`} {...register('email')} />
                            {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Külső Honlap URL</label>
                            <input type="url" className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm ${errors.websiteUrl ? 'border-red-400' : 'border-gray-100'}`} {...register('websiteUrl')} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Nyitvatartás / Ügyfélfogadás</label>
                            <textarea rows={3} className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm whitespace-pre-line" {...register('openingHours')} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Intézmény fotója (Borítókép)</label>
                            <div onDragOver={e => e.preventDefault()} onDragEnter={() => setIsDragging(true)} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} className={`relative h-24 border-2 border-dashed rounded-2xl flex items-center justify-center group transition-all overflow-hidden bg-white cursor-pointer ${isDragging ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-accent'}`}>
                                {imagePreview ? (
                                    <div className="flex items-center gap-3 w-full px-4">
                                        <OptimizedImage 
                                            src={imagePreview} 
                                            className="w-12 h-12 object-cover rounded-lg" 
                                            alt="" 
                                        />
                                        <span className="text-xs font-bold text-accent truncate">{image ? image.name : 'Jelenlegi borítókép'}</span>
                                        <Check className="ml-auto text-green-500" size={16} />
                                    </div>
                                ) : (
                                    <>
                                        <Upload className="text-gray-300 mr-2 group-hover:text-accent transition-colors" size={18} />
                                        <p className="text-xs text-gray-400 font-bold uppercase">Kép kiválasztása</p>
                                    </>
                                )}
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Rövid kivonat (Lista nézethez)</label>
                        <textarea rows={2} className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm ${errors.description ? 'border-red-400' : 'border-gray-100'}`} {...register('description')} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Részletes bemutatkozás (Aloldal tartalom)</label>
                        <div className={errors.content ? "rounded-3xl border border-red-400" : ""}>
                            <RichTextEditor content={contentValue || ''} onChange={(html) => setValue('content', html)} />
                        </div>
                    </div>

                    <div className="fixed bottom-0 right-0 w-full max-w-3xl p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer">Mégse</button>
                        <button type="submit" disabled={loading} className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl hover:bg-accent transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md cursor-pointer">
                            {loading ? <Loader2 className="animate-spin" /> : <>{institution ? 'Változtatások mentése' : 'Intézmény rögzítése'}</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};