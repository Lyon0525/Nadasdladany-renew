import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { newsletterService } from '../../api/newsletterService';
import { Send, AlertTriangle, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminNewsletterPage = () => {
    const [count, setCount] = useState(0);
    const [subject, setSubject] = useState('');
    const [body, setBody] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        newsletterService.getSubscriberCount().then(setCount);
    }, []);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = await newsletterService.sendNewsletter(subject, body);

            if (result.isDummy) {
                toast(() => (
                    <span className="flex flex-col gap-1.5 text-sm">
                        <strong className="text-amber-600 flex items-center gap-1"><AlertTriangle size={16} /> Rendszerértesítés</strong>
                        <span className="text-gray-500">A hírlevél rögzítésre került, de az éles levelek nem mentek ki, mert <strong>nincs SMTP kiszolgáló implementálva</strong>.</span>
                    </span>
                ), { duration: 6000 });
            } else {
                toast.success("Hírlevél kiküldve!");
            }

            setSubject('');
            setBody('');
        } catch {
            toast.error("Hiba történt a küldés során.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-primary">Hírlevelek kiküldése</h1>
                    <p className="text-gray-400 mt-1">Értesítések manuális kiküldése a feliratkozott lakosok részére.</p>
                </div>
                <div className="bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl text-accent"><Users size={20} /></div>
                    <div>
                        <span className="text-xs font-bold text-gray-400 block uppercase tracking-wider">Aktív feliratkozók</span>
                        <span className="text-xl font-bold text-primary">{count} fő</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <form onSubmit={handleSend} className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Hírlevél tárgya</label>
                        <input
                            type="text" required placeholder="Pl. Lakossági tájékoztató áramszünetről"
                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm font-medium"
                            value={subject} onChange={(e) => setSubject(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Üzenet tartalma (Sima szöveg)</label>
                        <textarea
                            rows={8} required placeholder="Tisztelt Lakosok! Tájékoztatjuk Önöket, hogy..."
                            className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm leading-relaxed"
                            value={body} onChange={(e) => setBody(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit" disabled={loading}
                        className="bg-primary text-white font-bold px-8 py-4 rounded-2xl text-sm hover:bg-accent transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                    >
                        <Send size={16} /> {loading ? "Küldés folyamatban..." : "Hírlevél körözése"}
                    </button>
                </form>

                <div className="bg-amber-50/50 border border-amber-100 p-8 rounded-[32px] h-fit space-y-4">
                    <h3 className="font-serif font-bold text-amber-800 flex items-center gap-2"><AlertTriangle size={20} /> Technikai Megjegyzés</h3>
                    <p className="text-amber-700/80 text-xs leading-relaxed">
                        Ez a modul jelenleg <strong>szimulált (Dummy) módban</strong> üzemel. A feliratkozásokat az adatbázis rögzíti, de a kiküldés gomb megnyomásakor fizikai e-mail nem hagyja el a szervert az éles hivatali SMTP hitelesítés hiánya miatt.
                    </p>
                </div>
            </div>
        </AdminLayout>
    );
};