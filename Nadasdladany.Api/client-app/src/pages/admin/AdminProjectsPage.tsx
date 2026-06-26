import { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { projectService, type Project } from '../../api/projectService';
import { ProjectForm } from '../../features/admin/projects/components/ProjectForm';
import { Plus, Calendar, FileCode, Loader2, Edit2, Trash2, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const AdminProjectsPage = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);

    const { data: projects = [], refetch, isLoading } = useQuery({
        queryKey: ['adminProjects'],
        queryFn: async () => {
            const data = await projectService.getProjects(1, 100);
            return data && Array.isArray(data.items) ? data.items : [];
        }
    });

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            if (editingProject) {
                await projectService.updateProject(editingProject.id, formData);
                toast.success("Pályázat adatai frissítve!");
            } else {
                await projectService.createProject(formData);
                toast.success("Pályázat sikeresen rögzítve!");
            }
            setIsFormOpen(false);
            setEditingProject(null);
            refetch();
        } catch (err) {
            toast.error("Hiba a mentés során");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Biztosan törölni szeretné ezt a pályázatot? Minden kapcsolódó fájl is elvész!")) return;
        try {
            await projectService.deleteProject(id);
            toast.success("Pályázat törölve!");
            refetch();
        } catch (err) {
            toast.error("Hiba a törlés során.");
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-primary">Pályázatok kezelése</h1>
                    <p className="text-gray-400 mt-1">Önkormányzati és EU-s projektek nyilvántartása.</p>
                </div>
                <button onClick={() => { setEditingProject(null); setIsFormOpen(true); }} className="flex items-center gap-2 bg-accent text-primary font-bold px-8 py-4 rounded-full hover:scale-105 transition-all shadow-lg cursor-pointer">
                    <Plus size={20} /> Új pályázat
                </button>
            </div>

            <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center py-20"><Loader2 className="animate-spin text-accent" size={32} /></div>
                ) : (
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold uppercase tracking-widest text-gray-400">
                                <th className="px-8 py-5">Projekt neve</th>
                                <th className="px-8 py-5">Kód / Azonosító</th>
                                <th className="px-8 py-5">Támogatás összege</th>
                                <th className="px-8 py-5">Dátum</th>
                                <th className="px-8 py-5 text-right">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {projects.map((proj) => (
                                <tr key={proj.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5 font-medium text-primary line-clamp-2 max-w-sm">{proj.title}</td>
                                    <td className="px-8 py-5 text-sm text-gray-500"><span className="flex items-center gap-1.5"><FileCode size={14} className="text-accent" /> {proj.projectCode || '-'}</span></td>
                                    <td className="px-8 py-5 text-sm font-bold text-primary whitespace-nowrap">{proj.totalFunding || '-'} <span className="text-xs text-gray-400 font-normal">({proj.supportRate})</span></td>
                                    <td className="px-8 py-5 text-sm text-gray-400 whitespace-nowrap"><span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(proj.createdAt).toLocaleDateString('hu-HU')}</span></td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a href="/palyazatok" target="_blank" rel="noreferrer" className="p-2 text-gray-400 hover:text-accent transition-colors cursor-pointer" title="Megtekintés az oldalon">
                                                <ExternalLink size={18} />
                                            </a>
                                            <button onClick={() => { setEditingProject(proj); setIsFormOpen(true); }} className="p-2 text-gray-400 hover:text-primary transition-colors cursor-pointer" title="Szerkesztés">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(proj.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors cursor-pointer" title="Törlés">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {projects.length === 0 && <tr><td colSpan={5} className="text-center py-10 text-gray-400 italic">Nincsenek még rögzített pályázatok.</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>

            {isFormOpen && <ProjectForm project={editingProject} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmit} loading={isSubmitting} />}
        </AdminLayout>
    );
};