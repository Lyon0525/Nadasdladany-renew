import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronRight, Search } from 'lucide-react';
import { SpotlightSearch } from './SpotlightSearch';
import { cn } from '../../lib/utils';

export const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => setMobileMenuOpen(false), [location]);

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setIsSearchOpen((open) => !open);
            }
        };
        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const navLinks = [
        { name: 'Főoldal', path: '/' },
        { name: 'Hírek', path: '/hirek' },
        { name: 'Események', path: '/esemenyek' },
        { name: 'Nádasdy-kastély', path: '/kastely' },
        { name: 'Önkormányzat', path: '/onkormanyzat' },
        { name: 'Intézmények', path: '/intezmenyek' },
        { name: 'Kapcsolat', path: '/kapcsolat' },
    ];

    return (
        <>
            <nav className={cn(
                "fixed top-0 w-full z-[100] transition-all duration-500 px-6",
                isScrolled ? "py-3 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm" : "py-6 bg-transparent"
            )}>
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    {/* Logo + Címer */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src="/nadasdladany-cimer.png"
                            alt="Címer"
                            className="w-10 h-10 md:w-12 md:h-12 object-contain group-hover:rotate-12 transition-transform duration-300"
                        />
                        <span className={cn(
                            "font-serif font-bold text-xl md:text-2xl tracking-tight transition-colors duration-300",
                            isScrolled ? "text-primary" : "text-white"
                        )}>Nádasdladány</span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden lg:flex items-center gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={cn(
                                    "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 relative",
                                    location.pathname === link.path
                                        ? "text-accent"
                                        : (isScrolled ? "text-primary/70 hover:text-primary" : "text-white/80 hover:text-white")
                                )}
                            >
                                {link.name}
                                {location.pathname === link.path && (
                                    <motion.div layoutId="nav-underline" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent rounded-full" />
                                )}
                            </Link>
                        ))}

                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={cn(
                                "ml-4 p-2 transition-colors flex items-center gap-2 border rounded-full px-4",
                                isScrolled ? "text-primary/50 border-gray-200 hover:text-accent" : "text-white/50 border-white/20 hover:text-white"
                            )}
                        >
                            <Search size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Keresés</span>
                        </button>
                    </div>

                    {/* Mobile Toggle */}
                    <div className="lg:hidden flex items-center gap-4">
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className={isScrolled ? "text-primary" : "text-white"}
                        >
                            <Search size={24} />
                        </button>
                        <button
                            className={isScrolled ? "text-primary" : "text-white"}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </nav>

            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: '100%' }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: '100%' }}
                        className="fixed inset-0 z-[90] bg-white flex flex-col p-8 pt-32 gap-6 lg:hidden"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className="text-3xl font-serif font-bold text-primary flex justify-between items-center"
                            >
                                {link.name}
                                <ChevronRight className="text-accent" />
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            <SpotlightSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        </>
    );
};