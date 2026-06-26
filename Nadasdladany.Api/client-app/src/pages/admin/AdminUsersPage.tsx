import React, { useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { authService } from '../../api/authService';
import { Trash2, UserPlus, Shield, Key, Loader2, X, Edit2, AlertTriangle } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const AdminUsersPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: users = [], refetch, isLoading } = useQuery({
        queryKey: ['adminUsers'],
        queryFn: () => authService.getAllUsers()
    });

    const openCreateModal = () => {
        setEditingUser(null);
        setEmail('');
        setPassword('');
        setIsModalOpen(true);
    };

    const openEditModal = (user: any) => {
        setEditingUser(user);
        setEmail(user.email);
        setPassword('');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingUser) {
                const payload: any = { email };
                if (password) payload.password = password;
                await authService.updateUser(editingUser.id, payload);
                toast.success("Felhasználó adatai sikeresen frissítve!");
            } else {
                await authService.registerUser({ email, password });
                toast.success("Új adminisztrátor sikeresen hozzáadva!");
            }
            setIsModalOpen(false);
            refetch();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Hiba történt a mentés során.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Biztosan megvonja a hozzáférést ettől a felhasználótól?")) return;
        try {
            await authService.deleteUser(id);
            toast.success("Hozzáférés sikeresen megvonva.");
            refetch();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Nem sikerült törölni a felhasználót.");
        }
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-primary">Felhasználói Hozzáférések</h1>
                    <p className="text-gray-400 mt-1">A nádasdladányi hivatali portál adminisztrátora és tartalomkezelő munkatársai.</p>
                </div>
                <button onClick={openCreateModal} className="flex items-center gap-2 bg-accent text-primary font-bold px-6 py-3.5 rounded-full text-xs uppercase tracking-wider hover:scale-105 transition-all shadow-md cursor-pointer">
                    <UserPlus size={16} /> Új admin felvétele
                </button>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden max-w-5xl">
                {isLoading ? (
                    <div className="text-center py-20 font-serif italic text-accent text-lg animate-pulse">Felhasználói fiókok egyeztetése...</div>
                ) : (
                    <table className="w-full text-left text-sm border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-400 font-bold border-b border-gray-100 text-xs uppercase tracking-widest">
                                <th className="p-5 pl-8">E-mail / Felhasználónév</th>
                                <th className="p-5">Jogosultság</th>
                                <th className="p-5">Státusz</th>
                                <th className="p-5 text-right pr-8">Műveletek</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 text-gray-600 font-medium">
                            {users.map((u: any) => (
                                <tr key={u.id} className="hover:bg-gray-50/40 transition-colors">
                                    <td className="p-5 pl-8 font-bold text-primary">{u.email}</td>
                                    <td className="p-5">
                                        <span className="text-xs bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1"><Shield size={12} /> Administrator</span>
                                    </td>
                                    <td className="p-5">
                                        {u.mustChangePassword ? (
                                            <span className="text-[10px] bg-amber-50 text-amber-600 font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1 uppercase"><AlertTriangle size={12} /> Jelszóváltásra vár</span>
                                        ) : (
                                            <span className="text-[10px] bg-green-50 text-green-600 font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1 uppercase">Aktív</span>
                                        )}
                                    </td>
                                    <td className="p-5 text-right pr-8">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => openEditModal(u)} className="p-2 text-gray-400 hover:text-primary hover:bg-gray-50 rounded-xl transition-all cursor-pointer" title="Szerkesztés">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(u.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all cursor-pointer" title="Fiók törlése">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[150] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[32px] p-8 max-w-md w-full shadow-2xl border border-gray-100 relative animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 text-gray-400 hover:text-primary rounded-full hover:bg-gray-50 transition-colors cursor-pointer"><X size={18} /></button>

                        <h3 className="text-2xl font-serif font-bold text-primary mb-2">
                            {editingUser ? 'Munkatárs fiók szerkesztése' : 'Új munkatárs regisztrációja'}
                        </h3>
                        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
                            {editingUser
                                ? 'Itt módosíthatja a belépési e-mail címet, vagy ideiglenes jelszót állíthat be a kollégának.'
                                : 'A megadott e-mail címmel és jelszóval a kolléga azonnal be tud majd lépni a teljes admin felületre.'}
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[11px] font-bold uppercase text-gray-400 mb-1.5">Hivatali e-mail cím</label>
                                <input type="email" required placeholder="nev@nadasdladany.hu" className="w-full bg-gray-50 border border-gray-200/60 p-3.5 rounded-xl outline-none focus:border-accent text-sm font-medium" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold uppercase text-gray-400 mb-1.5">
                                    {editingUser ? 'Új ideiglenes jelszó (Opcionális)' : 'Kezdeti jelszó *'}
                                </label>
                                <div className="relative">
                                    <Key size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        required={!editingUser}
                                        placeholder="Min. 8 karakter, kis/nagybetű, szám, spec. kar."
                                        className="w-full bg-gray-50 border border-gray-200/60 p-3.5 pl-11 rounded-xl outline-none focus:border-accent text-sm"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                    />
                                </div>
                                {editingUser && <p className="text-[10px] text-amber-600 font-bold mt-1.5">Ha megad új jelszót, a felhasználónak az első belépéskor kötelező lesz megváltoztatnia azt!</p>}
                            </div>
                            <button type="submit" disabled={isSubmitting} className="w-full bg-primary text-white font-bold py-4 rounded-xl text-xs uppercase tracking-wider hover:bg-accent transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-md disabled:opacity-50">
                                {isSubmitting ? <Loader2 className="animate-spin" size={14} /> : null}
                                {isSubmitting ? "Mentés folyamatban..." : (editingUser ? "Adatok mentése" : "Adminisztrátor hozzáadása")}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};