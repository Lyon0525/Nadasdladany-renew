import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogIn, Lock, Mail, Loader2, Eye, EyeOff, ShieldAlert, KeyRound } from 'lucide-react';
import { authService } from '../api/authService';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const loginSchema = z.object({
    email: z.string().email("Érvénytelen e-mail cím!"),
    password: z.string().min(1, "A jelszó megadása kötelező!")
});

const changePasswordSchema = z.object({
    newPassword: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/, "A jelszónak tartalmaznia kell minimum 8 karaktert, kis- és nagybetűt, számot és speciális karaktert!"),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "A megadott jelszavak nem egyeznek!",
    path: ["confirmPassword"]
});

type LoginData = z.infer<typeof loginSchema>;
type ChangePasswordData = z.infer<typeof changePasswordSchema>;

export const LoginPage = () => {
    const [step, setStep] = useState<'login' | 'change-password'>('login');
    const [currentPassword, setCurrentPassword] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const loginForm = useForm<LoginData>({ resolver: zodResolver(loginSchema) });
    const changePwdForm = useForm<ChangePasswordData>({ resolver: zodResolver(changePasswordSchema) });

    const handleShowPassword = () => setShowPassword(true);
    const handleHidePassword = () => setShowPassword(false);

    const onLoginSubmit = async (data: LoginData) => {
        setLoading(true);
        setError('');

        try {
            const res = await authService.login({ email: data.email, password: data.password });

            if (res.mustChangePassword) {
                setCurrentPassword(data.password);
                setStep('change-password');
            } else {
                window.location.href = '/admin/dashboard';
            }
        } catch (err) {
            setError('Helytelen e-mail cím vagy jelszó!');
        } finally {
            setLoading(false);
        }
    };

    const onChangePwdSubmit = async (data: ChangePasswordData) => {
        setError('');
        setLoading(true);
        try {
            await authService.changePassword({ currentPassword: currentPassword, newPassword: data.newPassword });
            window.location.href = '/admin/dashboard';
        } catch (err: any) {
            setError(err.response?.data?.message || 'Hiba történt a jelszó módosításakor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-6 bg-primary">
            <AnimatePresence mode="wait">
                {step === 'login' ? (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="w-full max-w-md bg-white/10 backdrop-blur-xl p-10 rounded-[40px] border border-white/20 shadow-2xl"
                    >
                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-4 rotate-12">
                                <Lock className="text-primary" size={32} />
                            </div>
                            <h1 className="text-3xl font-serif font-bold text-white">Adminisztráció</h1>
                            <p className="text-accent/60 text-sm mt-2">Jelentkezzen be a kezelőfelülethez</p>
                        </div>

                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-6">
                            <div>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                                    <input
                                        type="email" placeholder="E-mail cím"
                                        className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:border-accent transition-all ${loginForm.formState.errors.email ? 'border-red-400' : 'border-white/10'}`}
                                        {...loginForm.register('email')}
                                    />
                                </div>
                                {loginForm.formState.errors.email && <p className="text-red-400 text-[10px] font-bold mt-1.5 ml-2">{loginForm.formState.errors.email.message}</p>}
                            </div>

                            <div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"} placeholder="Jelszó"
                                        className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-12 text-white outline-none focus:border-accent transition-all ${loginForm.formState.errors.password ? 'border-red-400' : 'border-white/10'}`}
                                        {...loginForm.register('password')}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer select-none"
                                        onMouseDown={handleShowPassword} onMouseUp={handleHidePassword} onMouseLeave={handleHidePassword} onTouchStart={handleShowPassword} onTouchEnd={handleHidePassword}
                                    >
                                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                                {loginForm.formState.errors.password && <p className="text-red-400 text-[10px] font-bold mt-1.5 ml-2">{loginForm.formState.errors.password.message}</p>}
                            </div>

                            {error && <p className="text-red-400 text-sm text-center font-bold">{error}</p>}

                            <button type="submit" disabled={loading} className="w-full bg-accent text-primary font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md">
                                {loading ? <Loader2 className="animate-spin" /> : <><LogIn size={20} /> Bejelentkezés</>}
                            </button>
                        </form>
                    </motion.div>
                ) : (
                    <motion.div
                        key="change-password"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="w-full max-w-md bg-white/10 backdrop-blur-xl p-10 rounded-[40px] border border-white/20 shadow-2xl"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <ShieldAlert className="text-primary" size={32} />
                            </div>
                            <h1 className="text-2xl font-serif font-bold text-white">Biztonsági Riasztás</h1>
                            <p className="text-amber-400/80 text-sm mt-2 leading-relaxed">Első bejelentkezés vagy adminisztrátori jelszó-visszaállítás történt. A folytatáshoz kérjük, adjon meg egy új, biztonságos jelszót!</p>
                        </div>

                        <form onSubmit={changePwdForm.handleSubmit(onChangePwdSubmit)} className="space-y-6">
                            <div>
                                <div className="relative">
                                    <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"} placeholder="Új jelszó"
                                        className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-12 text-white outline-none focus:border-accent transition-all ${changePwdForm.formState.errors.newPassword ? 'border-red-400' : 'border-white/10'}`}
                                        {...changePwdForm.register('newPassword')}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors cursor-pointer select-none"
                                        onMouseDown={handleShowPassword} onMouseUp={handleHidePassword} onMouseLeave={handleHidePassword} onTouchStart={handleShowPassword} onTouchEnd={handleHidePassword}
                                    >
                                        {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                                    </button>
                                </div>
                                {changePwdForm.formState.errors.newPassword && <p className="text-red-400 text-[10px] font-bold mt-1.5 ml-2 leading-tight">{changePwdForm.formState.errors.newPassword.message}</p>}
                            </div>

                            <div>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-accent" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"} placeholder="Jelszó újra"
                                        className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-12 text-white outline-none focus:border-accent transition-all ${changePwdForm.formState.errors.confirmPassword ? 'border-red-400' : 'border-white/10'}`}
                                        {...changePwdForm.register('confirmPassword')}
                                    />
                                </div>
                                {changePwdForm.formState.errors.confirmPassword && <p className="text-red-400 text-[10px] font-bold mt-1.5 ml-2">{changePwdForm.formState.errors.confirmPassword.message}</p>}
                            </div>

                            {error && <p className="text-red-400 text-sm text-center font-bold">{error}</p>}

                            <button type="submit" disabled={loading} className="w-full bg-amber-500 text-primary font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md">
                                {loading ? <Loader2 className="animate-spin" /> : <><LogIn size={20} /> Mentés és Belépés</>}
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};