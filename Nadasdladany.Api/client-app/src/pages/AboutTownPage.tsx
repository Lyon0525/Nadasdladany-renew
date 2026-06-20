import { useEffect, useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { siteSettingsService, type SiteSetting } from '../api/siteSettingsService';
import { getImageUrl } from '../lib/imageUtils';
import { Landmark, History, Shield, Building2, MapPin } from 'lucide-react';

export const AboutTownPage = () => {
    const [settings, setSettings] = useState<SiteSetting | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        siteSettingsService.getSettings()
            .then(setSettings)
            .catch(err => console.error("Hiba a bemutató betöltésekor:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <MainLayout>
                <div className="text-center py-40 font-serif italic text-accent text-xl animate-pulse">
                    Nádasdladány történetének előkészítése...
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="relative bg-primary text-white py-20 px-6 text-center overflow-hidden w-full">
                <div className="absolute inset-0 bg-[url('/Nadasdladany-hero-banner.jpg')] bg-cover bg-center opacity-20 pointer-events-none" />
                <div className="relative z-10 max-w-4xl mx-auto space-y-3">
                    <Landmark size={40} className="mx-auto text-accent mb-2" />
                    <h1 className="text-5xl font-serif font-bold tracking-tight">Múltunk és Örökségünk</h1>
                    <p className="text-gray-300 text-sm tracking-widest uppercase font-medium">Ismerje meg Nádasdladány Község történelmét és értékeit</p>
                </div>
            </div>

            <div className="w-full py-24 px-6 md:px-12 xl:px-20 space-y-28 bg-gradient-to-b from-white to-secondary/20">
                <div className="flex flex-col lg:flex-row items-center gap-12 xl:gap-20 max-w-[1500px] mx-auto">
                    <div className="w-full lg:w-1/2 space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                            <div className="p-3 bg-primary/5 text-primary rounded-2xl"><History size={24} /></div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">Községünk Története</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line font-light">
                            {settings?.historyText || "A település történelmi leírása hamarosan feltöltésre kerül."}
                        </p>
                    </div>
                    <div className="w-full lg:w-1/2 h-[400px] rounded-[40px] overflow-hidden shadow-xl border border-gray-100">
                        <img src="\aboutpage\nadasdladany_tajkep.jpg" alt="Nádasdladányi tájkép" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row-reverse items-center gap-12 xl:gap-20 max-w-[1500px] mx-auto">
                    <div className="w-full lg:w-1/2 space-y-6">
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                            <div className="p-3 bg-accent/10 text-accent rounded-2xl"><Shield size={24} /></div>
                            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">A Községi Címer</h2>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line font-light">
                            {settings?.coatOfArmsText || "A címer heraldikai leírása hamarosan feltöltésre kerül."}
                        </p>
                    </div>
                    <div className="w-full lg:w-1/2 flex justify-center bg-white p-12 rounded-[40px] shadow-md border border-gray-100/50">
                        <img
                            src={getImageUrl(settings?.coatOfArmsImageUrl || undefined) || "/aboutpage/nadasdladany_cimer.jpg"}
                            alt="Nádasdladány címere"
                            className="h-72 object-contain drop-shadow-xl animate-in fade-in duration-1000"
                        />
                    </div>
                </div>

                <div className="space-y-12 max-w-[1500px] mx-auto">
                    <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
                        <div className="p-3 bg-primary/5 text-primary rounded-2xl"><Building2 size={24} /></div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">Nevezetességek & Építészeti Örökség</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col">
                            <div className="h-64 overflow-hidden relative">
                                <img src="\aboutpage\nadasdladany_kastely.jpg" alt="Nádasdy-kastély" className="w-full h-full object-cover" />
                                <span className="absolute bottom-4 left-4 bg-primary/90 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 backdrop-blur-sm"><MapPin size={12} /> Kastélypark</span>
                            </div>
                            <div className="p-8 space-y-3 flex-grow">
                                <h3 className="text-xl font-serif font-bold text-primary">Nádasdy-kastély</h3>
                                <p className="text-gray-500 text-sm leading-relaxed font-light">Az 1870-es években épült, historizáló, Tudor-stílusú kastély Magyarország egyik legszebb főúri rezidenciája, melyet egyedülálló kovácsoltvas csillárok, Ősök csarnoka és egy hatalmas, angol mintára tervezett arborétum tesz varázslatossá.</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col group">
                            <div className="h-64 overflow-hidden relative bg-gray-100">
                                <img
                                    src="\aboutpage\nadasdladany_templom.jpg"
                                    alt="Szent Ilona Római Katolikus Templom"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                <span className="absolute bottom-4 left-4 bg-primary/90 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 backdrop-blur-sm">
                                    <MapPin size={12} /> Templom tér
                                </span>
                            </div>
                            <div className="p-8 space-y-3 flex-grow">
                                <h3 className="text-xl font-serif font-bold text-primary group-hover:text-accent transition-colors">
                                    Szent Ilona Római Katolikus Templom
                                </h3>
                                <p className="text-gray-500 text-sm leading-relaxed font-light">
                                    A Hauszmann Alajos által tervezett neogótikus templom a település sziluettjének meghatározó eleme.
                                    Az épület alatt található a Nádasdy család kriptája, ahol a faluért és az országért oly sokat tett grófok nyugszanak.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-secondary/40 p-8 md:p-10 rounded-[32px] border border-gray-100 italic text-gray-600 text-base font-light leading-relaxed">
                        {settings?.landmarksText}
                    </div>
                </div>

            </div>
        </MainLayout>
    );
};