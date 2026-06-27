import { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { documentService } from '../api/documentService';
import { DocumentItem } from '../features/documents/components/DocumentItem';
import { FileText, Search, Scale, Coins, ShieldCheck, Folder, HelpCircle, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export const DocumentsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState<'all' | 'rendelet' | 'budget' | 'contracts' | 'eselyegyenloseg' | 'kozerdeku'>('all');

    const { data: docsData, isLoading: loading } = useQuery({
        queryKey: ['publicDocuments'],
        queryFn: () => documentService.getDocuments(1, 200)
    });

    const allDocuments = docsData && Array.isArray(docsData.items) ? docsData.items : [];

    const filteredDocuments = allDocuments.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));

        if (!matchesSearch) return false;

        switch (activeTab) {
            case 'rendelet':
                return doc.documentCategoryId === 1 || doc.title.toLowerCase().includes('rendelet');
            case 'budget':
                const t = doc.title.toLowerCase();
                return t.includes('költségvetés') || t.includes('zárszámadás') || t.includes('pénzügy') || t.includes('zárszámadási');
            case 'contracts':
                const c = doc.title.toLowerCase();
                return c.includes('szerződés') || c.includes('vállalkozási') || c.includes('szabályzat') || c.includes('szerződések');
            case 'eselyegyenloseg':
                const titleLower = doc.title.toLowerCase();
                return titleLower.includes('esélyegyenlőség') || titleLower.includes('hep') || titleLower.includes('közzététel') || titleLower.includes('program');
            case 'kozerdeku':
                return doc.documentCategoryId === 4 || doc.title.toLowerCase().includes('jegyzőkönyv') || doc.title.toLowerCase().includes('kivonat');
            default:
                return true;
        }
    });

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <FileText size={48} className="mx-auto text-accent mb-6" />
                    <h1 className="text-5xl font-serif font-bold text-primary mb-4">Hivatali Dokumentumtár</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Nádasdladány Község Önkormányzatának hivatalos rendeletei, költségvetési adatai és kötelező közzétételi listái.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10 items-start">
                    <div className="lg:col-span-1 bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block pl-3 mb-3">Dokumentum Típusok</span>

                        <button
                            onClick={() => { setActiveTab('all'); setSearchTerm(''); }}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'all' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-secondary/50 hover:text-primary'}`}
                        >
                            <Folder size={16} /> Összes dokumentum
                        </button>

                        <button
                            onClick={() => { setActiveTab('rendelet'); setSearchTerm(''); }}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'rendelet' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-secondary/50 hover:text-primary'}`}
                        >
                            <Scale size={16} /> Önkormányzati rendeleteink
                        </button>

                        <button
                            onClick={() => { setActiveTab('budget'); setSearchTerm(''); }}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'budget' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-secondary/50 hover:text-primary'}`}
                        >
                            <Coins size={16} /> Költségvetés & Zárszámadás
                        </button>

                        <button
                            onClick={() => { setActiveTab('contracts'); setSearchTerm(''); }}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'contracts' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-secondary/50 hover:text-primary'}`}
                        >
                            <Scale size={16} /> Szerződések & Szabályzatok
                        </button>

                        <button
                            onClick={() => { setActiveTab('eselyegyenloseg'); setSearchTerm(''); }}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'eselyegyenloseg' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-secondary/50 hover:text-primary'}`}
                        >
                            <ShieldCheck size={16} /> Közzétételi lista & HEP
                        </button>

                        <button
                            onClick={() => { setActiveTab('kozerdeku'); setSearchTerm(''); }}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${activeTab === 'kozerdeku' ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:bg-secondary/50 hover:text-primary'}`}
                        >
                            <FileText size={16} /> Jegyzőkönyvek & Közérdekű
                        </button>
                    </div>

                    <div className="lg:col-span-3 space-y-6">
                        <div className="relative">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Keresés a kiválasztott kategória dokumentumai között (pl. évszám, kulcsszó)..."
                                className="w-full pl-14 pr-6 py-4 rounded-full border border-gray-100 focus:border-accent outline-none shadow-sm transition-all text-sm bg-white"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-20 font-serif italic text-accent text-xl animate-pulse flex flex-col items-center justify-center gap-3">
                                    <Loader2 className="animate-spin" size={32} />
                                    Dokumentumok betöltése...
                                </div>
                            ) : filteredDocuments.length > 0 ? (
                                filteredDocuments.map((doc) => (
                                    <DocumentItem key={doc.id} doc={doc} />
                                ))
                            ) : (
                                <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200 text-gray-400 text-sm flex flex-col items-center justify-center gap-2">
                                    <HelpCircle size={32} className="text-gray-300" />
                                    <span>Ebben a hivatali kategóriában jelenleg nincs a keresési feltételnek megfelelő dokumentum.</span>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
};