import { useEffect, useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { municipalityService } from '../api/municipalityService';
// JAVÍTÁS: 'import type' használata a típusokhoz
import type { Representative, DocumentFile } from '../types/Municipality';
import { RepresentativeCard } from '../features/municipality/components/RepresentativeCard';
import { DocumentItem } from '../features/documents/components/DocumentItem';
import { Building2, Users, FolderOpen, Search } from 'lucide-react';
// JAVÍTÁS: 'motion' import eltávolítva, mert nem volt használva ebben a fájlban

export const MunicipalityPage = () => {
    const [reps, setReps] = useState<Representative[]>([]);
    const [docs, setDocs] = useState<DocumentFile[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        municipalityService.getRepresentatives().then(setReps);
        municipalityService.getDocuments().then(setDocs);
    }, []);

    const filteredDocs = docs.filter(d =>
        d.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* FEJLÉC */}
                <div className="text-center mb-20">
                    <Building2 size={48} className="mx-auto text-accent mb-6" />
                    <h1 className="text-5xl font-serif font-bold text-primary mb-4">Önkormányzat</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">Nádasdladány Község Önkormányzatának hivatalos adatai, képviselői és dokumentumtára.</p>
                </div>

                {/* TESTÜLET SZEKCIÓ */}
                <section className="mb-32">
                    <div className="flex items-center gap-4 mb-12">
                        <Users className="text-accent" />
                        <h2 className="text-3xl font-serif font-bold text-primary">Képviselő-testület</h2>
                        <div className="h-px flex-grow bg-gray-100" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {reps.map((rep, index) => (
                            <RepresentativeCard key={rep.id} rep={rep} index={index} />
                        ))}
                    </div>
                </section>

                {/* DOKUMENTUMTÁR SZEKCIÓ */}
                <section>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                        <div className="flex items-center gap-4">
                            <FolderOpen className="text-accent" />
                            <h2 className="text-3xl font-serif font-bold text-primary">Dokumentumtár</h2>
                        </div>

                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                placeholder="Keresés a dokumentumok között..."
                                className="w-full pl-12 pr-6 py-3 rounded-full border border-gray-100 focus:border-accent outline-none shadow-sm transition-all"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {filteredDocs.length > 0 ? (
                            filteredDocs.map((doc) => (
                                <DocumentItem key={doc.id} doc={doc} />
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200 text-gray-400">
                                Nincs a keresésnek megfelelő dokumentum.
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
};