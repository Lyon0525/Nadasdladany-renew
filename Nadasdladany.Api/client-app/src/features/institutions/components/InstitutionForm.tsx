import { useState } from 'react';
import { X, Upload, Loader2, Check } from 'lucide-react';

interface Props {
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    loading: boolean;
}

export const InstitutionForm = ({ onClose, onSubmit, loading }: Props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [leaderName, setLeaderName] = useState('');
    const [openingHours, setOpeningHours] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [displayOrder, setDisplayOrder] = useState('0');
    const [content, setContent] = useState('');
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
        formData.append('Name', name);
        formData.append('Description', description);
        formData.append('LeaderName', leaderName);
        formData.append('OpeningHours', openingHours);
        formData.append('Address', address);
        formData.append('PhoneNumber', phoneNumber);
        formData.append('Email', email);
        formData.append('WebsiteUrl', websiteUrl);
        formData.append('Content', content);
        formData.append('DisplayOrder', displayOrder);
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

                <form onSubmit={handleSubmit} className="space-y-6 pb-20">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Intézmény megnevezése</label>
                        <input
                            type="text" required
                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                            placeholder="Pl. Nádasdladányi Sün Balázs Óvoda és Mini Bölcsőde"
                            value={name} onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Vezető / Igazgató neve</label>
                            <input
                                type="text" placeholder="Pl. Kovács Istvánné"
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                                value={leaderName} onChange={(e) => setLeaderName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Megjelenítési sorrend (Súly)</label>
                            <input
                                type="number"
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                                value={displayOrder} onChange={(e) => setDisplayOrder(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Cím / Elérhetőség</label>
                            <input
                                type="text" placeholder="Pl. 8145 Nádasdladány, Iskola utca 2."
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                                value={address} onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Telefonszám</label>
                            <input
                                type="tel" placeholder="Pl. +36 (22) 765-432"
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                                value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">E-mail cím</label>
                            <input
                                type="email" placeholder="Pl. ovoda@nadasdladany.hu"
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Külső Honlap URL (Ha van)</label>
                            <input
                                type="url" placeholder="Pl. https://iskolanadasdladany.hu"
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                                value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Nyitvatartás / Ügyfélfogadás</label>
                            <textarea
                                rows={3} placeholder="Hétfő - Péntek: 07:30 - 16:30"
                                className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm whitespace-pre-line"
                                value={openingHours} onChange={(e) => setOpeningHours(e.target.value)}
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
                            rows={2} required maxLength={300}
                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                            placeholder="Egy rövid bevezető mondat, ami az összesítő kártyán jelenik meg..."
                            value={description} onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Részletes bemutatkozás és információk (Aloldal tartalom)</label>
                        <textarea
                            rows={8}
                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm leading-relaxed"
                            placeholder="Írja ide az intézmény részletes bemutatkozását, szabályzatait, történetét..."
                            value={content} onChange={(e) => setContent(e.target.value)}
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