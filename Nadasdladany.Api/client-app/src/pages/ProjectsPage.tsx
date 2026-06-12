import { useEffect, useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { projectService, type Project } from '../api/projectService';
import { getImageUrl } from '../lib/imageUtils';
import { FileCode, Award, Coins, Calendar } from 'lucide-react';

export const ProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        projectService.getProjects(1, 50)
            .then(data => setProjects(data && Array.isArray(data.items) ? data.items : []))
            .catch(() => setProjects([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-16">
                {/* Fejléc */}
                <div className="text-center mb-20">
                    <Award size={48} className="mx-auto text-accent mb-6" />
                    <h1 className="text-5xl font-serif font-bold text-primary mb-4">Pályázatok és Fejlesztések</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">
                        Nádasdladány Község Önkormányzata által elnyert hazai és európai uniós támogatású projektek hivatalos dokumentációja.
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20 font-serif italic text-accent text-xl animate-pulse">
                        Pályázatok betöltése...
                    </div>
                ) : projects.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {projects.map((proj) => (
                            <div key={proj.id} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col">
                                {proj.featuredImageUrl && (
                                    <div className="h-64 overflow-hidden relative">
                                        <img
                                            src={getImageUrl(proj.featuredImageUrl)}
                                            alt={proj.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                    </div>
                                )}

                                <div className="p-8 md:p-10 flex-grow flex flex-col">
                                    <h3 className="text-2xl font-serif font-bold text-primary mb-4 leading-tight">
                                        {proj.title}
                                    </h3>

                                    <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-grow">
                                        {proj.excerpt || "Kattintson a részletekért és a teljes tartalom megtekintéséhez."}
                                    </p>

                                    {/* Pályázati Infó rács */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-50 pt-6 text-sm text-gray-400">
                                        {proj.projectCode && (
                                            <div className="flex items-center gap-2 truncate">
                                                <FileCode size={16} className="text-accent flex-shrink-0" />
                                                <span className="truncate" title={proj.projectCode}>Azonosító: {proj.projectCode}</span>
                                            </div>
                                        )}
                                        {proj.totalFunding && (
                                            <div className="flex items-center gap-2">
                                                <Coins size={16} className="text-accent flex-shrink-0" />
                                                <span>Támogatás: {proj.totalFunding}</span>
                                            </div>
                                        )}
                                        {proj.supportRate && (
                                            <div className="flex items-center gap-2">
                                                <Award size={16} className="text-accent flex-shrink-0" />
                                                <span>Intenzitás: {proj.supportRate}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2">
                                            <Calendar size={16} className="text-accent flex-shrink-0" />
                                            <span>{new Date(proj.createdAt).toLocaleDateString('hu-HU')}</span>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-50 prose prose-sm max-w-none text-primary"
                                        dangerouslySetInnerHTML={{ __html: proj.content }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200 text-gray-400">
                        Jelenleg nincs megjeleníthető pályázat.
                    </div>
                )}
            </div>
        </MainLayout>
    );
};