import { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { organizationService, OrganizationType } from '../api/organizationService';
import { OrganizationCard } from '../features/organizations/components/OrganizationCard';
import { Users, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export const OrganizationsPage = () => {
    const [activeTab, setActiveTab] = useState<OrganizationType | 'all'>('all');

    const { data: orgs = [], isLoading: loading } = useQuery({
        queryKey: ['publicOrganizations', activeTab],
        queryFn: () => {
            const typeParam = activeTab === 'all' ? undefined : activeTab;
            return organizationService.getOrganizations(typeParam);
        }
    });

    return (
        <MainLayout>
            <div className="max-w-5xl mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <Users size={48} className="mx-auto text-accent mb-6" />
                    <h1 className="text-5xl font-serif font-bold text-primary mb-4">Szervezetek és Közösségek</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">Ismerje meg Nádasdladány aktív civil szervezeteit, alapítványait és történelmi egyházait.</p>
                </div>

                <div className="flex justify-center mb-12">
                    <div className="inline-flex bg-secondary p-1.5 rounded-full border border-gray-100 flex-wrap justify-center gap-1 sm:gap-0">
                        <button onClick={() => setActiveTab('all')} className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${activeTab === 'all' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-primary'}`}>Összes</button>
                        <button onClick={() => setActiveTab(OrganizationType.CivilSzervezet)} className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${activeTab === OrganizationType.CivilSzervezet ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-primary'}`}>Civil szervezetek</button>
                        <button onClick={() => setActiveTab(OrganizationType.Egyhaz)} className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${activeTab === OrganizationType.Egyhaz ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-primary'}`}>Egyházak</button>
                        <button onClick={() => setActiveTab(OrganizationType.Alapitvany)} className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${activeTab === OrganizationType.Alapitvany ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-primary'}`}>Alapítványok</button>
                    </div>
                </div>

                <div className="space-y-6">
                    {loading ? (
                        <div className="text-center py-20 font-serif italic text-accent text-xl animate-pulse flex flex-col items-center justify-center gap-3">
                            <Loader2 className="animate-spin" size={32} />
                            Közösségek betöltése...
                        </div>
                    ) : orgs.length > 0 ? (
                        orgs.map((org, index) => <OrganizationCard key={org.id} org={org} index={index} />)
                    ) : (
                        <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200 text-gray-400">Jelenleg nincs megjeleníthető közösség ebben a kategóriában.</div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};