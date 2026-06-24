import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, Lock, Mail, Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleShowPassword = () => setShowPassword(true);
    const handleHidePassword = () => setShowPassword(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login({ email, password });
            navigate('/admin/dashboard');
        } catch (err) {
            setError('Helytelen e-mail cím vagy jelszó!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-primary">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white/10 backdrop-blur-xl p-10 rounded-[40px] border border-white/20 shadow-2xl"
            >
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-12">
                        <Lock className="text-primary" size={32} />
                    </div>
                    <h1 className="text-3xl font-serif font-bold text-white">Adminisztráció</h1>
                    <p className="text-accent/60 text-sm mt-2">Jelentkezzen be a kezelőfelülethez</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                        <input
                            type="email"
                            required
                            placeholder="E-mail cím"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-accent transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />

                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Jelszó"
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white outline-none focus:border-accent transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer select-none"
                            onMouseDown={handleShowPassword}
                            onMouseUp={handleHidePassword}
                            onMouseLeave={handleHidePassword}
                            onTouchStart={handleShowPassword}
                            onTouchEnd={handleHidePassword}
                        >
                            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                    </div>

                    {error && <p className="text-red-400 text-sm text-center font-medium">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-primary font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <><LogIn size={20} /> Bejelentkezés</>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};