import { useEffect } from 'react';
import { X, Loader2, Award, Plus, Trash2 } from 'lucide-react';
import { type ElectionResult, type ElectionSubmitData } from '../../../../api/electionApiService';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const candidateSchema = z.object({
    candidateName: z.string().min(1, "Név kötelező"),
    organization: z.string().min(1, "Szervezet kötelező"),
    votesCount: z.coerce.number().min(0, "A szavazat nem lehet negatív"),
    percentage: z.coerce.number().min(0).max(100, "Maximum 100%"),
    isWinner: z.boolean().default(false)
});

const electionSchema = z.object({
    year: z.coerce.number().min(1990, "Érvénytelen évszám"),
    type: z.string().min(1, "Megnevezés kötelező"),
    registeredVoters: z.coerce.number().min(0),
    votedCount: z.coerce.number().min(0),
    turnoutPercentage: z.coerce.number().min(0).max(100),
    results: z.array(candidateSchema).min(1, "Legalább egy jelölt rögzítése kötelező!")
});

type ElectionFormData = z.infer<typeof electionSchema>;

interface Props {
    election?: ElectionResult | null;
    onClose: () => void;
    onSubmit: (data: ElectionSubmitData) => void;
    loading: boolean;
}

export const ElectionForm = ({ election, onClose, onSubmit, loading }: Props) => {
    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm<ElectionFormData>({
        resolver: zodResolver(electionSchema) as any,
        defaultValues: {
            year: election?.year || new Date().getFullYear(),
            type: election?.type || 'Országgyűlési Képviselő Választás',
            registeredVoters: election?.registeredVoters || 0,
            votedCount: election?.votedCount || 0,
            turnoutPercentage: election?.turnoutPercentage || 0,
            results: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "results"
    });

    useEffect(() => {
        if (election && election.candidatesJson) {
            try {
                const parsed = JSON.parse(election.candidatesJson);
                setValue('results', parsed);
            } catch { }
        } else if (!election) {
            append({ candidateName: '', organization: '', votesCount: 0, percentage: 0, isWinner: false });
        }
    }, [election, setValue, append]);

    const votedCount = watch('votedCount');

    const calculatePercentage = (index: number, votes: number) => {
        if (votedCount > 0 && votes >= 0) {
            const perc = Number(((votes / votedCount) * 100).toFixed(2));
            setValue(`results.${index}.percentage`, perc);
        }
    };

    const onValidSubmit = (data: ElectionFormData) => {
        onSubmit(data);
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-end bg-primary/40 backdrop-blur-md">
            <div className="w-full max-w-4xl h-full bg-white shadow-2xl p-10 overflow-y-auto animate-in slide-in-from-right duration-500">
                <div className="flex justify-between items-center mb-10">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-primary">{election ? 'Eredmények szerkesztése' : 'Új választás rögzítése'}</h2>
                        <p className="text-gray-400 text-sm mt-1">Hivatalos statisztikák és jelölti eredmények adminisztrációja.</p>
                    </div>
                    <button type="button" onClick={onClose} className="p-3 hover:bg-secondary rounded-full text-primary/50 cursor-pointer"><X size={24} /></button>
                </div>

                <form onSubmit={handleSubmit(onValidSubmit, (err) => { toast.error("Kérjük ellenőrizze a pirossal jelölt mezőket!"); console.log(err); })} className="space-y-8 pb-20">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Választás Éve</label>
                            <input type="number" className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm font-bold text-primary ${errors.year ? 'border-red-400' : 'border-gray-100'}`} {...register('year')} />
                            {errors.year && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.year.message}</p>}
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Választás Hivatalos Megnevezése</label>
                            <input type="text" className={`w-full bg-secondary/50 border p-4 rounded-2xl outline-none focus:border-accent text-sm font-medium ${errors.type ? 'border-red-400' : 'border-gray-100'}`} {...register('type')} />
                            {errors.type && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.type.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Választásra jogosultak (fő)</label>
                            <input type="number" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" {...register('registeredVoters')} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Érvényes szavazatok (fő)</label>
                            <input type="number" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm" {...register('votedCount')} />
                        </div>
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Részvételi arány (%)</label>
                            <input type="number" step="0.01" className="w-full bg-secondary/50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-accent text-sm font-bold text-accent" {...register('turnoutPercentage')} />
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-gray-50">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-serif font-bold text-primary">Jelöltek és eredmények</h3>
                            <button
                                type="button" onClick={() => append({ candidateName: '', organization: '', votesCount: 0, percentage: 0, isWinner: false })}
                                className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent bg-accent/5 px-4 py-2 rounded-xl hover:bg-accent hover:text-white transition-all cursor-pointer"
                            >
                                <Plus size={14} /> Új jelölt hozzáadása
                            </button>
                        </div>

                        {errors.results?.root && <p className="text-red-500 text-sm font-bold">{errors.results.root.message}</p>}

                        <div className="space-y-3">
                            {fields.map((candidate, index) => (
                                <div key={candidate.id} className="flex flex-col md:flex-row gap-3 items-center bg-gray-50/50 p-4 rounded-2xl border border-gray-100">
                                    <div className="w-full md:flex-1">
                                        <input
                                            type="text" placeholder="Jelölt neve"
                                            className={`w-full bg-white border p-3 rounded-xl text-xs outline-none focus:border-accent font-bold ${errors.results?.[index]?.candidateName ? 'border-red-400' : 'border-gray-200'}`}
                                            {...register(`results.${index}.candidateName` as const)}
                                        />
                                    </div>
                                    <div className="w-full md:flex-1">
                                        <input
                                            type="text" placeholder="Jelölő szervezet"
                                            className={`w-full bg-white border p-3 rounded-xl text-xs outline-none focus:border-accent ${errors.results?.[index]?.organization ? 'border-red-400' : 'border-gray-200'}`}
                                            {...register(`results.${index}.organization` as const)}
                                        />
                                    </div>
                                    <div className="w-32">
                                        <input
                                            type="number" placeholder="Szavazat" title="Szavazatok száma"
                                            className="w-full bg-white border border-gray-200 p-3 rounded-xl text-xs outline-none focus:border-accent text-center font-semibold"
                                            {...register(`results.${index}.votesCount` as const, { onChange: (e) => calculatePercentage(index, Number(e.target.value)) })}
                                        />
                                    </div>
                                    <div className="w-24">
                                        <input
                                            type="number" step="0.01" placeholder="%" title="Százalékos arány"
                                            className="w-full bg-white border border-gray-200 p-3 rounded-xl text-xs outline-none focus:border-accent text-center font-bold text-accent"
                                            {...register(`results.${index}.percentage` as const)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-1.5 px-2">
                                        <label className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${watch(`results.${index}.isWinner`) ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-300 hover:text-green-500'}`} title="Megjelölés nyertesként">
                                            <input type="checkbox" className="hidden" {...register(`results.${index}.isWinner` as const)} />
                                            <Award size={16} />
                                        </label>
                                    </div>
                                    <button
                                        type="button" disabled={fields.length === 1}
                                        onClick={() => remove(index)}
                                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer disabled:opacity-30"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="fixed bottom-0 right-0 w-full max-w-4xl p-6 bg-white/80 backdrop-blur-md border-t border-gray-100 flex gap-4">
                        <button type="button" onClick={onClose} className="flex-1 py-4 rounded-2xl font-bold text-gray-400 hover:bg-gray-50 cursor-pointer">Mégse</button>
                        <button type="submit" disabled={loading} className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl hover:bg-accent flex justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50">
                            {loading ? <Loader2 className="animate-spin" /> : <>{election ? 'Eredmények frissítése' : 'Mentés és Publikálás'}</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};