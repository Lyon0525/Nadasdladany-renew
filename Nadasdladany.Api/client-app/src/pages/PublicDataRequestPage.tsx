import { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { dataRequestService } from '../api/dataRequestService';
import { ShieldAlert, Info, Send, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const PublicDataRequestPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await dataRequestService.submitRequest({
                applicantName: name,
                applicantEmail: email,
                applicantPhone: phone || undefined,
                requestedDataDescription: description
            });
            setSuccess(true);
            toast.success("Adatigénylés sikeresen beküldve!");
        } catch {
            toast.error("Hiba történt a beküldés során.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <ShieldAlert size={48} className="mx-auto text-accent mb-6" />
                    <h1 className="text-5xl font-serif font-bold text-primary mb-4">Közérdekű Adatigénylés</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Tájékoztató és online ügyintézési felület az információs önrendelkezési jogról szóló törvény alapján.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    {/* Tájékoztató szöveg blokk */}
                    <div className="lg:col-span-1 bg-secondary/40 p-8 rounded-[32px] border border-gray-100 space-y-6 text-sm text-primary leading-relaxed">
                        <h3 className="font-serif font-bold text-lg flex items-center gap-2"><Info size={18} className="text-accent" /> Tájékoztató</h3>
                        <p>
                            Az információs önrendelkezési jogról és az információszabadságról szóló <strong>2011. évi CXII. törvény</strong> alapján bárki jogosult közérdekű adat megismerésére irányuló igényt benyújtani.
                        </p>
                        <p>
                            <strong>Határidő:</strong> Önkormányzatunk a kérelem beérkezését követő legfeljebb <strong>15 napon belül</strong> köteles eleget tenni az igénylésnek.
                        </p>
                        <p className="text-xs text-gray-400">
                            Felhívjuk figyelmét, hogy az igénylés során megadott személyes adatait kizárólag a kérelem azonosítására és megválaszolására használjuk fel a GDPR előírásoknak megfelelően.
                        </p>
                    </div>

                    {/* Online Űrlap */}
                    <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-sm">
                        {success ? (
                            <div className="text-center py-12 space-y-4 animate-in zoom-in-95 duration-300">
                                <CheckCircle className="text-green-500 mx-auto" size={56} />
                                <h3 className="text-2xl font-serif font-bold text-primary">Sikeres igénylés!</h3>
                                <p className="text-gray-500 text-sm max-w-md mx-auto">
                                    Közérdekű adatigénylését rögzítettük. A hivatal munkatársai a törvényben meghatározott határidőn belül felveszik Önnel a kapcsolatot a megadott e-mail címen.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h3 className="text-xl font-serif font-bold text-primary mb-2">Igénylő űrlap</h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Az Ön neve *</label>
                                        <input
                                            type="text" required placeholder="Kovács János"
                                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                                            value={name} onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">E-mail címe *</label>
                                        <input
                                            type="email" required placeholder="kovacs@example.hu"
                                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                                            value={email} onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Telefonszáma (Opcionális)</label>
                                    <input
                                        type="tel" placeholder="+36 (30) 123-4567"
                                        className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm"
                                        value={phone} onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">A kért adatok köre, leírása *</label>
                                    <textarea
                                        rows={6} required
                                        placeholder="Kérjük, fogalmazza meg pontosan, milyen közérdekű adatok vagy hivatali dokumentumok megismerését igényli..."
                                        className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm leading-relaxed"
                                        value={description} onChange={(e) => setDescription(e.target.value)}
                                    />
                                </div>

                                <button
                                    type="submit" disabled={loading}
                                    className="bg-primary text-white font-bold px-8 py-4 rounded-2xl text-sm hover:bg-accent transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
                                >
                                    {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                                    {loading ? "Küldés folyamatban..." : "Adatigénylés benyújtása"}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};