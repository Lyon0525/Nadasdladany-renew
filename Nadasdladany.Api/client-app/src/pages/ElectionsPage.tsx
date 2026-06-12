import { useEffect, useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import apiClient from '../api/apiClient';
import { type DocumentFile } from '../types/Municipality';
import { type PaginatedResult } from '../api/articleService';
import { DocumentItem } from '../features/documents/components/DocumentItem';
import { electionApiService, type ElectionResult } from '../api/electionApiService';
import { Vote, FileText, Search, BarChart3, Users, CheckCircle2, Percent } from 'lucide-react';

export const ElectionsPage = () => {
    const [docs, setDocs] = useState<DocumentFile[]>([]);
    const [loadingDocs, setLoadingDocs] = useState(true);
    const [selectedYear, setSelectedYear] = useState<number>(2024);
    const [searchTerm, setSearchTerm] = useState('');

    // 🌟 API állapotok
    const [apiResult, setApiResult] = useState<ElectionResult | null>(null);
    const [loadingApi, setLoadingApi] = useState(false);
    const [activeSubTab, setActiveSubTab] = useState<'results' | 'documents'>('results');

    // 1. Dokumentumok betöltése a backendről
    useEffect(() => {
        setLoadingDocs(true);
        apiClient.get<PaginatedResult<DocumentFile>>('/documents', {
            params: { categoryId: 5, pageNumber: 1, pageSize: 100 }
        })
            .then(response => {
                setDocs(response.data && Array.isArray(response.data.items) ? response.data.items : []);
            })
            .catch(() => setDocs([]))
            .finally(() => setLoadingDocs(false));
    }, []);

    // 2. Éles választási API adatok betöltése
    useEffect(() => {
        setLoadingApi(true);
        electionApiService.getNadasdladanyResults(selectedYear)
            .then(setApiResult)
            .finally(() => setLoadingApi(false));
    }, [selectedYear]);

    // Dokumentum szűrés
    const filteredDocs = docs.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
        const docYear = new Date(doc.publishedDate).getFullYear().toString();
        const containsYear = doc.title.includes(selectedYear.toString()) || docYear === selectedYear.toString();
        return matchesSearch && containsYear;
    });

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Fejléc */}
                <div className="text-center mb-12">
                    <Vote size={48} className="mx-auto text-accent mb-6" />
                    <h1 className="text-5xl font-serif font-bold text-primary mb-4">Választási Információk</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Nádasdladány Község Helyi Választási Irodájának közleményei és a hivatalos választási API adatok.
                    </p>
                </div>

                {/* Évszám választó sáv */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex bg-secondary p-1.5 rounded-full border border-gray-100">
                        {[2026, 2024, 2019].map((year) => (
                            <button
                                key={year}
                                onClick={() => setSelectedYear(year)}
                                className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all ${selectedYear === year
                                        ? 'bg-primary text-white shadow-md'
                                        : 'text-gray-400 hover:text-primary'
                                    }`}
                            >
                                {year === 2026 ? '2026 (Aktuális)' : `${year}. évi adatok`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Al-fülek: Eredmények vagy Dokumentumok */}
                <div className="flex justify-center gap-4 mb-12 border-b border-gray-100 pb-4">
                    <button
                        onClick={() => setActiveSubTab('results')}
                        className={`flex items-center gap-2 pb-2 px-4 font-bold text-sm transition-all border-b-2 ${activeSubTab === 'results' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'}`}
                    >
                        <BarChart3 size={16} /> Hivatalos API Eredmények
                    </button>
                    <button
                        onClick={() => setActiveSubTab('documents')}
                        className={`flex items-center gap-2 pb-2 px-4 font-bold text-sm transition-all border-b-2 ${activeSubTab === 'documents' ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary'}`}
                    >
                        <FileText size={16} /> Határozatok & Hirdetmények
                    </button>
                </div>

                {/* 🌟 1. AL-FÜL: DINAMIKUS API EREDMÉNYEK */}
                {activeSubTab === 'results' && (
                    <div className="space-y-8 animate-in fade-in duration-300">
                        {loadingApi ? (
                            <div className="text-center py-20 font-serif italic text-accent text-xl animate-pulse">API adatok lekérése...</div>
                        ) : apiResult ? (
                            <>
                                {/* Statisztikai kártyák */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
                                        <div className="p-3 bg-secondary rounded-xl text-accent"><Users size={20} /></div>
                                        <div>
                                            <span className="text-xs text-gray-400 block font-bold uppercase">Választásra jogosultak</span>
                                            <span className="text-xl font-bold text-primary">{apiResult.registeredVoters.toLocaleString('hu-HU')} fő</span>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
                                        <div className="p-3 bg-secondary rounded-xl text-accent"><CheckCircle2 size={20} /></div>
                                        <div>
                                            <span className="text-xs text-gray-400 block font-bold uppercase">Leadott szavazatok</span>
                                            <span className="text-xl font-bold text-primary">{apiResult.votedCount.toLocaleString('hu-HU')} fő</span>
                                        </div>
                                    </div>
                                    <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4">
                                        <div className="p-3 bg-secondary rounded-xl text-accent"><Percent size={20} /></div>
                                        <div>
                                            <span className="text-xs text-gray-400 block font-bold uppercase">Részvételi arány</span>
                                            <span className="text-xl font-bold text-accent">{apiResult.turnoutPercentage}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Jelöltek listája és szavazati arány grafikonok */}
                                <div className="bg-white p-8 md:p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-6">
                                    <h3 className="text-2xl font-serif font-bold text-primary mb-6">{apiResult.type} - Nádasdladány</h3>

                                    <div className="space-y-6">
                                        {apiResult.results.map((candidate, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="flex justify-between items-end text-sm">
                                                    <div>
                                                        <span className="font-bold text-base text-primary flex items-center gap-2">
                                                            {candidate.candidateName}
                                                            {candidate.isWinner && <span className="text-[10px] uppercase font-bold tracking-wider bg-green-50 text-green-600 px-2 py-0.5 rounded-full">Megválasztva</span>}
                                                        </span>
                                                        <span className="text-xs text-gray-400">{candidate.organization}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-bold text-primary block">{candidate.votesCount} szavazat</span>
                                                        <span className="text-xs text-accent font-bold">{candidate.percentage}%</span>
                                                    </div>
                                                </div>
                                                {/* Egyedi CSS alapú sávdiagram vizualizáció */}
                                                <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full transition-all duration-1000 ${candidate.isWinner ? 'bg-accent' : 'bg-gray-300'}`}
                                                        style={{ width: `${candidate.percentage}%` }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200 text-gray-400">
                                {selectedYear === 2026 ? (
                                    "A 2026-os választási adatszolgáltatás a hivatalos kampányidőszak kezdetekor és a szavazás napján válik aktívvá."
                                ) : (
                                    "Ehhez az évszámhoz nem érhetők el adatok az API-ban."
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* 🌟 2. AL-FÜL: STATIKUS JOGI DOKUMENTUMOK */}
                {activeSubTab === 'documents' && (
                    <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="relative mb-8">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Keresés a választási határozatok között..."
                                className="w-full pl-11 pr-6 py-3 rounded-full border border-gray-100 focus:border-accent outline-none text-sm transition-all"
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4">
                            {loadingDocs ? (
                                <div className="text-center py-20 font-serif italic text-accent text-xl animate-pulse">Dokumentumok betöltése...</div>
                            ) : filteredDocs.length > 0 ? (
                                filteredDocs.map((doc) => <DocumentItem key={doc.id} doc={doc} />)
                            ) : (
                                <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200 text-gray-400 text-sm italic">
                                    Nincsenek feltöltött választási dokumentumok ehhez az évszámhoz.
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
};