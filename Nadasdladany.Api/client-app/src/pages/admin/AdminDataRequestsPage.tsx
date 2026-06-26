import { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { dataRequestService, type PublicDataRequest } from '../../api/dataRequestService';
import { Mail, Phone, Calendar, Loader2, CheckCircle2, Clock, Inbox } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const AdminDataRequestsPage = () => {
    const queryClient = useQueryClient();
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

    const { data: requests = [], isLoading, isError } = useQuery({
        queryKey: ['dataRequests'],
        queryFn: () => dataRequestService.getAllRequests(),
    });

    const handleToggleStatus = async (req: PublicDataRequest) => {
        const newStatus = !req.isProcessed;
        try {
            await dataRequestService.updateStatus(req.id, newStatus);
            toast.success(newStatus ? "Kérelem teljesítve!" : "Kérelem visszaállítva folyamatban lévőre.");
            queryClient.invalidateQueries({ queryKey: ['dataRequests'] });
        } catch {
            toast.error("Hiba történt a státusz frissítésekor.");
        }
    };

    if (isError) {
        return (
            <AdminLayout>
                <div className="text-red-500 font-bold p-6">Hiba történt az adatigénylések betöltésekor.</div>
            </AdminLayout>
        );
    }

    const pendingCount = requests.filter(r => !r.isProcessed).length;
    const completedCount = requests.filter(r => r.isProcessed).length;

    const filteredRequests = requests.filter(req => {
        if (filter === 'pending') return !req.isProcessed;
        if (filter === 'completed') return req.isProcessed;
        return true;
    });

    return (
        <AdminLayout>
            <div className="mb-8">
                <h1 className="text-4xl font-serif font-bold text-primary">Közérdekű Adatigénylések</h1>
                <p className="text-gray-400 mt-1">A lakosság által online benyújtott hivatalos adatmegismerési kérelmek kezelése.</p>
            </div>

            <div className="flex flex-wrap gap-2 mb-8 border-b border-gray-100 pb-6">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filter === 'all' ? 'bg-primary text-white shadow-md' : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-300'}`}
                >
                    Összes kérelem ({requests.length})
                </button>
                <button
                    onClick={() => setFilter('pending')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filter === 'pending' ? 'bg-amber-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600'}`}
                >
                    <Clock size={14} /> Folyamatban ({pendingCount})
                </button>
                <button
                    onClick={() => setFilter('completed')}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${filter === 'completed' ? 'bg-green-500 text-white shadow-md' : 'bg-white border border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-600'}`}
                >
                    <CheckCircle2 size={14} /> Teljesítve ({completedCount})
                </button>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-accent">
                    <Loader2 className="animate-spin mb-4" size={32} />
                    <span className="font-serif italic">Igénylések betöltése...</span>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredRequests.map((req) => (
                        <div key={req.id} className={`p-8 rounded-[32px] border shadow-sm space-y-4 transition-all duration-300 ${req.isProcessed ? 'bg-green-50/40 border-green-100/50' : 'bg-white border-gray-100'}`}>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-gray-50 pb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        {req.isProcessed ? (
                                            <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-green-600 bg-green-100 px-3 py-1.5 rounded-full"><CheckCircle2 size={14} /> Teljesítve</span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-widest text-amber-600 bg-amber-100 px-3 py-1.5 rounded-full"><Clock size={14} /> Folyamatban</span>
                                        )}
                                        <h3 className="text-xl font-serif font-bold text-primary">{req.applicantName}</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-xs text-gray-400 font-medium">
                                        <span className="flex items-center gap-1.5"><Mail size={14} className="text-gray-300" /> {req.applicantEmail}</span>
                                        {req.applicantPhone && <span className="flex items-center gap-1.5"><Phone size={14} className="text-gray-300" /> {req.applicantPhone}</span>}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <span className="text-xs text-gray-400 flex items-center gap-1.5 font-bold uppercase tracking-wider bg-white border border-gray-100 shadow-sm px-3 py-1.5 rounded-full">
                                        <Calendar size={12} className="text-accent" /> {new Date(req.createdAt).toLocaleDateString('hu-HU')}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block ml-1">Kért adatok köre:</span>
                                <p className={`text-sm leading-relaxed p-5 rounded-2xl whitespace-pre-wrap ${req.isProcessed ? 'bg-white text-gray-500' : 'bg-gray-50/80 text-gray-600 border border-gray-100'}`}>
                                    {req.requestedDataDescription}
                                </p>
                            </div>

                            <div className="flex justify-start items-center pt-4 border-t border-gray-50">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${req.isProcessed ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300 group-hover:border-accent'}`}>
                                        {req.isProcessed && <CheckCircle2 size={16} className="text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={req.isProcessed}
                                        onChange={() => handleToggleStatus(req)}
                                    />
                                    <span className={`text-sm font-bold select-none ${req.isProcessed ? 'text-green-600' : 'text-gray-500 group-hover:text-primary'}`}>
                                        {req.isProcessed ? "Megjelölve teljesítettként (Kattintson a visszavonáshoz)" : "Jelölje meg teljesítettként"}
                                    </span>
                                </label>
                            </div>
                        </div>
                    ))}

                    {filteredRequests.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200 text-gray-400 italic">
                            <Inbox size={48} className="text-gray-200 mb-4" />
                            Nincs a szűrésnek megfelelő adatigénylés.
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
};