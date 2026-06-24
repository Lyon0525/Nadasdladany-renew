import { useState } from 'react';
import { X, Upload, Loader2, Check } from 'lucide-react';
import { type Organization } from '../../../../api/organizationService';
import { getImageUrl } from '../../../../lib/imageUtils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const orgSchema = z.object({
    name: z.string().min(1, "A szervezet neve kötelező!").max(200),
    type: z.string(),
    leaderName: z.string().optional(),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().email("Érvénytelen e-mail cím!").optional().or(z.literal('')),
    websiteUrl: z.string().url("Érvénytelen weboldal cím!").optional().or(z.literal('')),
    description: z.string().optional(),
    displayOrder: z.coerce.number().int().default(10)
});

type OrgFormData = z.infer<typeof orgSchema>;

interface Props {
    organization?: Organization | null;
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<void>;
    loading: boolean;
}

export const OrganizationForm = ({ organization, onClose, onSubmit, loading }: Props) => {
    const { register, handleSubmit, formState: { errors } } = useForm<OrgFormData>({
        resolver: zodResolver(orgSchema) as any,
        defaultValues: {
            name: organization?.name || '',
            type: organization?.type?.toString() || '0',
            leaderName: organization?.leaderName || '',
            address: organization?.address || '',
            phoneNumber: organization?.phoneNumber || '',
            email: organization?.email || '',
            websiteUrl: organization?.websiteUrl || '',
            description: organization?.description || '',
            displayOrder: organization?.displayOrder || 10
        }
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(organization?.imageUrl ? getImageUrl(organization.imageUrl) : null);
    const [isDragging, setIsDragging] = useState(false);

    const processFile = (file: File) => {
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
    };

    const onValidSubmit = async (data: OrgFormData) => {
        const formData = new FormData();
        if (organization) formData.append('Id', organization.id.toString());

        formData.append('Name', data.name);
        formData.append('Type', data.type);
        formData.append('DisplayOrder', data.displayOrder.toString());

        if (data.leaderName) formData.append('LeaderName', data.leaderName);
        if (data.address) formData.append('Address', data.address);
        if (data.phoneNumber) formData.append('PhoneNumber', data.phoneNumber);
        if (data.email) formData.append('Email', data.email);
        if (data.websiteUrl) formData.append('WebsiteUrl', data.websiteUrl);
        if (data.description) formData.append('Description', data.description);
        if (imageFile) formData.append('Image', imageFile);

        await onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-white h-full p-8 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-primary">{organization ? 'Szervezet módosítása' : 'Új szervezet rögzítése'}</h3>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-secondary cursor-pointer"><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit(onValidSubmit)} className="flex-1 py-6 space-y-5 overflow-y-auto pr-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Szervezet Neve *</label>
                            <input type="text" className={`w-full bg-secondary/50 border p-3.5 rounded-2xl outline-none focus:border-accent text-sm font-medium ${errors.name ? 'border-red-400' : 'border-gray-100'}`} {...register('name')} />
                            {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Típus *</label>
                            <select className="w-full bg-secondary/50 border border-gray-100 p-3.5 rounded-2xl outline-none focus:border-accent text-sm font-bold" {...register('type')}>
                                <option value="0">Civil Szervezet</option>
                                <option value="1">Történelmi Egyház</option>
                                <option value="2">Alapítvány</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Képviselő neve</label>
                            <input type="text" className="w-full bg-secondary/50 border border-gray-100 p-3.5 rounded-2xl outline-none focus:border-accent text-sm" {...register('leaderName')} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Székhely</label>
                        <input type="text" className="w-full bg-secondary/50 border border-gray-100 p-3.5 rounded-2xl outline-none focus:border-accent text-sm" {...register('address')} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Telefonszám</label>
                            <input type="tel" className="w-full bg-secondary/50 border border-gray-100 p-3.5 rounded-2xl outline-none focus:border-accent text-sm" {...register('phoneNumber')} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">E-mail</label>
                            <input type="email" className={`w-full bg-secondary/50 border p-3.5 rounded-2xl outline-none focus:border-accent text-sm ${errors.email ? 'border-red-400' : 'border-gray-100'}`} {...register('email')} />
                            {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.email.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Weboldal URL</label>
                            <input type="url" className={`w-full bg-secondary/50 border p-3.5 rounded-2xl outline-none focus:border-accent text-sm ${errors.websiteUrl ? 'border-red-400' : 'border-gray-100'}`} {...register('websiteUrl')} />
                            {errors.websiteUrl && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.websiteUrl.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Sorrend</label>
                            <input type="number" className="w-full bg-secondary/50 border border-gray-100 p-3.5 rounded-2xl outline-none focus:border-accent text-sm text-accent font-bold" {...register('displayOrder')} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Bemutatkozás</label>
                        <textarea rows={3} className="w-full bg-secondary/50 border border-gray-100 p-3.5 rounded-2xl outline-none focus:border-accent text-sm" {...register('description')} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Logó vagy Borítókép</label>
                        <div onDragOver={(e) => e.preventDefault()} onDragEnter={() => setIsDragging(true)} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} className={`relative border-2 border-dashed rounded-2xl p-5 text-center transition-all overflow-hidden cursor-pointer group ${isDragging ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-accent'}`}>
                            {imagePreview ? (
                                <div className="flex items-center gap-4 w-full">
                                    <img src={imagePreview} className="w-12 h-12 object-cover rounded-xl" alt="" />
                                    <span className="text-xs font-bold text-accent truncate">{imageFile ? imageFile.name : 'Jelenlegi logó'}</span>
                                    <Check className="text-green-500 ml-auto" size={18} />
                                </div>
                            ) : (
                                <div className="flex flex-col items-center py-2">
                                    <Upload className="mx-auto mb-2 text-gray-400 group-hover:text-accent" size={24} />
                                    <span className="text-xs font-medium text-gray-500">Kattintson vagy húzza ide a fájlt</span>
                                </div>
                            )}
                            <input type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => { if (e.target.files && e.target.files[0]) processFile(e.target.files[0]); }} />
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-4 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-600 font-bold py-3.5 rounded-2xl text-sm hover:bg-gray-200 cursor-pointer">Mégse</button>
                        <button type="submit" disabled={loading} className="flex-[2] bg-primary text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-accent flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50">
                            {loading ? <Loader2 className="animate-spin" size={16} /> : null} Mentés
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};