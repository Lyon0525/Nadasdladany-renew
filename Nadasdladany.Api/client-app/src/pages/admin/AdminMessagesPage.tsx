import { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { contactService, type ContactMessage } from '../../api/contactService';
import { siteSettingsService } from '../../api/siteSettingsService';
import { Mail, MailOpen, Trash2, MapPin, Phone, Settings, X, Loader2 } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';

const contactSettingsSchema = z.object({
    contactAddress: z.string().min(1, "A cím megadása kötelező!"),
    contactEmail: z.string().email("Érvénytelen e-mail cím!"),
    contactPhone: z.string().min(1, "A telefonszám megadása kötelező!")
});

type ContactSettingsFormData = z.infer<typeof contactSettingsSchema>;

export const AdminMessagesPage = () => {
    const queryClient = useQueryClient();
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: messages = [], refetch: refetchMessages, isLoading: isLoadingMessages } = useQuery({
        queryKey: ['adminMessages'],
        queryFn: () => contactService.getMessages()
    });

    const { data: settings } = useQuery({
        queryKey: ['adminSettings'],
        queryFn: () => siteSettingsService.getSettings()
    });

    const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactSettingsFormData>({
        resolver: zodResolver(contactSettingsSchema)
    });

    const openSettingsModal = () => {
        if (settings) {
            reset({
                contactAddress: settings.contactAddress || '',
                contactEmail: settings.contactEmail || '',
                contactPhone: settings.contactPhone || ''
            });
        }
        setIsSettingsModalOpen(true);
    };

    const openMessage = async (msg: ContactMessage) => {
        setSelectedMessage(msg);
        if (!msg.isRead) {
            await contactService.markAsRead(msg.id);
            refetchMessages();
        }
    };

    const handleDelete = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!window.confirm('Biztosan törlöd ezt az üzenetet?')) return;
        try {
            await contactService.deleteMessage(id);
            if (selectedMessage?.id === id) setSelectedMessage(null);
            toast.success("Üzenet törölve");
            refetchMessages();
        } catch (err) {
            toast.error("Hiba a törlés során");
        }
    };

    const onValidSubmit = async (data: ContactSettingsFormData) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            if (settings) {
                formData.append('Id', settings.id.toString());
                formData.append('MayorName', settings.mayorName || '');
                formData.append('WelcomeTitle', settings.welcomeTitle || '');
                formData.append('WelcomeText', settings.welcomeText || '');
                formData.append('HistoryText', settings.historyText || '');
                formData.append('CoatOfArmsText', settings.coatOfArmsText || '');
                formData.append('LandmarksText', settings.landmarksText || '');
                formData.append('CommitteeText', settings.committeeText || '');
            } else {
                formData.append('Id', '1');
            }

            formData.append('ContactAddress', data.contactAddress);
            formData.append('ContactEmail', data.contactEmail);
            formData.append('ContactPhone', data.contactPhone);

            await siteSettingsService.updateSettings(formData);
            toast.success("Kapcsolati adatok frissítve!");
            setIsSettingsModalOpen(false);

            queryClient.invalidateQueries({ queryKey: ['adminSettings'] });
        } catch (err) {
            toast.error("Hiba a mentés során.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-primary">Beérkező Üzenetek</h1>
                    <p className="text-gray-400 mt-1">A weboldalról küldött lakossági megkeresések kezelése.</p>
                </div>
                <button onClick={openSettingsModal} className="bg-white border border-gray-200 text-primary font-bold px-6 py-4 rounded-full flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm cursor-pointer">
                    <Settings size={20} className="text-accent" /> Publikus adatok szerkesztése
                </button>
            </div>

            <div className="flex gap-8 h-[600px]">
                <div className="w-1/2 bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-bold text-primary uppercase tracking-widest text-xs">Postaláda</h3>
                        {isLoadingMessages && <Loader2 className="animate-spin text-gray-400" size={16} />}
                    </div>
                    <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
                        {messages.length === 0 && !isLoadingMessages ? (
                            <div className="p-10 text-center text-gray-400 italic">Nincsenek beérkező üzenetek.</div>
                        ) : (
                            messages.map(msg => (
                                <div key={msg.id} onClick={() => openMessage(msg)} className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors flex items-start gap-4 group ${selectedMessage?.id === msg.id ? 'bg-accent/5 border-l-4 border-l-accent' : 'border-l-4 border-l-transparent'}`}>
                                    <div className="mt-1">
                                        {msg.isRead ? <MailOpen size={20} className="text-gray-300" /> : <Mail size={20} className="text-accent" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className={`truncate text-sm ${msg.isRead ? 'text-gray-600 font-medium' : 'text-primary font-bold'}`}>{msg.name}</span>
                                            <span className="text-[10px] text-gray-400 font-bold ml-2 shrink-0">{new Date(msg.createdAt).toLocaleDateString('hu-HU')}</span>
                                        </div>
                                        <h4 className={`text-sm truncate mb-1 ${msg.isRead ? 'text-gray-500' : 'text-primary font-bold'}`}>{msg.subject}</h4>
                                        <p className="text-xs text-gray-400 truncate">{msg.message}</p>
                                    </div>
                                    <button onClick={(e) => handleDelete(msg.id, e)} className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity rounded-full hover:bg-white cursor-pointer">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="w-1/2 bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden flex flex-col p-10">
                    {selectedMessage ? (
                        <div className="animate-in fade-in h-full flex flex-col">
                            <div className="border-b border-gray-100 pb-6 mb-6">
                                <h2 className="text-2xl font-serif font-bold text-primary mb-4">{selectedMessage.subject}</h2>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center text-accent font-bold">
                                        {selectedMessage.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-primary text-sm">{selectedMessage.name}</p>
                                        <a href={`mailto:${selectedMessage.email}`} className="text-xs text-gray-500 hover:text-accent transition-colors">{selectedMessage.email}</a>
                                    </div>
                                    <span className="ml-auto text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                                        {new Date(selectedMessage.createdAt).toLocaleString('hu-HU')}
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto">
                                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm">{selectedMessage.message}</p>
                            </div>
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <a href={`mailto:${selectedMessage.email}?subject=Válasz: ${selectedMessage.subject}`} className="inline-flex bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-accent transition-colors shadow-md">
                                    Válasz küldése E-mailben
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-4">
                            <Mail size={48} className="opacity-20" />
                            <p className="text-sm font-medium">Válassz ki egy üzenetet az olvasáshoz.</p>
                        </div>
                    )}
                </div>
            </div>

            {isSettingsModalOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-primary/40 backdrop-blur-md">
                    <div className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-serif font-bold text-primary">Kapcsolati Adatok</h2>
                            <button onClick={() => setIsSettingsModalOpen(false)} className="p-2 text-gray-400 hover:text-primary rounded-full transition-colors cursor-pointer"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit(onValidSubmit)} className="space-y-5">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2"><MapPin size={12} /> Hivatal Címe *</label>
                                <input type="text" placeholder="Pl. 8145 Nádasdladány, Fő utca 1." className={`w-full bg-secondary/50 border p-4 rounded-xl outline-none focus:border-accent text-sm font-bold text-primary ${errors.contactAddress ? 'border-red-400' : 'border-gray-100'}`} {...register('contactAddress')} />
                                {errors.contactAddress && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.contactAddress.message}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2"><Mail size={12} /> Hivatalos E-mail cím *</label>
                                <input type="email" placeholder="Pl. hivatal@nadasdladany.hu" className={`w-full bg-secondary/50 border p-4 rounded-xl outline-none focus:border-accent text-sm ${errors.contactEmail ? 'border-red-400' : 'border-gray-100'}`} {...register('contactEmail')} />
                                {errors.contactEmail && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.contactEmail.message}</p>}
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 flex items-center gap-2"><Phone size={12} /> Központi Telefonszám *</label>
                                <input type="text" placeholder="Pl. +36 22 123 456" className={`w-full bg-secondary/50 border p-4 rounded-xl outline-none focus:border-accent text-sm ${errors.contactPhone ? 'border-red-400' : 'border-gray-100'}`} {...register('contactPhone')} />
                                {errors.contactPhone && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.contactPhone.message}</p>}
                            </div>
                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={() => setIsSettingsModalOpen(false)} className="flex-1 py-4 bg-gray-100 text-gray-500 font-bold rounded-xl hover:bg-gray-200 transition-colors cursor-pointer">Mégse</button>
                                <button type="submit" disabled={isSubmitting} className="flex-[2] bg-primary text-white font-bold py-4 rounded-xl hover:bg-accent transition-all flex items-center justify-center shadow-md cursor-pointer disabled:opacity-50">
                                    {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : "Adatok Mentése"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};