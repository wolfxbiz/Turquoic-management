import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    Home,
    Palmtree,
    AlertCircle,
    Loader2,
    ChevronRight,
    CheckCircle2,
    LogOut,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useCheckIn } from '../hooks/useCheckIn';

type WorkStatus = 'in_office' | 'remote' | 'on_leave';

export const CheckInForm: React.FC = () => {
    const navigate = useNavigate();
    const { projects, isLoadingProjects, submitCheckIn, isSubmitting, todayCheckIn, isLoadingTodayCheckIn, checkout, isCheckingOut } = useCheckIn();
    const intentRef = useRef<HTMLTextAreaElement>(null);

    // Form State
    const [status, setStatus] = useState<WorkStatus>('remote');
    const [projectId, setProjectId] = useState('');
    const [intent, setIntent] = useState('');
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockReason, setBlockReason] = useState('');

    // UI State
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Auto-focus intent field on mount
    useEffect(() => {
        if (intentRef.current) {
            intentRef.current.focus();
        }
    }, []);

    // Set default project ID when projects load
    useEffect(() => {
        if (projects.length > 0 && !projectId) {
            setProjectId(projects[0].id);
        }
    }, [projects, projectId]);

    // Validation logic
    const errors = {
        intent: intent.trim().length === 0
            ? 'Focus intent is required'
            : intent.trim().length < 10
                ? 'Please provide a bit more detail (min 10 characters)'
                : null,
        projectId: !projectId ? 'Please select a project' : null,
    };

    const isFormValid = !errors.intent && !errors.projectId;

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!isFormValid) {
            setTouched({ intent: true, projectId: true });
            return;
        }

        try {
            await submitCheckIn({
                status,
                projectId,
                intent,
                isBlocked,
                blockReason: isBlocked ? blockReason : undefined,
            });

            toast.success('Check-in submitted successfully! ✅');

            // Navigate after small delay
            setTimeout(() => {
                navigate('/dashboard');
            }, 800);
        } catch (error) {
            toast.error('Failed to submit check-in');
        }
    };


    // Keyboard shortcut: Cmd/Ctrl + Enter
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                if (isFormValid) {
                    handleSubmit();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isFormValid, status, projectId, intent, isBlocked, blockReason]);

    const charCount = intent.length;
    const counterColor = charCount === 120 ? 'text-red-500' : charCount >= 100 ? 'text-orange-500' : 'text-gray-400';

    return (
        <div className="max-w-[600px] mx-auto py-12 px-4">
            {/* Page Header */}
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily Check-in</h1>
                <p className="text-gray-500 font-medium">Let the team know what you're working on today</p>
            </div>

            {/* Already Checked In State */}
            {todayCheckIn && !todayCheckIn.checkedOutAt && (
                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/60 border border-gray-100 space-y-6">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
                            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">You're Checked In!</h2>
                        <p className="text-gray-500">
                            Checked in at{' '}
                            <span className="font-bold text-turquoic-600">
                                {todayCheckIn.checkedInAt
                                    ? new Date(todayCheckIn.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                    : 'N/A'}
                            </span>
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Today's Focus</p>
                        <p className="text-gray-700 font-medium">{todayCheckIn.intent}</p>
                    </div>

                    <button
                        type="button"
                        onClick={async () => {
                            try {
                                await checkout();
                                toast.success('Checked out successfully! 👋');
                                navigate('/dashboard');
                            } catch (error) {
                                toast.error('Failed to check out');
                            }
                        }}
                        disabled={isCheckingOut}
                        className="w-full group flex items-center justify-center gap-3 py-4 bg-orange-500 hover:bg-orange-600 text-white font-black rounded-2xl shadow-xl shadow-orange-200 transition-all active:scale-[0.98] disabled:opacity-40 uppercase tracking-widest text-sm"
                    >
                        {isCheckingOut ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Checking Out...</span>
                            </>
                        ) : (
                            <>
                                <LogOut className="w-5 h-5" />
                                <span>Check Out for Today</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Already Checked Out State */}
            {todayCheckIn && todayCheckIn.checkedOutAt && (
                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/60 border border-gray-100 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                        <Clock className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Day Complete!</h2>
                    <p className="text-gray-500 mb-4">
                        You worked from{' '}
                        <span className="font-bold text-turquoic-600">
                            {new Date(todayCheckIn.checkedInAt!).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {' '}to{' '}
                        <span className="font-bold text-turquoic-600">
                            {new Date(todayCheckIn.checkedOutAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                    >
                        Go to Dashboard
                    </button>
                </div>
            )}

            {/* Form Card - Only show if not checked in */}
            {!todayCheckIn && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/60 border border-gray-100 space-y-8"
                >
                    {/* b) Work Status Selector */}
                    <section className="space-y-4">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                            Where are you working today?
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <StatusCard
                                active={status === 'in_office'}
                                onClick={() => setStatus('in_office')}
                                label="In Office"
                                icon={<Building2 className="w-6 h-6" />}
                            />
                            <StatusCard
                                active={status === 'remote'}
                                onClick={() => setStatus('remote')}
                                label="Remote"
                                icon={<Home className="w-6 h-6" />}
                            />
                            <StatusCard
                                active={status === 'on_leave'}
                                onClick={() => setStatus('on_leave')}
                                label="On Leave"
                                icon={<Palmtree className="w-6 h-6" />}
                            />
                        </div>
                    </section>

                    {/* c) Project Dropdown */}
                    <section className="space-y-3">
                        <label htmlFor="project" className="block text-sm font-bold text-gray-700 ml-1">
                            What project are you working on? <span className="text-red-500">*</span>
                        </label>
                        <div className="relative group">
                            <select
                                id="project"
                                value={projectId}
                                onChange={(e) => setProjectId(e.target.value)}
                                onBlur={() => setTouched({ ...touched, projectId: true })}
                                className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all appearance-none cursor-pointer font-bold text-gray-900 ${touched.projectId && errors.projectId
                                    ? 'border-red-200 bg-red-50'
                                    : 'border-transparent focus:border-turquoic-500 focus:bg-white'
                                    }`}
                            >
                                <option value="" disabled>Select a project...</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-gray-600 transition-colors">
                                <ChevronRight className="w-5 h-5 rotate-90" />
                            </div>
                        </div>
                        {touched.projectId && errors.projectId && (
                            <p className="text-xs font-bold text-red-500 ml-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.projectId}
                            </p>
                        )}
                    </section>

                    {/* d) Intent Textarea */}
                    <section className="space-y-3">
                        <div className="flex justify-between items-end ml-1">
                            <label htmlFor="intent" className="block text-sm font-bold text-gray-700">
                                What's your main focus today? <span className="text-red-500">*</span>
                            </label>
                            <span className={`text-[10px] font-black uppercase tracking-widest tabular-nums ${counterColor}`}>
                                {charCount}/120
                            </span>
                        </div>
                        <textarea
                            id="intent"
                            ref={intentRef}
                            rows={4}
                            maxLength={120}
                            value={intent}
                            onChange={(e) => setIntent(e.target.value)}
                            onBlur={() => setTouched({ ...touched, intent: true })}
                            placeholder="e.g., Finishing the authentication API endpoints and writing tests"
                            className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-2xl outline-none transition-all resize-none font-medium text-gray-900 placeholder-gray-300 ${touched.intent && errors.intent
                                ? 'border-red-200 bg-red-50'
                                : 'border-transparent focus:border-turquoic-500 focus:bg-white'
                                }`}
                        />
                        {touched.intent && errors.intent && (
                            <p className="text-xs font-bold text-red-500 ml-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> {errors.intent}
                            </p>
                        )}
                    </section>

                    {/* e) Blocker Checkbox */}
                    <section className="pt-2">
                        <label className="flex items-center gap-4 cursor-pointer group w-fit">
                            <div className="relative flex items-center">
                                <input
                                    type="checkbox"
                                    checked={isBlocked}
                                    onChange={(e) => setIsBlocked(e.target.checked)}
                                    className="peer h-7 w-7 cursor-pointer appearance-none rounded-xl border-2 border-gray-200 bg-gray-50 checked:bg-orange-500 checked:border-orange-500 transition-all hover:border-orange-300"
                                />
                                <CheckCircle2 className="absolute h-5 w-5 text-white opacity-0 peer-checked:opacity-100 left-1 transition-opacity pointer-events-none" />
                            </div>
                            <span className={`text-sm font-black uppercase tracking-widest transition-colors ${isBlocked ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                🚨 I'm blocked on something
                            </span>
                        </label>

                        {/* f) Block Reason Textarea (conditional) */}
                        <AnimatePresence>
                            {isBlocked && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                    animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
                                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                    className="overflow-hidden"
                                >
                                    <div className="space-y-3">
                                        <label className="block text-[10px] font-black text-orange-600 uppercase tracking-widest ml-1">
                                            What's blocking you? Who can help?
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={blockReason}
                                            onChange={(e) => setBlockReason(e.target.value)}
                                            placeholder="e.g., Waiting for design review from Sarah, need access to staging environment"
                                            className="w-full px-5 py-4 bg-orange-50/50 border-2 border-orange-100 rounded-2xl focus:border-orange-500 focus:bg-white outline-none transition-all resize-none font-medium text-orange-900 placeholder-orange-200"
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>

                    {/* g) Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={!isFormValid || isSubmitting}
                            className="w-full group flex items-center justify-center gap-3 py-4 bg-turquoic-500 hover:bg-turquoic-600 text-white font-black rounded-2xl shadow-xl shadow-turquoic-200 transition-all active:scale-[0.98] disabled:opacity-40 disabled:shadow-none disabled:active:scale-100 uppercase tracking-widest text-sm"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Submitting...</span>
                                </>
                            ) : (
                                <>
                                    <span>Submit Check-in</span>
                                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                        <p className="mt-4 text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                            Shortcut: <kbd className="bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200 text-gray-500">⌘ + Enter</kbd>
                        </p>
                    </div>
                </form>
            )}
        </div>
    );
};

// --- Sub-components ---

const StatusCard: React.FC<{
    active: boolean;
    onClick: () => void;
    label: string;
    icon: React.ReactNode;
}> = ({ active, onClick, label, icon }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex flex-col items-center justify-center p-5 rounded-[2rem] border-2 transition-all duration-300 ${active
            ? 'bg-turquoic-50 border-turquoic-500 text-turquoic-700 shadow-lg shadow-turquoic-100 scale-105 z-10'
            : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200 hover:bg-gray-50'
            }`}
    >
        <div className={`mb-2 transition-transform duration-300 ${active ? 'scale-110' : ''}`}>
            {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
);

export default CheckInForm;
