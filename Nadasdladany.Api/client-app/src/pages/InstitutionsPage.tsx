import { MainLayout } from '../layouts/MainLayout';
import { institutionService } from '../api/institutionService';
import { InstitutionCard } from '../features/institutions/components/InstitutionCard';
import { Building2, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export const InstitutionsPage = () => {
    const { data: institutions = [], isLoading: loading } = useQuery({
        queryKey: ['publicInstitutions'],
        queryFn: () => institutionService.getInstitutions()
    });

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-20">
                    <Building2 size={48} className="mx-auto text-accent mb-6" />
                    <h1 className="text-5xl font-serif font-bold text-primary mb-4">Intézményeink</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Ismerje meg községünk közszolgáltatásait és oktatási, nevelési, egészségügyi intézményeit.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20 font-serif italic text-accent text-xl animate-pulse flex flex-col items-center justify-center gap-3">
                        <Loader2 className="animate-spin" size={32} />
                        Intézmények betöltése...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {institutions.length > 0 ? (
                            institutions.map((inst, index) => (
                                <InstitutionCard key={inst.id} inst={inst} index={index} />
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-400 italic">
                                Az intézmények listája hamarosan frissül.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </MainLayout>
    );
};