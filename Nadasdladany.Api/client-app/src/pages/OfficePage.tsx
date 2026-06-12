import { useEffect, useState } from 'react';
import { MainLayout } from '../layouts/MainLayout';
import apiClient from '../api/apiClient';
import { Building2, Clock, Phone, Mail, MapPin, UserCheck } from 'lucide-react';

export interface StaffMember {
    name: string;
    position: string;
    email?: string;
    phone?: string;
}

export interface OfficeDetails {
    officialName: string;
    address: string;
    phone: string;
    email: string;
    openingHoursJson: string;
    staff: StaffMember[];
}

export const OfficePage = () => {
    // JAVÍTÁS: any helyért megkapja a pontos OfficeDetails típust
    const [data, setData] = useState<OfficeDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiClient.get<OfficeDetails>('/office/details')
            .then(res => setData(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <MainLayout>
                <div className="text-center py-32 font-serif italic text-accent text-xl animate-pulse">Hivatali struktúra betöltése...</div>
            </MainLayout>
        );
    }

    // Ügyfélfogadási idő feldolgozása a JSON-ból
    const openingHours = data?.openingHoursJson ? JSON.parse(data.openingHoursJson) : {};

    return (
        <MainLayout>
            <div className="max-w-6xl mx-auto px-6 py-16">
                {/* Címsor */}
                <div className="text-center mb-16">
                    <Building2 size={48} className="mx-auto text-accent mb-6" />
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">Közös Önkormányzati Hivatal</h1>
                    <p className="text-accent font-medium uppercase tracking-widest text-xs">{data?.officialName}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20 items-start">
                    {/* Elérhetőségek kártya */}
                    <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
                        <h3 className="font-serif font-bold text-xl text-primary border-b border-gray-50 pb-3">Kapcsolat</h3>
                        <div className="space-y-4 text-sm text-gray-600">
                            <div className="flex items-start gap-3">
                                <MapPin className="text-accent flex-shrink-0 mt-0.5" size={18} />
                                <div>
                                    <span className="font-bold block text-primary">Cím:</span>
                                    <span>{data?.address}</span>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone className="text-accent flex-shrink-0 mt-0.5" size={18} />
                                <div>
                                    <span className="font-bold block text-primary">Telefon:</span>
                                    <a href={`tel:${data?.phone}`} className="hover:underline">{data?.phone}</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail className="text-accent flex-shrink-0 mt-0.5" size={18} />
                                <div>
                                    <span className="font-bold block text-primary">E-mail:</span>
                                    <a href={`mailto:${data?.email}`} className="hover:underline">{data?.email}</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ügyfélfogadási rend kártya */}
                    <div className="lg:col-span-2 bg-secondary/40 p-8 md:p-10 rounded-[40px] border border-gray-100">
                        <h3 className="font-serif font-bold text-2xl text-primary mb-6 flex items-center gap-2">
                            <Clock size={22} className="text-accent" /> Ügyfélfogadási Idő
                        </h3>
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-inner">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead>
                                    <tr className="bg-primary text-white font-bold">
                                        <th className="p-4 w-1/3">Nap</th>
                                        <th className="p-4">Ügyfélfogadás időtartama</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
                                    {Object.entries(openingHours).map(([day, hours]: any) => (
                                        <tr key={day} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 font-bold text-primary">{day}</td>
                                            <td className={`p-4 ${hours.includes("Nincs") ? 'text-gray-400 italic font-normal' : ''}`}>{hours}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Hivatali Apparátus / Munkatársak szekció */}
                <div className="space-y-8">
                    <div className="text-center md:text-left border-b border-gray-100 pb-4 flex items-center gap-3">
                        <UserCheck className="text-accent" size={28} />
                        <h2 className="text-3xl font-serif font-bold text-primary">A Kirendeltség Munkatársai</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {data?.staff.map((member: StaffMember, i: number) => (
                            <div key={i} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:border-accent transition-all flex flex-col justify-between group">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent block mb-1">{member.position}</span>
                                    <h4 className="text-lg font-bold text-primary group-hover:text-accent transition-colors">{member.name}</h4>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 space-y-1.5 text-xs text-gray-500 font-medium">
                                    {member.email && <p className="flex items-center gap-1.5"><Mail size={12} /> {member.email}</p>}
                                    {member.phone && <p className="flex items-center gap-1.5"><Phone size={12} /> {member.phone}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};