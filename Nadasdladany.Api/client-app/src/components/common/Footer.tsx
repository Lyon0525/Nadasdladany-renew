import { Link } from 'react-router-dom';
import { Landmark, Mail, Phone, MapPin, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { siteSettingsService } from '../../api/siteSettingsService';
import { OptimizedImage } from '../ui/OptimizedImage';

export const Footer = () => {
    const { data: settings } = useQuery({
        queryKey: ['publicSiteSettings'],
        queryFn: () => siteSettingsService.getSettings()
    });

    return (
        <div className="w-full flex flex-col mt-auto">
            <div className="bg-white border-y border-gray-100 py-10 relative z-10 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
                <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-6 lg:gap-12">
                    <a href="https://ohp-20.asp.lgov.hu" target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-accent/30 transition-all px-8 py-5 flex items-center justify-center h-[90px] w-full sm:w-auto min-w-[280px] grayscale hover:grayscale-0 rounded-xl group" title="Intézze ügyeit elektronikusan!">
                        <OptimizedImage src="/partners/e-ugyintezes.png" alt="E-ügyintézés" fallbackSrc="/partners/e-ugyintezes.png" className="h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    </a>

                    <a href="https://magyarfaluprogram.hu" target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-accent/30 transition-all px-8 py-5 flex items-center justify-center h-[90px] w-full sm:w-auto min-w-[280px] grayscale hover:grayscale-0 rounded-xl group" title="Magyar Falu Program">
                        <OptimizedImage src="/partners/magyar-falu.png" alt="Magyar Falu Program" fallbackSrc="/partners/magyar-falu.png" className="h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    </a>

                    <a href="https://magyarkozlony.hu" target="_blank" rel="noopener noreferrer" className="bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-accent/30 transition-all px-8 py-5 flex items-center justify-center h-[90px] w-full sm:w-auto min-w-[280px] grayscale hover:grayscale-0 rounded-xl group" title="Magyar Közlöny">
                        <OptimizedImage src="/partners/magyar-kozlony.png" alt="Magyar Közlöny" fallbackSrc="/partners/magyar-kozlony.png" className="h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                    </a>

                    <a
                        href="https://magyarkozlony.hu"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:border-accent/30 transition-all px-8 py-5 flex items-center justify-center h-[90px] w-full sm:w-auto min-w-[280px] grayscale hover:grayscale-0 rounded-xl group"
                        title="Magyar Közlöny"
                    >
                        <img
                            src="/partners/magyar-kozlony.png"
                            alt="Magyar Közlöny"
                            loading="lazy"
                            decoding="async"
                            className="h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                    </a>
                </div>
            </div>

            <footer className="bg-primary text-white pt-16 pb-8">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 mb-12">
                        <div className="lg:col-span-1">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-white/5 rounded-xl">
                                    <Landmark className="w-6 h-6 text-accent" />
                                </div>
                                <span className="font-serif font-bold text-2xl tracking-tight">Nádasdladány</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Községünk büszke múltjára és bizakodva építi jövőjét. Fedezze fel látnivalóinkat, és intézze ügyeit kényelmesen!
                            </p>
                            <div className="flex gap-3">
                                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-primary transition-all duration-300 text-gray-300">
                                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 3.656 10.995 9 11.835v-8.37h-3.047v-3.465h3.047v-2.646c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.465h-2.796v8.37c5.344-.84 9-5.845 9-11.835z" />
                                    </svg>
                                </a>
                                <a href="#" className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent hover:text-primary transition-all duration-300 text-gray-300">
                                    <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                                    </svg>
                                </a>
                            </div>
                        </div>

                        <div>
                            <h4 className="font-serif font-bold text-lg mb-6 text-white">Navigáció</h4>
                            <ul className="space-y-3.5 text-sm text-gray-400">
                                {[
                                    { name: 'Friss híreink', path: '/hirek' },
                                    { name: 'Eseménynaptár', path: '/esemenyek' },
                                    { name: 'Nádasdy-kastély', path: '/kastely' },
                                    { name: 'Képgaléria', path: '/galeria' },
                                    { name: 'Önkormányzat', path: '/onkormanyzat' },
                                    { name: 'Hivatali Dokumentumok', path: '/dokumentumok' },
                                ].map((link) => (
                                    <li key={link.path}>
                                        <Link to={link.path} className="flex items-center gap-2 hover:text-accent hover:translate-x-1 transition-all group">
                                            <ChevronRight size={14} className="text-white/20 group-hover:text-accent transition-colors" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-serif font-bold text-lg mb-6 text-white">Ügyintézés</h4>
                            <ul className="space-y-3.5 text-sm text-gray-400">
                                {[
                                    { name: 'Választási információk', path: '/valasztasok' },
                                    { name: 'Álláshirdetések', path: '/allasok' },
                                    { name: 'Közérdekű adatigénylés', path: '/kozerdeku-adatigenyles' },
                                    { name: 'Elektronikus ügyintézés', path: '/ugyintezes' },
                                    { name: 'Jogi Nyilatkozatok', path: '/jogi-nyilatkozatok' },
                                ].map((link) => (
                                    <li key={link.path}>
                                        <Link to={link.path} className="flex items-center gap-2 hover:text-accent hover:translate-x-1 transition-all group">
                                            <ChevronRight size={14} className="text-white/20 group-hover:text-accent transition-colors" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-serif font-bold text-lg mb-6 text-white">Kapcsolat</h4>
                            <ul className="space-y-4 text-sm text-gray-400">
                                <li className="flex items-start gap-3 group">
                                    <MapPin size={18} className="text-accent flex-shrink-0 mt-0.5" />
                                    <span className="group-hover:text-white transition-colors whitespace-pre-line">
                                        {settings?.contactAddress || "8145 Nádasdladány, Fő utca 1."}
                                    </span>
                                </li>
                                <li className="flex items-center gap-3 group">
                                    <Phone size={18} className="text-accent flex-shrink-0" />
                                    <a href={`tel:${settings?.contactPhone || '+3622123456'}`} className="hover:text-white transition-colors">
                                        {settings?.contactPhone || "+36 (22) 123-456"}
                                    </a>
                                </li>
                                <li className="flex items-center gap-3 group">
                                    <Mail size={18} className="text-accent flex-shrink-0" />
                                    <a href={`mailto:${settings?.contactEmail || 'info@nadasdladany.hu'}`} className="hover:text-white transition-colors">
                                        {settings?.contactEmail || "info@nadasdladany.hu"}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
                        <p>© {new Date().getFullYear()} Nádasdladány Község Önkormányzata. Minden jog fenntartva.</p>
                        <div className="flex items-center gap-6">
                            <Link to="/jogi-nyilatkozatok" className="hover:text-gray-300 transition-colors">Impresszum</Link>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <Link to="/jogi-nyilatkozatok" className="hover:text-gray-300 transition-colors">Adatvédelem (GDPR)</Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};