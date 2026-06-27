import { X, Loader2 } from 'lucide-react';
import { RichTextEditor } from '../../../../components/ui/RichTextEditor';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { type JobPosting, type JobPostingSubmitData } from '../../../../api/jobService';

const jobSchema = z.object({
    title: z.string().min(1, "A munkakör neve kötelező!").max(200),
    department: z.string().optional(),
    employmentType: z.string().optional(),
    location: z.string().optional(),
    applicationDeadline: z.string().optional(),
    excerpt: z.string().max(300).optional(),
    content: z.string().min(5, "A pályázati kiírás kötelező!")
});

type JobFormData = z.infer<typeof jobSchema>;

interface Props {
    job?: JobPosting | null;
    onClose: () => void;
    onSubmit: (jobData: JobPostingSubmitData) => void;
    loading: boolean;
}

export const JobForm = ({ job, onClose, onSubmit, loading }: Props) => {
    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<JobFormData>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            title: job?.title || '',
            department: job?.department || '',
            employmentType: job?.employmentType || 'Közalkalmazotti jogviszony',
            location: job?.location || '8145 Nádasdladány, Fő utca 1.',
            applicationDeadline: job?.applicationDeadline ? job.applicationDeadline.split('T')[0] : '',
            excerpt: job?.excerpt || '',
            content: job?.content || ''
        }
    });

    const contentValue = watch('content');

    const onValidSubmit = (data: JobFormData) => {
        onSubmit({
            title: data.title,
            department: data.department || null,
            employmentType: data.employmentType || null,
            location: data.location || null,
            applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline).toISOString() : null,
            excerpt: data.excerpt || null,
            content: data.content
        });
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-end bg-primary/40 backdrop-blur-md">
            <div className="w-full max-w-3xl h-full bg-white shadow-2xl p-10 overflow-y-auto animate-in slide-in-from-right duration-500">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-primary">{job ? 'Hirdetés szerkesztése' : 'Új álláshirdetés'}</h2>
                    </div>
                    <button type="button" onClick={onClose} className="p-3 hover:bg-secondary rounded-full text-primary/50 cursor-pointer"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-6 pb-20">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Munkakör megnevezése *</label>
                        <input
                            type="text"
                            className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm font-medium ${errors.title ? 'border-red-400' : 'border-gray-100'}`}
                            {...register('title')}
                        />
                        {errors.title && <p className="text-red-500 text-[10px] font-bold mt-1.5">{errors.title.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Intézmény / Szervezeti egység</label>
                            <input type="text" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" {...register('department')} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Jogviszony</label>
                            <input type="text" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" {...register('employmentType')} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Munkavégzés helye</label>
                            <input type="text" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" {...register('location')} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Határidő (Opcionális)</label>
                            <input type="date" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm text-primary" {...register('applicationDeadline')} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Rövid kivonat</label>
                        <textarea rows={2} className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" {...register('excerpt')} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Pályázati kiírás *</label>
                        <div className={errors.content ? "rounded-3xl border border-red-400" : ""}>
                            <RichTextEditor
                                content={contentValue}
                                onChange={(html) => setValue('content', html, { shouldValidate: true })}
                                placeholder="Írja ide a pályázati felhívást és a részleteket..."
                            />
                        </div>
                        {errors.content && <p className="text-red-500 text-xs mt-2">{errors.content.message}</p>}
                    </div>

                    <div className="fixed bottom-0 right-0 w-full max-w-3xl p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 cursor-pointer">Mégse</button>
                        <button type="submit" disabled={loading} className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl hover:bg-accent flex justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50">
                            {loading ? <Loader2 className="animate-spin" /> : (job ? 'Módosítások mentése' : 'Pályázat közzététele')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};