import { motion, useScroll, useTransform } from 'framer-motion';
import { MainLayout } from '../layouts/MainLayout';
import { CastleParticles } from '../features/castle/components/CastleParticles';
import { Landmark, Sparkles, MapPin, Ticket, Info } from 'lucide-react';

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

    return (
        <div className="bg-[#080a0f] text-white min-h-screen">
            <MainLayout>
                {/* HERO SECTION */}
                <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
                    <CastleParticles />
                    <motion.div style={{ scale }} className="absolute inset-0 z-0">
                        <img
                            src="https://nadasdladanyikastely.hu/wp-content/uploads/2021/05/kastely-hero.jpg"
                            className="w-full h-full object-cover opacity-40"
                            alt="Nádasdy-kastély"
                        />
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
                                href="https://nadasdladanyikastely.hu/jegyvasarlas/"
                                target="_blank"
                                className="inline-flex items-center gap-3 px-12 py-5 bg-accent text-primary font-bold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(197,163,90,0.3)]"
                            >
                                Jegyvásárlás <Ticket size={20} />
                            </a>
                        </motion.div>
                    </div>
                </section>

                {/* STORY SECTION */}
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
                        <img
                            src="https://nadasdladany.hu/wp-content/uploads/2021/05/kastely-belso.jpg"
                            className="relative rounded-[40px] shadow-2xl z-10"
                            alt="Kastély belső"
                        />
                    </motion.div>
                </section>

                {/* FEATURES GRID */}
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

                {/* INFO SECTION */}
                <section className="max-w-4xl mx-auto py-32 px-6 text-center">
                    <div className="p-12 rounded-[40px] bg-gradient-to-br from-accent/20 to-transparent border border-accent/30">
                        <Info className="mx-auto text-accent mb-6" size={48} />
                        <h2 className="text-3xl font-serif mb-6">Tervezd meg a látogatást</h2>
                        <p className="text-gray-300 mb-8">
                            A kastély minden nap várja a látogatókat. Érdemes előre jegyet foglalni a vezetett túrákra, ahol szakértőink kalauzolnak el a Nádasdyak titokzatos világába.
                        </p>
                        <button className="px-10 py-4 border border-accent text-accent rounded-full hover:bg-accent hover:text-primary transition-all font-bold">
                            Nyitvatartás és árak
                        </button>
                    </div>
                </section>
            </MainLayout>
        </div>
    );
};