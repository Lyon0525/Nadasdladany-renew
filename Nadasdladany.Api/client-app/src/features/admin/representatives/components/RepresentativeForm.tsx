import { useState } from 'react';
import { X, Upload, Loader2, Check } from 'lucide-react';
import { type Representative } from '../../../../types/Municipality';
import { getImageUrl } from '../../../../lib/imageUtils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { OptimizedImage } from '../../../../components/ui/OptimizedImage';

const repSchema = z.object({
    name: z.string().min(1, "A név megadása kötelező!").max(150),
    role: z.string(),
    customTitleOverride: z.string().optional(),
    email: z.string().email("Érvénytelen e-mail cím!").optional().or(z.literal('')),
    phoneNumber: z.string().optional(),
    receptionHoursInfo: z.string().optional(),
    displayOrder: z.coerce.number().int().default(10),
    biography: z.string().optional()
});

type RepFormData = z.infer<typeof repSchema>;

interface Props {
    representative?: Representative | null;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    loading: boolean;
}

export const RepresentativeForm = ({ representative, onClose, onSubmit, loading }: Props) => {
    const { register, handleSubmit, formState: { errors } } = useForm<RepFormData>({
        resolver: zodResolver(repSchema) as any,
        defaultValues: {
            name: representative?.name || '',
            role: representative?.role?.toString() || '2',
            customTitleOverride: representative?.customTitleOverride || '',
            email: representative?.email || '',
            phoneNumber: representative?.phoneNumber || '',
            receptionHoursInfo: representative?.receptionHoursInfo || '',
            displayOrder: representative?.displayOrder || 10,
            biography: representative?.biography || ''
        }
    });

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(
        representative?.imageUrl ? getImageUrl(representative.imageUrl) : null
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

    const onValidSubmit = (data: RepFormData) => {
        const formData = new FormData();

        if (representative) formData.append('Id', representative.id.toString());
        formData.append('Name', data.name);
        formData.append('Role', data.role);
        formData.append('DisplayOrder', data.displayOrder.toString());

        if (data.customTitleOverride) formData.append('CustomTitleOverride', data.customTitleOverride);
        if (data.email) formData.append('Email', data.email);
        if (data.phoneNumber) formData.append('PhoneNumber', data.phoneNumber);
        if (data.receptionHoursInfo) formData.append('ReceptionHoursInfo', data.receptionHoursInfo);
        if (data.biography) formData.append('Biography', data.biography);
        if (image) formData.append('Image', image);

        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-end bg-primary/40 backdrop-blur-md">
            <div className="w-full max-w-2xl h-full bg-white shadow-2xl p-10 overflow-y-auto animate-in slide-in-from-right duration-500">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-primary">
                            {representative ? 'Személy szerkesztése' : 'Új személy felvétele'}
                        </h2>
                    </div>
                    <button type="button" onClick={onClose} className="p-3 hover:bg-secondary rounded-full text-primary/50 cursor-pointer hover:text-primary transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-6 pb-20">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Teljes Név *</label>
                            <input
                                type="text"
                                className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm font-medium ${errors.name ? 'border-red-400' : 'border-gray-100'}`}
                                {...register('name')}
                            />
                            {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Hivatali Szerepkör</label>
                            <select className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm font-bold text-primary cursor-pointer" {...register('role')}>
                                <option value="0">Polgármester</option>
                                <option value="1">Alpolgármester</option>
                                <option value="2">Képviselő</option>
                                <option value="3">Jegyző</option>
                                <option value="4">Bizottsági tag</option>
                                <option value="5">Hivatali vezető</option>
                                <option value="6">Munkatárs</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Egyedi titulus (Opcionális)</label>
                            <input type="text" placeholder="Pl. Bizottsági Elnök" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" {...register('customTitleOverride')} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Portré fotó</label>
                        <div
                            onDragOver={(e) => e.preventDefault()}
                            onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false); }}
                            onDrop={handleDrop}
                            className={`relative border-2 border-dashed rounded-2xl p-4 flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${isDragging ? 'border-accent bg-accent/5' : 'border-gray-200'}`}
                        >
                            {imagePreview ? (
                                <div className="flex items-center gap-4 w-full px-4">
                                    <OptimizedImage 
                                        src={imagePreview} 
                                        className="w-16 h-16 object-cover rounded-full shadow-sm border border-gray-100" 
                                        alt="" 
                                    />
                                    <span className="text-xs font-bold text-accent truncate">{image ? image.name : 'Jelenlegi fotó'}</span>
                                    <Check className="text-green-500 ml-auto" size={18} />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-1 py-4">
                                    <Upload className="text-gray-300" size={24} />
                                    <p className="text-[10px] font-bold uppercase text-gray-400 mt-2">Fotó feltöltése vagy ide húzása</p>
                                </div>
                            )}
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={handleImageChange} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Telefonszám</label>
                            <input type="text" placeholder="Pl. +36 20 123 4567" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" {...register('phoneNumber')} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">E-mail cím</label>
                            <input type="email" placeholder="nev@nadasdladany.hu" className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm ${errors.email ? 'border-red-400' : 'border-gray-100'}`} {...register('email')} />
                            {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.email.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Fogadóóra / Ügyfélfogadás</label>
                            <input type="text" placeholder="Pl. Minden hónap első kedd" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" {...register('receptionHoursInfo')} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Sorrend (Megjelenéshez)</label>
                            <input type="number" title="Kisebb szám van elöl (1=Polgármester)" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm font-bold text-accent" {...register('displayOrder')} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Bemutatkozás / Életrajz</label>
                        <textarea rows={5} placeholder="Pár mondatos bemutatkozás a lakosság felé..." className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm leading-relaxed" {...register('biography')} />
                    </div>

                    <div className="fixed bottom-0 right-0 w-full max-w-2xl p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 cursor-pointer transition-colors">Mégse</button>
                        <button type="submit" disabled={loading} className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl hover:bg-accent transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50">
                            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                            {loading ? "Mentés folyamatban..." : "Személy rögzítése"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};