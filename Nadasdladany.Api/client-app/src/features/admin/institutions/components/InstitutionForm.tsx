import { useState } from 'react';
import { X, Upload, Loader2, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const institutionSchema = z.object({
    name: z.string().min(1, "Az intézmény neve kötelező!").max(150, "Maximum 150 karakter lehet."),
    address: z.string().min(1, "A cím megadása kötelező!").max(255),
    leaderName: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().email("Érvénytelen e-mail formátum!").optional().or(z.literal('')),
    websiteUrl: z.string().url("Érvénytelen URL formátum! (pl. https://...)").optional().or(z.literal('')),
    openingHours: z.string().optional(),
    description: z.string().max(300, "A rövid kivonat maximum 300 karakter lehet!").optional(),
    content: z.string().optional(),
    displayOrder: z.coerce.number().int().default(0),
});

type InstitutionFormData = z.infer<typeof institutionSchema>;

interface Props {
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    loading: boolean;
}

export const InstitutionForm = ({ onClose, onSubmit, loading }: Props) => {
    const { register, handleSubmit, formState: { errors } } = useForm<InstitutionFormData>({
        resolver: zodResolver(institutionSchema) as any,
        defaultValues: {
            displayOrder: 0
        }
    });

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const onValidSubmit = (data: InstitutionFormData) => {
        const formData = new FormData();

        formData.append('Name', data.name);
        formData.append('Address', data.address);
        if (data.description) formData.append('Description', data.description);
        if (data.leaderName) formData.append('LeaderName', data.leaderName);
        if (data.openingHours) formData.append('OpeningHours', data.openingHours);
        if (data.phoneNumber) formData.append('PhoneNumber', data.phoneNumber);
        if (data.email) formData.append('Email', data.email);
        if (data.websiteUrl) formData.append('WebsiteUrl', data.websiteUrl);
        if (data.content) formData.append('Content', data.content);
        formData.append('DisplayOrder', data.displayOrder.toString());

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
                        <h2 className="text-3xl font-serif font-bold text-primary">Intézmény rögzítése</h2>
                        <p className="text-gray-400 text-sm mt-1">Hozzon létre új hivatali, oktatási vagy egészségügyi egységet.</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-3 hover:bg-secondary rounded-full text-primary/50 hover:text-primary transition-colors cursor-pointer">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-6 pb-20">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Intézmény megnevezése *</label>
                        <input
                            type="text"
                            className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm ${errors.name ? 'border-red-400' : 'border-gray-100'}`}
                            placeholder="Pl. Nádasdladányi Sün Balázs Óvoda"
                            {...register('name')}
                        />
                        {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.name.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Vezető / Igazgató neve</label>
                            <input
                                type="text"
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                                placeholder="Pl. Kovács Istvánné"
                                {...register('leaderName')}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Megjelenítési sorrend (Súly)</label>
                            <input
                                type="number"
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                                {...register('displayOrder')}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Cím / Elérhetőség *</label>
                            <input
                                type="text"
                                className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm ${errors.address ? 'border-red-400' : 'border-gray-100'}`}
                                placeholder="Pl. 8145 Nádasdladány, Iskola utca 2."
                                {...register('address')}
                            />
                            {errors.address && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.address.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Telefonszám</label>
                            <input
                                type="tel"
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                                placeholder="Pl. +36 (22) 765-432"
                                {...register('phoneNumber')}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">E-mail cím</label>
                            <input
                                type="email"
                                className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm ${errors.email ? 'border-red-400' : 'border-gray-100'}`}
                                placeholder="Pl. ovoda@nadasdladany.hu"
                                {...register('email')}
                            />
                            {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.email.message}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Külső Honlap URL</label>
                            <input
                                type="url"
                                className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm ${errors.websiteUrl ? 'border-red-400' : 'border-gray-100'}`}
                                placeholder="Pl. https://iskolanadasdladany.hu"
                                {...register('websiteUrl')}
                            />
                            {errors.websiteUrl && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.websiteUrl.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Nyitvatartás / Ügyfélfogadás</label>
                            <textarea
                                rows={3}
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm whitespace-pre-line"
                                placeholder="Hétfő - Péntek: 07:30 - 16:30"
                                {...register('openingHours')}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Intézmény fotója</label>
                            <div className="relative h-24 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center group hover:border-accent transition-all overflow-hidden bg-white">
                                {imagePreview ? (
                                    <div className="flex items-center gap-3 w-full px-4">
                                        <img src={imagePreview} className="w-12 h-12 object-cover rounded-lg" alt="" />
                                        <span className="text-xs font-bold text-accent truncate">{image?.name}</span>
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
                        <textarea
                            rows={2}
                            className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm ${errors.description ? 'border-red-400' : 'border-gray-100'}`}
                            placeholder="Egy rövid bevezető mondat, ami az összesítő kártyán jelenik meg..."
                            {...register('description')}
                        />
                        {errors.description && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.description.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Részletes bemutatkozás és információk (Aloldal tartalom)</label>
                        <textarea
                            rows={8}
                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm leading-relaxed"
                            placeholder="Írja ide az intézmény részletes bemutatkozását, szabályzatait, történetét..."
                            {...register('content')}
                        />
                    </div>

                    <div className="fixed bottom-0 right-0 w-full max-w-3xl p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 transition-colors cursor-pointer">Mégse</button>
                        <button
                            type="submit" disabled={loading}
                            className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl hover:bg-accent transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-md cursor-pointer"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <>Intézmény Mentése</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};