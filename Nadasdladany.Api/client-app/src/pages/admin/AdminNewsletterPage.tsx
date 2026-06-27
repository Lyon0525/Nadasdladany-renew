import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { newsletterService } from '../../api/newsletterService';
import { Send, AlertTriangle, Users, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const newsletterSchema = z.object({
    subject: z.string().min(1, "A tárgy megadása kötelező!"),
    body: z.string().min(10, "A hírlevél szövege túl rövid!")
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export const AdminNewsletterPage = () => {
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsletterFormData>({
        resolver: zodResolver(newsletterSchema)
    });

    useEffect(() => {
        newsletterService.getSubscriberCount().then(setCount);
    }, []);

    const onValidSubmit = async (data: NewsletterFormData) => {
        setLoading(true);
        try {
            const result = await newsletterService.sendNewsletter(data.subject, data.body);

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

            reset();
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
                <form onSubmit={handleSubmit(onValidSubmit)} className="lg:col-span-2 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Hírlevél tárgya</label>
                        <input
                            type="text" placeholder="Pl. Lakossági tájékoztató áramszünetről"
                            className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm font-medium ${errors.subject ? 'border-red-400' : 'border-gray-100'}`}
                            {...register('subject')}
                        />
                        {errors.subject && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.subject.message}</p>}
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Üzenet tartalma (Sima szöveg)</label>
                        <textarea
                            rows={8} placeholder="Tisztelt Lakosok! Tájékoztatjuk Önöket, hogy..."
                            className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm leading-relaxed ${errors.body ? 'border-red-400' : 'border-gray-100'}`}
                            {...register('body')}
                        />
                        {errors.body && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.body.message}</p>}
                    </div>
                    <button
                        type="submit" disabled={loading}
                        className="bg-primary text-white font-bold px-8 py-4 rounded-2xl text-sm hover:bg-accent transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-md"
                    >
                        {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                        {loading ? "Küldés folyamatban..." : "Hírlevél körözése"}
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