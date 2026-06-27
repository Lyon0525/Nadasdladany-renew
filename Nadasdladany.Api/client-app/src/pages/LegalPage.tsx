import { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { Scale, ShieldAlert, FileText, Info, Loader2 } from 'lucide-react';
import { siteSettingsService } from '../api/siteSettingsService';
import { useQuery } from '@tanstack/react-query';

export const LegalPage = () => {
    const [activeTab, setActiveTab] = useState<'impresszum' | 'gdpr' | 'accessibility'>('impresszum');

    const { data: settings, isLoading: loading } = useQuery({
        queryKey: ['publicSiteSettings'],
        queryFn: () => siteSettingsService.getSettings()
    });

    const defaultImpressum = `
        <p><strong>A honlap fenntartója:</strong><br>Nádasdladány Község Önkormányzata<br>Székhely: 8145 Nádasdladány, Fő utca 1.<br>Adószám: 15337225-1-07</p>
        <p><strong>Felelős kiadó:</strong><br>Pálfi Kristóf — Polgármester</p>
    `;

    const defaultHostingProvider = `
        <p><strong>Név:</strong> NISZ Nemzeti Infokommunikációs Szolgáltató Zrt.<br>
        <strong>Székhely:</strong> 1081 Budapest, Csokonai utca 3.<br>
        <strong>E-mail:</strong> info@nisz.hu<br>
        <strong>Weboldal:</strong> https://nisz.hu</p>
    `;

    const defaultGdpr = `
        <p>Önkormányzatunk elkötelezett a látogatók és az ügyfelek személyes adatainak védelme mellett az Európai Unió 2016/679 számú általános adatvédelmi rendelete (GDPR) szerint.</p>
        <p><strong>1. Közérdekű adatigénylések és panaszok:</strong><br>Az online űrlapokon megadott nevét, e-mail címét és telefonszámát kizárólag a kérelem feldolgozására, azonosítására és a törvényben meghatározott 15 napos válaszadási határidő betartására használjuk fel. Harmadik félnek az adatokat át nem adjuk.</p>
        <p><strong>2. Hírlevél feliratkozás:</strong><br>A feliratkozás során megadott e-mail címet kizárólag lakossági tájékoztató hírlevelek körözésére használjuk. A leiratkozás bármikor ingyenesen kezdeményezhető a hírlevél alján található linken.</p>
    `;

    const defaultAccessibility = `
        <p>Nádasdladány Község Önkormányzata elkötelezett amellett, hogy honlapját a közszférabeli szervezetek honlapjainak akadálymentesítéséről szóló <strong>2018. évi LXXV. törvénynek</strong> megfelelően akadálymentessé tegye.</p>
        <p><strong>Megfelelőségi státusz:</strong><br>Ez a honlap részben megfelel az MSZ EN 301 549 szabványnak, illetve a WCAG 2.1 AA szintű hozzáférhetőségi iránymutatásoknak. Fejlesztőcsapatunk folyamatosan dolgozik a vakbarát felolvasó szoftverek és a billentyűzet-navigáció tökéletesítésén.</p>
        <p><strong>Visszajelzés és elérhetőségek:</strong><br>Amennyiben a honlap használata során akadályba ütközik, észrevételeit az info@nadasdladany.hu e-mail címen jelezheti felénk. A bejelentéseket 15 napon belül felülvizsgáljuk.</p>
    `;

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <Scale size={48} className="mx-auto text-accent mb-6" />
                    <h1 className="text-5xl font-serif font-bold text-primary mb-4">Jogi Nyilatkozatok</h1>
                    <p className="text-gray-500 text-sm">Hivatalos impresszum, adatvédelmi előírások és akadálymentesítési tájékoztató.</p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-gray-100 pb-4">
                    <button
                        onClick={() => setActiveTab('impresszum')}
                        className={`flex items-center gap-2 pb-2 px-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'impresszum' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'}`}
                    >
                        <Info size={16} /> Impresszum
                    </button>
                    <button
                        onClick={() => setActiveTab('gdpr')}
                        className={`flex items-center gap-2 pb-2 px-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'gdpr' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'}`}
                    >
                        <ShieldAlert size={16} /> Adatkezelési Tájékoztató
                    </button>
                    <button
                        onClick={() => setActiveTab('accessibility')}
                        className={`flex items-center gap-2 pb-2 px-4 font-bold text-sm transition-all border-b-2 ${activeTab === 'accessibility' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'}`}
                    >
                        <FileText size={16} /> Akadálymentesítés
                    </button>
                </div>

                <div className="bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-sm prose prose-sm max-w-none text-primary leading-relaxed">
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="animate-spin text-accent" size={32} />
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-300">

                            {activeTab === 'impresszum' && (
                                <>
                                    <h2 className="font-serif text-2xl font-bold text-primary border-b border-gray-50 pb-3 mb-6">Hivatalos Impresszum</h2>

                                    <div dangerouslySetInnerHTML={{ __html: settings?.impressumText || defaultImpressum }} />

                                    <div className="bg-secondary/40 p-6 rounded-2xl border border-gray-100/50 mt-8">
                                        <h4 className="font-bold text-accent uppercase tracking-wider text-xs mb-2">Törvényi kötelező Tárhelyszolgáltatói adatok:</h4>
                                        <div
                                            className="text-sm m-0 prose-p:m-0"
                                            dangerouslySetInnerHTML={{ __html: settings?.hostingProviderText || defaultHostingProvider }}
                                        />
                                    </div>
                                </>
                            )}

                            {activeTab === 'gdpr' && (
                                <>
                                    <h2 className="font-serif text-2xl font-bold text-primary border-b border-gray-50 pb-3 mb-6">Adatkezelési Tájékoztató (Kivonat)</h2>
                                    <div dangerouslySetInnerHTML={{ __html: settings?.gdprText || defaultGdpr }} />
                                </>
                            )}

                            {activeTab === 'accessibility' && (
                                <>
                                    <h2 className="font-serif text-2xl font-bold text-primary border-b border-gray-50 pb-3 mb-6">Akadálymentesítési Nyilatkozat</h2>
                                    <div dangerouslySetInnerHTML={{ __html: settings?.accessibilityText || defaultAccessibility }} />
                                </>
                            )}

                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};