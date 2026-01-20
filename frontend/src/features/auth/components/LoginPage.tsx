import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle, Loader2, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { login, isLoggingIn } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await login({ email, password });
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 relative overflow-hidden font-sans selection:bg-turquoic-500 selection:text-white">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-turquoic-600/20 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-teal-600/20 blur-[120px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md z-10 p-4"
            >
                {/* Logo Area */}
                <div className="flex flex-col items-center mb-10">
                    <img
                        src="/turquoic-logo.png"
                        alt="TURQUOIC"
                        className="w-48 h-auto object-contain drop-shadow-2xl"
                    />
                    <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2">Visibility System</p>
                </div>

                {/* Card */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
                    <div className="p-8 sm:p-10">
                        {/* Header */}
                        <div className="mb-10">
                            <h2 className="text-2xl font-bold text-white tracking-tight">System Authentication</h2>
                            <p className="text-gray-400 mt-2 text-sm font-medium">Access your team dashboard and daily check-ins.</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-8 p-4 bg-red-500/10 border border-red-500/50 rounded-2xl flex items-start gap-3"
                            >
                                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <p className="text-xs text-red-200 font-bold leading-relaxed">{error}</p>
                            </motion.div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Terminal</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-turquoic-500 transition-colors">
                                        <Mail className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-turquoic-500 focus:border-transparent text-white placeholder-gray-500 transition-all outline-none font-medium"
                                        placeholder="admin@company.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Secure Key</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-turquoic-500 transition-colors">
                                        <Lock className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-turquoic-500 focus:border-transparent text-white placeholder-gray-500 transition-all outline-none font-medium"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoggingIn}
                                className="w-full flex items-center justify-between py-4 px-6 bg-turquoic-600 hover:bg-turquoic-500 text-white font-black rounded-2xl shadow-xl shadow-turquoic-600/20 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 transition-all uppercase tracking-widest text-xs group"
                            >
                                {isLoggingIn ? (
                                    <div className="flex items-center gap-3">
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        <span>Authorizing...</span>
                                    </div>
                                ) : (
                                    <>
                                        <span>Initialize Session</span>
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Demo Credentials */}
                        <div className="mt-10 pt-8 border-t border-white/10">
                            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                <h3 className="text-[10px] font-black text-turquoic-400 uppercase tracking-widest mb-3">Testing Protocol Credentials</h3>
                                <div className="space-y-2">
                                    <p className="text-xs text-gray-400 flex justify-between">
                                        <span className="font-bold">Email:</span>
                                        <span className="font-mono text-turquoic-200 bg-turquoic-500/10 px-2 py-0.5 rounded">admin@company.com</span>
                                    </p>
                                    <p className="text-xs text-gray-400 flex justify-between">
                                        <span className="font-bold">Key:</span>
                                        <span className="font-mono text-turquoic-200 bg-turquoic-500/10 px-2 py-0.5 rounded">admin123</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-10 text-center text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">
                    &copy; MMXXVI Visibility System • v1.0.4
                </p>
            </motion.div>
        </div>
    );
};

export default LoginPage;
