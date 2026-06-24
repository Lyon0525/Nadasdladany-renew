import { useState, useEffect } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react';
import { contactService } from '../api/contactService';
import { siteSettingsService, type SiteSetting } from '../api/siteSettingsService';

export const ContactPage = () => {
    const [settings, setSettings] = useState<SiteSetting | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        siteSettingsService.getSettings().then(data => setSettings(data)).catch(console.error);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await contactService.submitMessage(formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setStatus('idle'), 5000);
        } catch (err) {
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-serif font-bold text-primary mb-4">Kapcsolat</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">Kérdése van, vagy hivatalos ügyben keres minket? Írjon nekünk, vagy keresse munkatársainkat az alábbi elérhetőségeken!</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div className="space-y-8">
                        <div className="bg-white p-10 rounded-[40px] shadow-sm border border-gray-100 h-full flex flex-col justify-center space-y-10">
                            <h2 className="text-2xl font-serif font-bold text-primary border-b border-gray-50 pb-6">Polgármesteri Hivatal</h2>

                            <div className="flex items-start gap-6 group">
                                <div className="p-4 bg-secondary rounded-2xl text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                    <MapPin size={28} />
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-1">Címünk</span>
                                    <p className="font-bold text-primary text-lg">{settings?.contactAddress || "8145 Nádasdladány, Fő utca 1."}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="p-4 bg-secondary rounded-2xl text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                    <Phone size={28} />
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-1">Telefonszám</span>
                                    <p className="font-bold text-primary text-lg">{settings?.contactPhone || "+36 (22) 123 456"}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-6 group">
                                <div className="p-4 bg-secondary rounded-2xl text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                                    <Mail size={28} />
                                </div>
                                <div>
                                    <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block mb-1">E-mail cím</span>
                                    <p className="font-bold text-primary text-lg">{settings?.contactEmail || "hivatal@nadasdladany.hu"}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-10 rounded-[40px] shadow-xl border border-gray-100">
                        <h2 className="text-2xl font-serif font-bold text-primary mb-8">Üzenet küldése</h2>

                        {status === 'success' ? (
                            <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in duration-300">
                                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-primary">Sikeres küldés!</h3>
                                <p className="text-gray-500">Köszönjük megkeresését. Munkatársaink hamarosan válaszolni fognak a megadott e-mail címen.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Teljes Név *</label>
                                        <input required type="text" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">E-mail Cím *</label>
                                        <input required type="email" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Tárgy *</label>
                                    <input required type="text" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" value={formData.subject} onChange={e => setFormData({ ...formData, subject: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Üzenet Szövege *</label>
                                    <textarea required rows={5} className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm resize-none" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
                                </div>

                                {status === 'error' && <p className="text-red-500 text-sm font-bold text-center">Hiba történt az üzenet küldése során. Kérjük, próbálja újra később!</p>}

                                <button disabled={status === 'loading'} type="submit" className="w-full bg-primary text-white font-bold py-5 rounded-2xl hover:bg-accent transition-all shadow-lg flex justify-center items-center gap-3 disabled:opacity-70">
                                    {status === 'loading' ? <Loader2 className="animate-spin" size={20} /> : <><Send size={20} /> Üzenet Elküldése</>}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};