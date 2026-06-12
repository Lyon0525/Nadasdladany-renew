import { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

export const CookieBanner = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('nadasdladany_cookie_consent');
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('nadasdladany_cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('nadasdladany_cookie_consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md bg-primary text-white p-6 rounded-[32px] shadow-2xl z-[150] border border-white/10 flex flex-col gap-4 animate-in slide-in-from-bottom-10 duration-500">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-white/10 text-accent rounded-2xl flex-shrink-0">
                    <ShieldCheck size={24} />
                </div>
                <div className="space-y-1">
                    <h4 className="font-serif font-bold text-base">Süti (Cookie) Tájékoztatás</h4>
                    <p className="text-gray-300 text-xs leading-relaxed">
                        Honlapunk a felhasználói élmény fokozása, a látogatottság statisztikai mérése és a hivatali funkciók biztonságos működése érdekében sütiket használ.
                    </p>
                </div>
            </div>

            <div className="flex gap-3 text-xs font-bold uppercase tracking-wider pt-2 border-t border-white/5">
                <button
                    onClick={handleDecline}
                    className="flex-1 py-3 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                    Elutasít
                </button>
                <button
                    onClick={handleAccept}
                    className="flex-1 bg-accent text-primary py-3 rounded-full hover:scale-105 transition-all cursor-pointer shadow-md text-center"
                >
                    Elfogadom
                </button>
            </div>
        </div>
    );
};