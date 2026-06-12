import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { projectService, type Project } from '../../api/projectService';
import { ProjectForm } from '../../features/admin/projects/components/ProjectForm';
import { Plus, Calendar, FileCode } from 'lucide-react';
import toast from 'react-hot-toast';

export const AdminProjectsPage = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchProjects = async () => {
        try {
            const data = await projectService.getProjects(1, 100);
            setProjects(data && Array.isArray(data.items) ? data.items : []);
        } catch (err) {
            toast.error("Hiba a pályázatok betöltésekor");
        }
    };

    useEffect(() => { fetchProjects(); }, []);

    const handleSubmit = async (formData: FormData) => {
        setLoading(true);
        try {
            await projectService.createProject(formData);
            toast.success("Pályázat sikeresen rögzítve!");
            setIsFormOpen(false);
            fetchProjects();
        } catch (err) {
            toast.error("Hiba a mentés során");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-primary">Pályázatok kezelése</h1>
                    <p className="text-gray-400 mt-1">Önkormányzati és EU-s projektek nyilvántartása.</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-accent text-primary font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-lg"
                >
                    <Plus size={20} /> Új pályázat
                </button>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-widest text-gray-400">
                            <th className="px-8 py-5">Projekt neve</th>
                            <th className="px-8 py-5">Kód / Azonosító</th>
                            <th className="px-8 py-5">Támogatás összege</th>
                            <th className="px-8 py-5">Dátum</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {projects.map((proj) => (
                            <tr key={proj.id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-8 py-5 font-medium text-primary">{proj.title}</td>
                                <td className="px-8 py-5 text-sm text-gray-500">
                                    <span className="flex items-center gap-1.5"><FileCode size={14} className="text-accent" /> {proj.projectCode || '-'}</span>
                                </td>
                                <td className="px-8 py-5 text-sm font-bold text-primary">
                                    {proj.totalFunding || '-'} <span className="text-xs text-gray-400 font-normal">({proj.supportRate})</span>
                                </td>
                                <td className="px-8 py-5 text-sm text-gray-400">
                                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(proj.createdAt).toLocaleDateString('hu-HU')}</span>
                                </td>
                            </tr>
                        ))}
                        {projects.length === 0 && (
                            <tr>
                                <td colSpan={4} className="text-center py-10 text-gray-400 italic">Nincsenek még rögzített pályázatok.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isFormOpen && (
                <ProjectForm onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} loading={loading} />
            )}
        </AdminLayout>
    );
};