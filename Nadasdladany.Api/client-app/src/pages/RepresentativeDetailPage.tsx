import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, User, Landmark, Briefcase } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { municipalityService } from '../api/municipalityService';
import { type Representative } from '../types/Municipality';
import { getImageUrl } from '../lib/imageUtils';
import { Seo } from '../components/common/Seo';

export const RepresentativeDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const [rep, setRep] = useState<Representative | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            municipalityService.getRepresentatives()
                .then(data => {
                    const found = data?.find(r => r.id === Number(id));
                    setRep(found || null);
                })
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return <div className="h-screen flex items-center justify-center font-serif italic text-accent text-2xl animate-pulse">Képviselői adatlap betöltése...</div>;
    if (!rep) return <div className="h-screen flex items-center justify-center font-serif text-2xl">A tisztségviselő nem található.</div>;

    const getRoleTitle = (role: string | number) => {
        if (rep.customTitleOverride) return rep.customTitleOverride;
        const r = Number(role);
        if (r === 0 || role === 'Polgarmester') return 'Polgármester';
        if (r === 1 || role === 'Alpolgarmester') return 'Alpolgármester';
        if (r === 3 || role === 'BizottsagiElnok') return 'Bizottsági Elnök';
        return 'Önkormányzati Képviselő';
    };

    return (
        <MainLayout>
            <Seo title={`${rep.name} - ${getRoleTitle(rep.role)}`} description={`${rep.name} önkormányzati tisztségviselő bemutatkozása és hivatali elérhetőségei.`} image={rep.imageUrl} />

            <div className="max-w-4xl mx-auto px-6 py-12">
                <button
                    onClick={() => navigate('/onkormanyzat')}
                    className="flex items-center gap-2 text-primary/50 hover:text-accent transition-colors mb-12 group uppercase text-xs font-bold tracking-widest cursor-pointer"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Vissza a testülethez
                </button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                    <div className="md:col-span-1 bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm text-center space-y-6">
                        <div className="w-36 h-36 mx-auto rounded-full overflow-hidden bg-secondary border-2 border-accent relative shadow-md">
                            {rep.imageUrl ? (
                                <img src={getImageUrl(rep.imageUrl)} alt={rep.name} className="w-full h-full object-cover" />
                            ) : <User size={56} className="text-primary/10 absolute inset-0 m-auto" />}
                        </div>

                        <div>
                            <h2 className="text-2xl font-serif font-bold text-primary leading-tight">{rep.name}</h2>
                            <span className="text-xs font-bold uppercase tracking-wider text-accent block mt-1.5">{getRoleTitle(rep.role)}</span>
                        </div>

                        <div className="border-t border-gray-50 pt-6 space-y-3 text-left">
                            {rep.email && (
                                <a href={`mailto:${rep.email}`} className="flex items-center gap-3 text-gray-500 hover:text-primary transition-colors text-xs font-medium truncate">
                                    <div className="p-2 bg-secondary rounded-xl text-accent"><Mail size={14} /></div>
                                    <span className="truncate" title={rep.email}>{rep.email}</span>
                                </a>
                            )}
                            {rep.phoneNumber && (
                                <a href={`tel:${rep.phoneNumber}`} className="flex items-center gap-3 text-gray-500 hover:text-primary transition-colors text-xs font-medium">
                                    <div className="p-2 bg-secondary rounded-xl text-accent"><Phone size={14} /></div>
                                    <span>{rep.phoneNumber}</span>
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
                            <h3 className="text-2xl font-serif font-bold text-primary border-b border-gray-50 pb-4 flex items-center gap-2">
                                <Briefcase size={20} className="text-accent" /> Hivatali Bemutatkozás
                            </h3>

                            {rep.biography ? (
                                <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-line space-y-4">
                                    {rep.biography}
                                </div>
                            ) : (
                                <p className="text-gray-400 text-sm italic">
                                    Tisztelt Lakosok! {rep.name} képviselői bemutatkozása jelenleg feltöltés alatt áll. Hivatali ügyekben kérjük, keresse a megadott e-mail címen vagy a Polgármesteri Hivatal központi elérhetőségein.
                                </p>
                            )}
                        </div>

                        <div className="bg-secondary/40 p-6 rounded-[24px] border border-gray-100/60 text-xs text-gray-400 flex items-start gap-3 leading-relaxed">
                            <Landmark size={16} className="text-accent flex-shrink-0 mt-0.5" />
                            <span>
                                Nádasdladány Község Önkormányzatának tisztségviselőjeként a képviselő-testületi ülések látogatása, a rendelettervezetek véleményezése és a lakossági érdekek hiteles képviselete a legfőbb feladatom. Turnusos fogadóórákkal kapcsolatban hivatali e-mailben egyeztethetünk.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};