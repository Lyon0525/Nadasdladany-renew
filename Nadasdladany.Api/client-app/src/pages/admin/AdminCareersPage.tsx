import { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { jobService } from '../../api/jobService';
import { JobForm } from '../../features/admin/jobs/components/JobForm';
import { Plus, Calendar, Building, ExternalLink, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const AdminCareersPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: jobs = [], refetch, isLoading } = useQuery({
        queryKey: ['adminJobs'],
        queryFn: () => jobService.getActiveJobs()
    });

    const handleSubmit = async (jobData: any) => {
        setIsSubmitting(true);
        try {
            await jobService.createJob(jobData);
            toast.success("Álláshirdetés sikeresen közzétéve!");
            setIsFormOpen(false);
            refetch();
        } catch (err) {
            toast.error("Hiba történt a rögzítés során!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-primary">Álláshirdetések kezelése</h1>
                    <p className="text-gray-400 mt-1">Önkormányzati, intézményi álláspályázatok és karrier lehetőségek adminisztrációja.</p>
                </div>
                <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 bg-accent text-primary font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-lg cursor-pointer">
                    <Plus size={20} /> Új pályázat kiírása
                </button>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" size={32} /></div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-widest text-gray-400">
                                <th className="px-8 py-5">Munkakör megnevezése</th>
                                <th className="px-8 py-5">Intézmény / Egység</th>
                                <th className="px-8 py-5">Határidő</th>
                                <th className="px-8 py-5 text-right">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {jobs.map((job) => (
                                <tr key={job.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5 font-bold text-primary">{job.title}</td>
                                    <td className="px-8 py-5 text-sm text-gray-500"><span className="flex items-center gap-1.5"><Building size={14} className="text-accent" /> {job.department || 'Önkormányzat'}</span></td>
                                    <td className="px-8 py-5 text-sm">
                                        {job.applicationDeadline ? (
                                            <span className="flex items-center gap-1.5 text-red-500 font-medium"><Calendar size={14} /> {new Date(job.applicationDeadline).toLocaleDateString('hu-HU')}</span>
                                        ) : <span className="text-gray-400 italic">Visszavonásig</span>}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a href="/allasok" target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-accent transition-colors cursor-pointer" title="Megtekintés az oldalon"><ExternalLink size={18} /></a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {jobs.length === 0 && <tr><td colSpan={4} className="text-center py-10 text-gray-400 italic">Jelenleg nincs aktív vagy kiírt álláspályázat.</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>

            {isFormOpen && <JobForm onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} loading={isSubmitting} />}
        </AdminLayout>
    );
};