import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { municipalityService } from '../api/municipalityService';
import { siteSettingsService, type SiteSetting } from '../api/siteSettingsService';
import { type Representative } from '../types/Municipality';
import { getImageUrl } from '../lib/imageUtils';
import { Users, User, Shield, Landmark, ClipboardList, ArrowRight, Loader2 } from 'lucide-react';

export const MunicipalityPage = () => {
    const [representatives, setRepresentatives] = useState<Representative[]>([]);
    const [settings, setSettings] = useState<SiteSetting | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<'board' | 'committees'>('board');

    useEffect(() => {
        Promise.all([
            municipalityService.getRepresentatives(),
            siteSettingsService.getSettings()
        ]).then(([repsData, settingsData]) => {
            setRepresentatives(repsData || []);
            setSettings(settingsData);
        }).catch(err => console.error(err))
          .finally(() => setLoading(false));
    }, []);

    const mayor = representatives.find(r => Number(r.role) === 0);
    const viceMayor = representatives.find(r => Number(r.role) === 1);
    const boardMembers = representatives.filter(r => Number(r.role) === 2 || Number(r.role) === 4);

    let dynamicCommittees: any[] = [];
    if (settings?.committeeText) {
        try {
            const parsed = JSON.parse(settings.committeeText);
            dynamicCommittees = parsed.map((c: any) => ({
                id: c.id,
                name: c.name,
                description: c.description,
                chair: representatives.find(r => r.id === Number(c.chairId)),
                members: c.memberIds.map((id: number) => representatives.find(r => r.id === id)).filter(Boolean)
            }));
        } catch (e) {
            console.error("Hiba a bizottságok betöltésekor");
        }
    }

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <Landmark size={48} className="mx-auto text-accent mb-6" />
                    <h1 className="text-5xl font-serif font-bold text-primary mb-4">Önkormányzat</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Nádasdladány Község döntéshozó szervei, tisztségviselői és állandó bizottságai.
                    </p>
                </div>

                <div className="flex justify-center mb-16">
                    <div className="inline-flex bg-secondary p-1.5 rounded-full border border-gray-100 flex-wrap justify-center gap-2">
                        <button
                            onClick={() => setActiveSection('board')}
                            className={`flex items-center gap-2 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeSection === 'board' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-primary'}`}
                        >
                            <Users size={16} /> Képviselő-testület
                        </button>
                        <button
                            onClick={() => setActiveSection('committees')}
                            className={`flex items-center gap-2 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeSection === 'committees' ? 'bg-primary text-white shadow-md' : 'text-gray-400 hover:text-primary'}`}
                        >
                            <ClipboardList size={16} /> Bizottságok Működése
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-accent gap-4">
                        <Loader2 className="animate-spin" size={32} />
                        <span className="font-serif italic text-xl">Adatok betöltése...</span>
                    </div>
                ) : activeSection === 'board' ? (
                    <div className="space-y-20 animate-in fade-in duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
                            {mayor && (
                                <Link to={`/onkormanyzat/${mayor.id}`} className="block group">
                                    <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm text-center space-y-4 hover:shadow-xl hover:border-accent/30 transition-all duration-300 h-full flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden bg-secondary border-2 border-accent relative group-hover:scale-105 transition-transform duration-500">
                                                {mayor.imageUrl ? (
                                                    <img src={getImageUrl(mayor.imageUrl)} alt={mayor.name} className="w-full h-full object-cover" />
                                                ) : <User size={64} className="text-primary/10 absolute inset-0 m-auto" />}
                                            </div>
                                            <div>
                                                <span className="text-[10px] uppercase font-bold tracking-widest text-accent">Polgármester</span>
                                                <h3 className="text-2xl font-serif font-bold text-primary mt-1 group-hover:text-accent transition-colors">{mayor.name}</h3>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-accent inline-flex items-center justify-center gap-1 pt-2">
                                            Adatlap megtekintése <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </Link>
                            )}

                            {viceMayor && (
                                <Link to={`/onkormanyzat/${viceMayor.id}`} className="block group">
                                    <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm text-center space-y-4 hover:shadow-xl hover:border-accent/30 transition-all duration-300 h-full flex flex-col justify-between">
                                        <div className="space-y-4">
                                            <div className="w-40 h-40 mx-auto rounded-full overflow-hidden bg-secondary border-2 border-gray-200 relative group-hover:scale-105 transition-transform duration-500">
                                                {viceMayor.imageUrl ? (
                                                    <img src={getImageUrl(viceMayor.imageUrl)} alt={viceMayor.name} className="w-full h-full object-cover" />
                                                ) : <User size={64} className="text-primary/10 absolute inset-0 m-auto" />}
                                            </div>
                                            <div>
                                                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 font-bold">Alpolgármester</span>
                                                <h3 className="text-2xl font-serif font-bold text-primary mt-1 group-hover:text-accent transition-colors">{viceMayor.name}</h3>
                                            </div>
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400 group-hover:text-accent inline-flex items-center justify-center gap-1 pt-2">
                                            Adatlap megtekintése <ArrowRight size={14} />
                                        </span>
                                    </div>
                                </Link>
                            )}
                        </div>

                        <div className="space-y-8">
                            <h3 className="text-3xl font-serif font-bold text-primary text-center md:text-left border-b border-gray-50 pb-4">Települési Képviselők</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                                {boardMembers.map((member) => (
                                    <Link to={`/onkormanyzat/${member.id}`} key={member.id} className="block group">
                                        <div className="bg-white rounded-[32px] border border-gray-100 p-6 text-center space-y-4 hover:shadow-xl hover:border-accent/20 transition-all duration-300 h-full flex flex-col justify-between">
                                            <div className="space-y-4">
                                                <div className="w-28 h-28 mx-auto rounded-full overflow-hidden bg-secondary relative group-hover:scale-105 transition-transform duration-500">
                                                    {member.imageUrl ? (
                                                        <img src={getImageUrl(member.imageUrl)} alt={member.name} className="w-full h-full object-cover" />
                                                    ) : <User size={48} className="text-primary/10 absolute inset-0 m-auto" />}
                                                </div>
                                                <div>
                                                    <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400">{member.customTitleOverride || "Képviselő-testületi tag"}</span>
                                                    <h4 className="font-bold text-primary text-lg mt-0.5 group-hover:text-accent transition-colors">{member.name}</h4>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-accent inline-flex items-center justify-center gap-1 pt-2">
                                                Profil <ArrowRight size={12} />
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in duration-300">
                        {dynamicCommittees.length === 0 ? (
                            <div className="col-span-2 text-center py-20 text-gray-400 italic">Jelenleg nincsenek aktív bizottságok rögzítve.</div>
                        ) : (
                            dynamicCommittees.map((committee) => (
                                <div key={committee.id} className="bg-white rounded-[40px] border border-gray-100 p-8 md:p-10 shadow-sm space-y-6 flex flex-col justify-between">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-3 bg-secondary rounded-2xl text-accent"><Shield size={22} /></div>
                                            <h3 className="text-2xl font-serif font-bold text-primary leading-tight">{committee.name}</h3>
                                        </div>
                                        <p className="text-gray-500 text-sm leading-relaxed">{committee.description}</p>
                                    </div>

                                    <div className="border-t border-gray-50 pt-6 space-y-4">
                                        <div className="bg-secondary/30 p-4 rounded-2xl flex items-center gap-4">
                                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-accent shadow-sm flex-shrink-0 font-bold border border-accent/20">E</div>
                                            <div>
                                                <span className="text-[9px] uppercase font-bold tracking-widest text-accent block">Bizottság Elnöke</span>
                                                <span className="font-bold text-primary text-sm">{committee.chair ? committee.chair.name : "Kijelölés alatt"}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block pl-1">Bizottsági tagok:</span>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {committee.members.length > 0 ? (
                                                    committee.members.map((m: any, idx: number) => (
                                                        <div key={idx} className="bg-gray-50/60 px-4 py-2.5 rounded-xl border border-gray-100/50 text-xs font-medium text-primary flex items-center gap-2">
                                                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                                            {m.name}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic pl-1">Testületi tagok delegálása folyamatban.</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};