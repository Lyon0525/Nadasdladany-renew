import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Phone, Mail, Clock, Loader2, Landmark } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { MainLayout } from '../layouts/MainLayout';
import { Seo } from '../components/common/Seo';
import { institutionService, type Institution } from '../api/institutionService';

export const InstitutionDetailPage = () => {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();

    const { data: inst, isLoading: loading } = useQuery<Institution | null>({
        queryKey: ['institutionDetail', slug],
        queryFn: () => institutionService.getInstitutionBySlug(slug!),
        enabled: !!slug
    });

    if (loading) return <div className="h-screen flex items-center justify-center font-serif italic text-accent text-2xl gap-3"><Loader2 className="animate-spin" /> Intézmény adatainak betöltése...</div>;
    if (!inst) return <div className="h-screen flex items-center justify-center font-serif text-2xl">Az intézmény nem található.</div>;

    return (
        <MainLayout>
            <Seo title={inst.name} description={inst.description} type="article" />

            <div className="max-w-5xl mx-auto px-6 py-12">
                <button
                    onClick={() => navigate('/intezmenyek')}
                    className="flex items-center gap-2 text-primary/50 hover:text-accent transition-colors mb-12 group uppercase text-xs font-bold tracking-widest cursor-pointer"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Vissza az intézményekhez
                </button>

                <header className="mb-12 text-center md:text-left">
                    <span className="px-4 py-1 bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest rounded-full mb-4 inline-block">
                        Községi Intézmény
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary leading-tight">
                        {inst.name}
                    </h1>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm space-y-6">
                            <h3 className="text-lg font-serif font-bold text-primary border-b border-gray-50 pb-3 flex items-center gap-2">
                                <Landmark size={18} className="text-accent" /> Hivatali adatok
                            </h3>

                            <div className="space-y-4 text-xs font-medium text-gray-500">
                                {inst.leaderName && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 bg-secondary rounded-xl text-accent flex-shrink-0"><User size={14} /></div>
                                        <div>
                                            <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 block">Intézményvezető</span>
                                            <span className="text-primary text-sm font-bold">{inst.leaderName}</span>
                                        </div>
                                    </div>
                                )}

                                {inst.address && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 bg-secondary rounded-xl text-accent flex-shrink-0"><MapPin size={14} /></div>
                                        <div>
                                            <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 block">Cím</span>
                                            <span className="text-primary text-sm">{inst.address}</span>
                                        </div>
                                    </div>
                                )}

                                {inst.phoneNumber && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 bg-secondary rounded-xl text-accent flex-shrink-0"><Phone size={14} /></div>
                                        <div>
                                            <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 block">Telefonszám</span>
                                            <a href={`tel:${inst.phoneNumber}`} className="text-primary text-sm hover:text-accent transition-colors">{inst.phoneNumber}</a>
                                        </div>
                                    </div>
                                )}

                                {inst.email && (
                                    <div className="flex items-start gap-3">
                                        <div className="p-2.5 bg-secondary rounded-xl text-accent flex-shrink-0"><Mail size={14} /></div>
                                        <div>
                                            <span className="text-[9px] uppercase font-bold tracking-wider text-gray-400 block">E-mail cím</span>
                                            <a href={`mailto:${inst.email}`} className="text-primary text-sm hover:text-accent transition-colors block truncate">{inst.email}</a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {inst.openingHours && (
                            <div className="bg-white rounded-[40px] border border-gray-100 p-8 shadow-sm space-y-4">
                                <h3 className="text-lg font-serif font-bold text-primary border-b border-gray-50 pb-3 flex items-center gap-2">
                                    <Clock size={18} className="text-accent" /> Nyitvatartás / Munkarend
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line pl-1">
                                    {inst.openingHours}
                                </p>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-2 bg-white p-8 md:p-12 rounded-[40px] border border-gray-100 shadow-sm">
                        {inst.content ? (
                            <div className="prose prose-slate max-w-none prose-headings:font-serif prose-headings:text-primary prose-p:leading-relaxed">
                                <div dangerouslySetInnerHTML={{ __html: inst.content }} className="content-area" />
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-xl font-serif font-bold text-primary mb-4">Az intézményről</h3>
                                <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                                    {inst.description}
                                </p>
                            </div>
                        )}

                        {inst.websiteUrl && (
                            <div className="mt-12 pt-6 border-t border-gray-100 text-center md:text-left">
                                <a
                                    href={inst.websiteUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center px-8 py-3.5 bg-primary text-white font-bold rounded-2xl hover:bg-accent hover:text-primary transition-all duration-300 text-xs uppercase tracking-wider cursor-pointer shadow-sm"
                                >
                                    Hivatalos weboldal felkeresése
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};