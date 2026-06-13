import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { MainLayout } from '../layouts/MainLayout';
import { contactService } from '../api/contactService';

export const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');
        try {
            await contactService.submitMessage(formData);
            setStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setStatus('error');
        }
    };

    const contactInfo = [
        { icon: <MapPin className="text-accent" />, title: "Címünk", content: "8145 Nádasdladány, Fő utca 1.", link: "https://maps.google.com" },
        { icon: <Phone className="text-accent" />, title: "Telefonszám", content: "+36 (22) 123-456", link: "tel:+3622123456" },
        { icon: <Mail className="text-accent" />, title: "E-mail", content: "info@nadasdladany.hu", link: "mailto:info@nadasdladany.hu" },
    ];

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-20">
                    <h1 className="text-5xl font-serif font-bold text-primary mb-4">Kapcsolat</h1>
                    <p className="text-gray-500 max-w-2xl mx-auto">Kérdése van? Keressen minket bizalommal az alábbi elérhetőségeken, vagy küldjön üzenetet közvetlenül innen.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20">
                    <div className="lg:col-span-1 space-y-6">
                        {contactInfo.map((info, i) => (
                            <motion.a
                                key={i}
                                href={info.link}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="flex items-center gap-6 p-8 bg-white rounded-[32px] border border-gray-100 hover:shadow-xl hover:border-accent/20 transition-all group"
                            >
                                <div className="p-4 bg-secondary rounded-2xl group-hover:bg-accent group-hover:text-white transition-colors">
                                    {info.icon}
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">{info.title}</h4>
                                    <p className="text-primary font-medium">{info.content}</p>
                                </div>
                            </motion.a>
                        ))}
                    </div>

                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white p-10 md:p-12 rounded-[40px] shadow-sm border border-gray-100 relative overflow-hidden"
                        >
                            <AnimatePresence mode="wait">
                                {status === 'success' ? (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle2 size={40} />
                                        </div>
                                        <h2 className="text-3xl font-serif font-bold text-primary mb-4">Köszönjük megkeresését!</h2>
                                        <p className="text-gray-500 mb-8">Üzenetét sikeresen továbbítottuk munkatársainknak. Hamarosan válaszolunk.</p>
                                        <button
                                            onClick={() => setStatus('idle')}
                                            className="px-8 py-3 bg-primary text-white rounded-full font-bold hover:bg-accent transition-colors"
                                        >
                                            Új üzenet küldése
                                        </button>
                                    </motion.div>
                                ) : (
                                    <motion.form key="form" onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Név</label>
                                                <input
                                                    type="text" required placeholder="Az Ön neve"
                                                    className="w-full bg-secondary/50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">E-mail</label>
                                                <input
                                                    type="email" required placeholder="pelda@email.com"
                                                    className="w-full bg-secondary/50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
                                                    value={formData.email}
                                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Tárgy</label>
                                            <input
                                                type="text" required placeholder="Mivel kapcsolatban ír nekünk?"
                                                className="w-full bg-secondary/50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
                                                value={formData.subject}
                                                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">Üzenet</label>
                                            <textarea
                                                required rows={5} placeholder="Írja le kérdését részletesen..."
                                                className="w-full bg-secondary/50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:border-accent transition-all"
                                                value={formData.message}
                                                onChange={e => setFormData({ ...formData, message: e.target.value })}
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="w-full bg-primary text-white font-bold py-5 rounded-2xl hover:bg-accent transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary/10"
                                        >
                                            {status === 'loading' ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Üzenet elküldése</>}
                                        </button>
                                        {status === 'error' && <p className="text-red-500 text-center text-sm font-medium">Hiba történt a küldés során. Kérjük, próbálja meg később!</p>}
                                    </motion.form>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>

                <div className="w-full h-[500px] rounded-[40px] overflow-hidden shadow-sm border border-gray-100">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4613.1938729305475!2d18.241105251684356!3d47.13787963541213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4769f30601e12161%3A0xdbb0ef0f26d26421!2sPolg%C3%A1rmesteri%20Hivatal%20N%C3%A1dasdlad%C3%A1ny!5e1!3m2!1shu!2shu!4v1715110000000!5m2!1shu!2shu"
                        className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                        allowFullScreen={true}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                </div>
            </div>
        </MainLayout>
    );
};