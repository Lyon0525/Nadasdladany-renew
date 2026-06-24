import { AdminLayout } from '../../layouts/AdminLayout';
import { dataRequestService } from '../../api/dataRequestService';
import { Mail, Phone, Calendar, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

export const AdminDataRequestsPage = () => {
    const { data: requests = [], isLoading, isError } = useQuery({
        queryKey: ['dataRequests'],
        queryFn: () => dataRequestService.getAllRequests(),
    });

    if (isError) {
        return (
            <AdminLayout>
                <div className="text-red-500 font-bold p-6">Hiba történt az adatigénylések betöltésekor.</div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="mb-12">
                <h1 className="text-4xl font-serif font-bold text-primary">Közérdekű Adatigénylések</h1>
                <p className="text-gray-400 mt-1">A lakosság által online benyújtott hivatalos adatmegismerési kérelmek listája.</p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-accent">
                    <Loader2 className="animate-spin mb-4" size={32} />
                    <span className="font-serif italic">Igénylések betöltése...</span>
                </div>
            ) : (
                <div className="space-y-6">
                    {requests.map((req) => (
                        <div key={req.id} className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 border-b border-gray-50 pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-primary">{req.applicantName}</h3>
                                    <div className="flex flex-wrap gap-4 text-xs text-gray-400 mt-1.5 font-medium">
                                        <span className="flex items-center gap-1"><Mail size={12} /> {req.applicantEmail}</span>
                                        {req.applicantPhone && <span className="flex items-center gap-1"><Phone size={12} /> {req.applicantPhone}</span>}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 flex items-center gap-1.5 font-bold uppercase tracking-wider bg-secondary px-3 py-1.5 rounded-full h-fit">
                                    <Calendar size={12} /> {new Date(req.createdAt).toLocaleDateString('hu-HU')}
                                </span>
                            </div>

                            <div className="space-y-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">Kért adatok köre:</span>
                                <p className="text-gray-600 text-sm leading-relaxed bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 whitespace-pre-wrap">
                                    {req.requestedDataDescription}
                                </p>
                            </div>
                        </div>
                    ))}

                    {requests.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-[32px] border border-dashed border-gray-200 text-gray-400 italic">
                            Nem érkezett még online közérdekű adatigénylés.
                        </div>
                    )}
                </div>
            )}
        </AdminLayout>
    );
};