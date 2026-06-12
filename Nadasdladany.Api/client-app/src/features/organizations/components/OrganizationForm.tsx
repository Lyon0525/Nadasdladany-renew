import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';

interface Props {
    onClose: () => void;
    onSubmit: (formData: FormData) => Promise<void>;
    loading: boolean;
}

export const OrganizationForm = ({ onClose, onSubmit, loading }: Props) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<string>('0');
    const [leaderName, setLeaderName] = useState('');
    const [address, setAddress] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('Name', name);
        formData.append('Type', type);
        formData.append('LeaderName', leaderName);
        formData.append('Address', address);
        formData.append('PhoneNumber', phoneNumber);
        formData.append('Email', email);
        formData.append('WebsiteUrl', websiteUrl);
        formData.append('Description', description);

        if (imageFile) {
            formData.append('Image', imageFile);
        }

        await onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-50 flex justify-end animate-in fade-in duration-200">
            <div className="w-full max-w-xl bg-white h-full p-8 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-300">

                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                    <div>
                        <h3 className="text-xl font-serif font-bold text-primary">Új szervezet rögzítése</h3>
                        <p className="text-xs text-gray-400 mt-0.5">Adja meg a helyi közösség, egyház vagy egyesület adatait.</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-primary rounded-full hover:bg-secondary transition-colors cursor-pointer">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleFormSubmit} className="flex-1 py-6 space-y-5 overflow-y-auto pr-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Szervezet / Közösség Neve *</label>
                            <input
                                type="text" required placeholder="Pl. Nádasdladányi Faluszépítő Egyesület"
                                className="w-full bg-secondary/50 border border-gray-100 p-3.5 rounded-2xl outline-none focus:border-accent text-sm font-medium"
                                value={name} onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Típus *</label>
                            <select
                                className="w-full bg-secondary/50 border border-gray-100 p-3.5 rounded-2xl outline-none focus:border-accent text-sm font-bold"
                                value={type} onChange={(e) => setType(e.target.value)}
                            >
                                <option value="0">Civil Szervezet / Egyesület</option>
                                <option value="1">Történelmi Egyház</option>
                                <option value="2">Alapítvány</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Képviselő / Vezető neve</label>
                            <input
                                type="text" placeholder="Pl. Kovács János elnök"
                                className="w-full bg-secondary/50 border border-gray-100 p-3.5 rounded-2xl outline-none focus:border-accent text-sm font-medium"
                                value={leaderName} onChange={(e) => setLeaderName(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Székhely / Cím</label>
                        <input
                            type="text" placeholder="Pl. 8145 Nádasdladány, Fő utca 12."
                            className="w-full bg-secondary/50 border border-gray-100 p-3.5 rounded-2xl outline-none focus:border-accent text-sm font-medium"
                            value={address} onChange={(e) => setAddress(e.target.value)}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Telefonszám</label>
                            <input
                                type="tel" placeholder="Pl. +36 20 123 4567"
                                className="w-full bg-secondary/50 border border-gray-100 p-3.5 rounded-2xl outline-none focus:border-accent text-sm font-medium"
                                value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">E-mail cím</label>
                            <input
                                type="email" placeholder="Pl. info@egyesulet.hu"
                                className="w-full bg-secondary/50 border border-gray-100 p-3.5 rounded-2xl outline-none focus:border-accent text-sm font-medium"
                                value={email} onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Weboldal URL (Opcionális)</label>
                        <input
                            type="url" placeholder="Pl. https://egyesulet.hu"
                            className="w-full bg-secondary/50 border border-gray-100 p-3.5 rounded-2xl outline-none focus:border-accent text-sm font-medium"
                            value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Bemutatkozás / Rövid leírás</label>
                        <textarea
                            rows={3} placeholder="A szervezet tevékenységének, céljainak rövid összefoglalása..."
                            className="w-full bg-secondary/50 border border-gray-100 p-3.5 rounded-2xl outline-none focus:border-accent text-sm leading-relaxed"
                            value={description} onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5">Logó vagy Borítókép</label>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-5 text-center bg-secondary/20 relative group hover:border-accent transition-colors">
                            <input
                                type="file" accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                            <Upload className="mx-auto text-gray-400 mb-1 group-hover:text-accent transition-colors" size={20} />
                            <span className="text-xs text-gray-500 font-medium block">
                                {imageFile ? `Kiválasztva: ${imageFile.name}` : "Kattintson ide a kép feltöltéséhez"}
                            </span>
                        </div>
                    </div>
                </form>

                <div className="border-t border-gray-100 pt-4 flex gap-4">
                    <button
                        type="button" onClick={onClose} disabled={loading}
                        className="flex-1 bg-gray-100 text-gray-600 font-bold py-3.5 rounded-2xl text-sm hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        Mégse
                    </button>
                    <button
                        type="submit" onClick={handleFormSubmit} disabled={loading}
                        className="flex-[2] bg-primary text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-accent transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : null}
                        {loading ? "Rögzítés..." : "Szervezet Mentése"}
                    </button>
                </div>

            </div>
        </div>
    );
};