import { motion, useScroll, useTransform } from 'framer-motion';
import { MainLayout } from '../layouts/MainLayout';
import { CastleParticles } from '../features/castle/components/CastleParticles';
import { Landmark, Sparkles, MapPin, Ticket, Info } from 'lucide-react';
import { OptimizedImage } from '../components/ui/OptimizedImage';

export const CastlePage = () => {
    const { scrollYProgress } = useScroll();
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

    const features = [
        {
            title: "Digitális Történetmesélés",
            desc: "Fedezd fel a kiterjesztett valóság rétegeit táblagépes vezetéssel.",
            icon: <Sparkles className="text-accent" />
        },
        {
            title: "Ébredő Ősök",
            desc: "Légy tanúja, ahogy a Nádasdy család portréi életre kelnek.",
            icon: <Landmark className="text-accent" />
        },
        {
            title: "Történelem a kezedben",
            desc: "Próbálj fel korhű jelmezeket és éld át a múltat.",
            icon: <Ticket className="text-accent" />
        }
    ];

    const galleryImages = [
        { src: "/castle/castle_gallery_1.jpg", alt: "Nádasdy-kastély homlokzat" },
        { src: "/castle/castle_gallery_2.jpg", alt: "Kastélypark és tó" },
        { src: "/castle/castle_gallery_3.jpg", alt: "Kastély belső részlet" },
        { src: "/castle/castle_gallery_4.jpg", alt: "Tudor-stílusú torony" },
    ];

    return (
        <div className="bg-[#080a0f] text-white min-h-screen">
            <MainLayout>
                <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                    <CastleParticles />
                    <motion.div style={{ scale }} className="absolute inset-0 z-0">
                        <OptimizedImage src="/castle/castle_hero_banner.jpg" alt="Nádasdy-kastély" isHero={true} fallbackSrc="/castle/castle_hero_banner.jpg" className="w-full h-full opacity-40" />
                        <div className="absolute inset-0 bg-gradient-to-b from-[#080a0f]/20 via-transparent to-[#080a0f]" />
                    </motion.div>

                    <div className="relative z-10 text-center px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <h1 className="text-6xl md:text-9xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-b from-accent via-white to-accent mb-4">
                                Nádasdy-kastély
                            </h1>
                            <p className="text-accent tracking-[0.4em] uppercase text-sm md:text-lg mb-12">
                                A szerelem és innováció öröksége
                            </p>
                            <a
                                href="https://nadasdladanyikastely.hu/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-12 py-5 bg-accent text-primary font-bold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(197,163,90,0.3)]"
                            >
                                Jegyvásárlás <Ticket size={20} />
                            </a>
                        </motion.div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto py-32 px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl md:text-5xl font-serif text-accent mb-8 leading-tight">
                            Egy Tudor-stílusú csoda <br /> a Dunántúl szívében
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Nádasdy Ferenc gróf és Zichy Ilona grófnő szerelméből született ez a remekmű, amely korának legmodernebb technológiáját ötvözte a romantikus építészettel. Az 1876-ban befejezett épület futurisztikus megoldásaival (gázvilágítás, csőposta) ma is ámulatba ejti a látogatókat.
                        </p>
                        <div className="flex items-center gap-4 text-accent font-bold">
                            <MapPin size={24} /> 8145 Nádasdladány, Kastélypark
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 border border-accent/20 rounded-[40px] rotate-3" />
                        <OptimizedImage src="/castle/castle_inside.jpeg" alt="Kastély belső" fallbackSrc="/castle/castle_inside.jpeg" className="relative rounded-[40px] shadow-2xl z-10" />
                    </motion.div>
                </section>

                <section className="bg-white/5 py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-5xl font-serif mb-4">Az Élmény</h2>
                            <div className="w-20 h-1 bg-accent mx-auto" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {features.map((f, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.2 }}
                                    className="p-10 rounded-[32px] bg-white/5 border border-white/10 hover:border-accent/50 transition-colors group"
                                >
                                    <div className="mb-6 p-4 bg-accent/10 rounded-2xl inline-block group-hover:scale-110 transition-transform">
                                        {f.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="max-w-7xl mx-auto py-32 px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-serif mb-4">Pillanatképek a Kastélyból</h2>
                        <div className="w-20 h-1 bg-accent mx-auto mb-4" />
                        <p className="text-gray-400 text-sm max-w-md mx-auto">Villantson bepillantást a Nádasdy-kastély lélegzetelállító külső és belső tereibe.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {galleryImages.map((img, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="relative h-80 rounded-[24px] overflow-hidden group border border-white/10 hover:border-accent/40 transition-colors shadow-lg bg-gray-900"
                            >
                                {/* FIXED: Added the missing closing tag `/>` here */}
                                <OptimizedImage src={img.src} alt={img.alt} fallbackSrc={img.src} className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-110" />

                                <div className="absolute inset-0 bg-[#080a0f]/40 group-hover:bg-transparent transition-colors duration-500" />

                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-[#080a0f] via-[#080a0f]/80 to-transparent translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                    <p className="text-xs font-serif font-bold tracking-wider text-accent uppercase text-center">
                                        {img.alt}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                <section className="max-w-4xl mx-auto py-32 px-6 text-center">
                    <div className="p-12 rounded-[40px] bg-gradient-to-br from-accent/20 to-transparent border border-accent/30">
                        <Info className="mx-auto text-accent mb-6" size={48} />
                        <h2 className="text-3xl font-serif mb-6">Tervezd meg a látogatást</h2>
                        <p className="text-gray-300 mb-8">
                            A kastély minden nap várja a látogatókat. Érdemes előre jegyet foglalni a vezetett túrákra, ahol szakértőink kalauzolnak el a Nádasdyak titokzatos világába.
                        </p>
                        <a
                            href="https://nadasdladanyikastely.hu/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center px-12 py-5 bg-accent text-primary font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(197,163,90,0.3)] cursor-pointer"
                        >
                            Nyitvatartás és árak
                        </a>
                    </div>
                </section>
            </MainLayout>
        </div>
    );
};