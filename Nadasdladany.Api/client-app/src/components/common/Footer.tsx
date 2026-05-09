import { Link } from 'react-router-dom';
import { Landmark, Mail, Phone, MapPin } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#1a2e1a] text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <Landmark className="w-8 h-8 text-[#c5a35a]" />
              <span className="font-serif font-bold text-2xl tracking-tight">Nádasdladány</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Községünk büszke múltjára és bizakodva építi jövőjét. Fedezze fel látnivalóinkat és eseményeinket!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[#c5a35a] font-bold mb-6 uppercase text-xs tracking-widest">Navigáció</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li><Link to="/hirek" className="hover:text-white transition-colors">Friss híreink</Link></li>
              <li><Link to="/esemenyek" className="hover:text-white transition-colors">Eseménynaptár</Link></li>
              <li><Link to="/kastely" className="hover:text-white transition-colors">Nádasdy-kastély</Link></li>
              <li><Link to="/dokumentumok" className="hover:text-white transition-colors">Dokumentumtár</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#c5a35a] font-bold mb-6 uppercase text-xs tracking-widest">Kapcsolat</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center gap-3"><MapPin size={16} className="text-[#c5a35a]" /> 8145 Nádasdladány, Fő utca 1.</li>
              <li className="flex items-center gap-3"><Phone size={16} className="text-[#c5a35a]" /> +36 (22) 123-456</li>
              <li className="flex items-center gap-3"><Mail size={16} className="text-[#c5a35a]" /> info@nadasdladany.hu</li>
            </ul>
          </div>

          {/* Social - FIX: SVG ikonok a build hibák elkerülésére */}
          <div>
            <h4 className="text-[#c5a35a] font-bold mb-6 uppercase text-xs tracking-widest">Kövess minket</h4>
            <div className="flex gap-4">
              {/* Facebook SVG */}
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#c5a35a] transition-all duration-300 group">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 3.656 10.995 9 11.835v-8.37h-3.047v-3.465h3.047v-2.646c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.465h-2.796v8.37c5.344-.84 9-5.845 9-11.835z"/>
                </svg>
              </a>
              {/* Instagram SVG */}
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#c5a35a] transition-all duration-300">
                <svg className="w-5 h-5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 Nádasdladány Község Önkormányzata. Minden jog fenntartva.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gray-300 transition-colors">Adatvédelem</Link>
            <Link to="/admin/login" className="hover:text-gray-300 transition-colors">Adminisztráció</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};