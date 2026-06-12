import { useEffect, useState } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import apiClient from '../../api/apiClient';
import { type DocumentFile } from '../../types/Municipality';
import { type PaginatedResult } from '../../api/articleService';
import { DocumentItem } from '../../features/documents/components/DocumentItem';
import { Laptop, HelpCircle, Search } from 'lucide-react';

export const EAdministrationPage = () => {
    const [docs, setDocs] = useState<DocumentFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        apiClient.get<PaginatedResult<DocumentFile>>('/documents', {
            params: { categoryId: 2, pageNumber: 1, pageSize: 100 }
        })
            .then((response: any) => {
                setDocs(response.data && Array.isArray(response.data.items) ? response.data.items : []);
            })
            .catch(() => setDocs([]))
            .finally(() => setLoading(false));
    }, []);

    const filteredDocs = docs.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <Laptop size={48} className="mx-auto text-accent mb-6" />
                    <h1 className="text-5xl font-serif font-bold text-primary mb-4">Elektronikus Ügyintézés</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Töltse le a hivatali ügyintézéshez szükséges nyomtatványokat, kérelmeket, és olvassa el a felhasználói útmutatókat.
                    </p>
                </div>

                <div className="bg-secondary/40 rounded-[40px] p-8 md:p-10 border border-gray-100 flex gap-6 items-start mb-12">
                    <div className="p-4 bg-white text-accent rounded-2xl shadow-sm hidden sm:block flex-shrink-0">
                        <HelpCircle size={24} />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-serif font-bold text-primary">Hogyan intézheti ügyeit online?</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Önkormányzatunk hivatalos ügyeit az országos <span className="font-bold text-primary">E-Önkormányzat Portálon</span> keresztül is intézheti elektronikus azonosítással (Ügyfélkapu). Az alábbi listában található egyedi nádasdladányi űrlapokat és nyomtatványokat kinyomtatva, kitöltve személyesen vagy postai úton is eljuttathatja a kirendeltségünkre.
                        </p>
                        <div className="pt-2">
                            <a
                                href="https://ohp-20.asp.lgov.hu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex text-xs font-bold uppercase tracking-wider text-white bg-accent px-6 py-3 rounded-full hover:scale-105 transition-all shadow-sm"
                            >
                                Irány az E-Önkormányzat Portál →
                            </a>
                        </div>
                    </div>
                </div>

                <div className="relative mb-8">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Keressen az űrlapok, kérelmek megnevezése között..."
                        className="w-full pl-14 pr-6 py-4 rounded-full border border-gray-100 focus:border-accent outline-none shadow-sm transition-all text-sm"
                        value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-20 font-serif italic text-accent text-xl animate-pulse">Űrlapok betöltése...</div>
                    ) : filteredDocs.length > 0 ? (
                        filteredDocs.map((doc) => (
                            <DocumentItem key={doc.id} doc={doc} />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200 text-gray-400 text-sm italic">
                            Jelenleg nincs feltöltött egyedi hivatali nyomtatvány.
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};