import { useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import { jobService } from '../api/jobService';
import { Briefcase, Calendar, Building, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export const CareersPage = () => {
    const [expandedJobId, setExpandedJobId] = useState<number | null>(null);

    const { data: jobs = [], isLoading: loading } = useQuery({
        queryKey: ['publicJobs'],
        queryFn: () => jobService.getActiveJobs()
    });

    const toggleExpand = (id: number) => {
        setExpandedJobId(expandedJobId === id ? null : id);
    };

    return (
        <MainLayout>
            <div className="max-w-4xl mx-auto px-6 py-16">
                <div className="text-center mb-16">
                    <Briefcase size={48} className="mx-auto text-accent mb-6" />
                    <h1 className="text-5xl font-serif font-bold text-primary mb-4">Álláshirdetések</h1>
                    <p className="text-gray-500">Karrierlehetőségek és nyitott pozíciók Nádasdladány Község intézményeiben.</p>
                </div>

                {loading ? (
                    <div className="text-center py-20 font-serif italic text-accent text-xl animate-pulse flex flex-col items-center justify-center gap-3">
                        <Loader2 className="animate-spin" size={32} />
                        Álláspályázatok betöltése...
                    </div>
                ) : jobs.length > 0 ? (
                    <div className="space-y-6">
                        {jobs.map((job) => {
                            const isExpanded = expandedJobId === job.id;
                            return (
                                <div key={job.id} className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                                    <div
                                        onClick={() => toggleExpand(job.id)}
                                        className="p-8 cursor-pointer flex justify-between items-center gap-4 select-none"
                                    >
                                        <div className="space-y-3 flex-grow">
                                            <h3 className="text-2xl font-serif font-bold text-primary leading-tight group-hover:text-accent">{job.title}</h3>

                                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-gray-400">
                                                {job.department && <span className="flex items-center gap-1.5"><Building size={14} className="text-accent" /> {job.department}</span>}
                                                {job.employmentType && <span className="flex items-center gap-1.5"><Briefcase size={14} className="text-accent" /> {job.employmentType}</span>}
                                                {job.applicationDeadline && (
                                                    <span className="flex items-center gap-1.5 text-red-500 font-bold">
                                                        <Calendar size={14} /> Határidő: {new Date(job.applicationDeadline).toLocaleDateString('hu-HU')}
                                                    </span>
                                                )}
                                            </div>
                                            {job.excerpt && !isExpanded && <p className="text-gray-500 text-sm pt-1">{job.excerpt}</p>}
                                        </div>
                                        <div className="p-3 bg-secondary rounded-full text-primary/50">
                                            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </div>
                                    </div>

                                    {isExpanded && (
                                        <div className="px-8 pb-8 pt-2 border-t border-gray-50 bg-gray-50/20 animate-in fade-in duration-300">
                                            <div className="prose prose-sm max-w-none text-primary"
                                                dangerouslySetInnerHTML={{ __html: job.content }} />

                                            <div className="mt-8 p-6 bg-secondary/40 rounded-2xl border border-gray-100 text-xs text-gray-500 leading-relaxed">
                                                <p className="font-bold text-primary mb-1">Jelentkezés módja:</p>
                                                A pályázatokat elektronikus úton az <span className="font-bold text-primary">info@nadasdladany.hu</span> címre, vagy személyesen/postai úton a Polgármesteri Hivatal címére (8145 Nádasdladány, Fő utca 1.) kérjük benyújtani a megadott határidőig.
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200 text-gray-400">
                        Jelenleg nincs aktív álláshirdetés községünkben.
                    </div>
                )}
            </div>
        </MainLayout>
    );
};