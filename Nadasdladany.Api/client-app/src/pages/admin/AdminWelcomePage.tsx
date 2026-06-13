import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { siteSettingsService } from '../../api/siteSettingsService';
import { Save, Upload, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminWelcomePage = () => {
    const [mayorName, setMayorName] = useState('');
    const [welcomeTitle, setWelcomeTitle] = useState('');
    const [welcomeText, setWelcomeText] = useState('');
    const [currentImageUrl, setCurrentImageUrl] = useState<string | undefined>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        siteSettingsService.getSettings().then(data => {
            if (data) {
                setMayorName(data.mayorName);
                setWelcomeTitle(data.welcomeTitle);
                setWelcomeText(data.welcomeText);
                setCurrentImageUrl(data.mayorImageUrl);
            }
        }).catch(() => toast.error("Hiba az adatok betöltésekor"));
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('MayorName', mayorName);
        formData.append('WelcomeTitle', welcomeTitle);
        formData.append('WelcomeText', welcomeText);
        if (imageFile) {
            formData.append('MayorImage', imageFile);
        }

        try {
            await siteSettingsService.updateSettings(formData);
            toast.success("A köszöntő sikeresen frissítve!");
        } catch {
            toast.error("Hiba történt a mentés során.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-primary">Főoldali köszöntő szerkesztése</h1>
                <p className="text-gray-400 mt-1">Itt módosíthatja a polgármester nevét, a köszöntő szövegét és a hivatalos fotót.</p>
            </div>

            <form onSubmit={handleSave} className="bg-white p-8 md:p-10 rounded-[32px] border border-gray-100 shadow-sm space-y-6 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Polgármester neve</label>
                        <input
                            type="text" required
                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm font-medium"
                            value={mayorName} onChange={e => setMayorName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Köszöntő alcíme / Titulusa</label>
                        <input
                            type="text" required
                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm font-medium"
                            value={welcomeTitle} onChange={e => setWelcomeTitle(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Polgármester fotója</label>
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-2 border-white shadow-md flex-shrink-0">
                            <img
                                src={imagePreview || (currentImageUrl ? currentImageUrl : 'https://via.placeholder.com/150')}
                                className="w-full h-full object-cover"
                                alt="Polgármester"
                            />
                        </div>
                        <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-accent transition-colors bg-white flex-1 w-full">
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageChange} />
                            <Upload className="mx-auto text-gray-400 mb-1" size={20} />
                            <span className="text-xs text-gray-500 font-medium block">Kattintson ide az új fotó kiválasztásához</span>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Köszöntő beszéde / Szövege</label>
                    <textarea
                        rows={10} required
                        className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm leading-relaxed"
                        placeholder="Írja ide a lakosságnak és látogatóknak szánt hivatalos köszöntő szöveget..."
                        value={welcomeText} onChange={e => setWelcomeText(e.target.value)}
                    />
                </div>

                <button
                    type="submit" disabled={loading}
                    className="bg-primary text-white font-bold px-8 py-4 rounded-2xl text-sm hover:bg-accent transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
                >
                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    {loading ? "Mentés folyamatban..." : "Változtatások mentése"}
                </button>
            </form>
        </AdminLayout>
    );
};