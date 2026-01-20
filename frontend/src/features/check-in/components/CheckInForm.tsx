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
    Clock,
    HelpCircle,
    UserCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useCheckIn } from '../hooks/useCheckIn';

type WorkStatus = 'in_office' | 'remote' | 'on_leave';

// Mock helper users for MVP (replace with real fetch later)
const MOCK_HELPERS = [
    { id: 'u1', name: 'Sarah Engineer' },
    { id: 'u2', name: 'Mike Tech Lead' },
    { id: 'u3', name: 'Jessica Manager' },
];

export const CheckInForm: React.FC = () => {
    const navigate = useNavigate();
    const { projects, isLoadingProjects, submitCheckIn, isSubmitting, todayCheckIn, isLoadingTodayCheckIn, checkout, isCheckingOut } = useCheckIn();
    const intentRef = useRef<HTMLTextAreaElement>(null);
    const topRef = useRef<HTMLDivElement>(null);

    // Form State
    const [status, setStatus] = useState<WorkStatus>('remote');
    const [projectId, setProjectId] = useState('');
    const [intent, setIntent] = useState('');
    const [isBlocked, setIsBlocked] = useState(false);
    const [blockReasonCategory, setBlockReasonCategory] = useState('');
    const [blockReasonText, setBlockReasonText] = useState('');
    const [helperUserId, setHelperUserId] = useState('');

    // UI State
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Scroll to top on mount
    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    // Auto-focus intent field when not on leave
    useEffect(() => {
        if (status !== 'on_leave' && intentRef.current) {
            intentRef.current.focus();
        }
    }, [status]);

    // Set default project ID when projects load
    useEffect(() => {
        if (projects.length > 0 && !projectId) {
            setProjectId(projects[0].id);
        }
    }, [projects, projectId]);

    // Validation logic
    const errors = {
        intent: status !== 'on_leave' && intent.trim().length === 0
            ? 'Focus intent is required'
            : status !== 'on_leave' && intent.trim().length < 10
                ? 'Please provide a bit more detail (min 10 characters)'
                : null,
        projectId: status !== 'on_leave' && !projectId ? 'Please select a project' : null,
        blockReasonCategory: isBlocked && !blockReasonCategory ? 'Please select a category' : null,
    };

    const isFormValid = !errors.intent && !errors.projectId && !errors.blockReasonCategory;

    const handleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!isFormValid) {
            setTouched({ intent: true, projectId: true, blockReasonCategory: true });
            toast.error('Please fix the errors before submitting');
            return;
        }

        try {
            await submitCheckIn({
                status,
                projectId: status === 'on_leave' ? undefined : projectId,
                intent: status === 'on_leave' ? undefined : intent,
                isBlocked: status === 'on_leave' ? false : isBlocked,
                blockReasonCategory: (isBlocked && status !== 'on_leave') ? blockReasonCategory : undefined,
                blockReasonText: (isBlocked && status !== 'on_leave') ? blockReasonText : undefined,
                helperUserId: (isBlocked && status !== 'on_leave') ? helperUserId : undefined,
            });

            toast.success('Check-in submitted successfully! ✅');

            setTimeout(() => {
                navigate('/dashboard');
            }, 800);
        } catch (error: any) {
            console.error('Check-in failed:', error);
            const message = error.response?.data?.message || 'Failed to submit check-in';
            toast.error(message);
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
    }, [isFormValid, status, projectId, intent, isBlocked, blockReasonCategory, blockReasonText, helperUserId]);

    const charCount = intent.length;
    const counterColor = charCount === 120 ? 'text-red-500' : charCount >= 100 ? 'text-orange-500' : 'text-gray-400';

    return (
        <div ref={topRef} className="max-w-[600px] mx-auto py-12 px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Page Header */}
            <div className="mb-10 text-center md:text-left">
                <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Daily Check-in</h1>
                <p className="text-gray-500 font-medium">Coordinate your day with the team.</p>
            </div>

            {/* Already Checked In State */}
            {todayCheckIn && !todayCheckIn.checkedOutAt && (
                <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-100/50 border border-emerald-100 space-y-6 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-50 rounded-full mb-2">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 mb-2">You're Checked In!</h2>
                        <p className="text-gray-500 font-medium">
                            Started at <span className="text-emerald-600 font-bold">{todayCheckIn.checkedInAt ? new Date(todayCheckIn.checkedInAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A'}</span>
                        </p>
                    </div>

                    {todayCheckIn.status === 'on_leave' ? (
                        <div className="bg-amber-50 rounded-2xl p-6 border border-amber-100">
                            <p className="text-amber-800 font-bold">🌴 You are marked as On Leave today.</p>
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-left">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Today's Focus</p>
                            <p className="text-gray-800 font-medium text-lg leading-relaxed">"{todayCheckIn.intent}"</p>
                            {todayCheckIn.isBlocked && (
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <p className="flex items-center gap-2 text-orange-600 font-bold text-sm">
                                        <AlertCircle className="w-4 h-4" /> Blocked: {todayCheckIn.blockReasonCategory}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

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
                        className="w-full group flex items-center justify-center gap-3 py-4 bg-white border-2 border-orange-100 text-orange-600 hover:bg-orange-50 hover:border-orange-200 font-black rounded-2xl transition-all active:scale-[0.98] disabled:opacity-40 uppercase tracking-widest text-sm"
                    >
                        {isCheckingOut ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Checks Out...</span>
                            </>
                        ) : (
                            <>
                                <LogOut className="w-5 h-5" />
                                <span>Check Out</span>
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Check-in Form */}
            {!todayCheckIn && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 space-y-8 relative overflow-hidden"
                >
                    {/* Status Selection */}
                    <section className="space-y-4">
                        <label className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                            Working Status
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            <StatusCard
                                active={status === 'in_office'}
                                onClick={() => setStatus('in_office')}
                                label="Office"
                                icon={<Building2 className="w-5 h-5" />}
                            />
                            <StatusCard
                                active={status === 'remote'}
                                onClick={() => setStatus('remote')}
                                label="Remote"
                                icon={<Home className="w-5 h-5" />}
                            />
                            <StatusCard
                                active={status === 'on_leave'}
                                onClick={() => setStatus('on_leave')}
                                label="Leave"
                                icon={<Palmtree className="w-5 h-5" />}
                            />
                        </div>
                    </section>

                    <AnimatePresence mode="wait">
                        {status === 'on_leave' ? (
                            <motion.div
                                key="leave-message"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-amber-50 p-6 rounded-2xl border border-amber-100 text-center py-12"
                            >
                                <Palmtree className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                                <h3 className="text-lg font-bold text-amber-900 mb-1">Enjoy your time off!</h3>
                                <p className="text-amber-700/80 text-sm">No other updates needed for today.</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="work-form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-8"
                            >
                                {/* Project Selector */}
                                <section className="space-y-3">
                                    <label htmlFor="project" className="block text-sm font-bold text-gray-700 ml-1">
                                        Primary Project <span className="text-red-500">*</span>
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

                                {/* Intent Input */}
                                <section className="space-y-3">
                                    <div className="flex justify-between items-end ml-1">
                                        <label htmlFor="intent" className="block text-sm font-bold text-gray-700">
                                            Main Focus <span className="text-red-500">*</span>
                                        </label>
                                        <span className={`text-[10px] font-black uppercase tracking-widest tabular-nums ${counterColor}`}>
                                            {charCount}/120
                                        </span>
                                    </div>
                                    <textarea
                                        id="intent"
                                        ref={intentRef}
                                        rows={3}
                                        maxLength={120}
                                        value={intent}
                                        onChange={(e) => setIntent(e.target.value)}
                                        onBlur={() => setTouched({ ...touched, intent: true })}
                                        placeholder="e.g. Building the auth API, Reviewing PRs..."
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

                                {/* Blocked Section */}
                                <section className="pt-2">
                                    <label className="flex items-center gap-4 cursor-pointer group w-fit select-none">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={isBlocked}
                                                onChange={(e) => setIsBlocked(e.target.checked)}
                                                className="peer h-6 w-6 cursor-pointer appearance-none rounded-lg border-2 border-gray-200 bg-gray-50 checked:bg-orange-500 checked:border-orange-500 transition-all hover:border-orange-300"
                                            />
                                            <CheckCircle2 className="absolute h-4 w-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                                        </div>
                                        <span className={`text-xs font-black uppercase tracking-widest transition-colors ${isBlocked ? 'text-orange-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                            Need help with something?
                                        </span>
                                    </label>

                                    <AnimatePresence>
                                        {isBlocked && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0, marginTop: 0 }}
                                                animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
                                                exit={{ height: 0, opacity: 0, marginTop: 0 }}
                                                className="overflow-hidden space-y-4"
                                            >
                                                {/* Block Category */}
                                                <div className="bg-orange-50/50 p-4 rounded-2xl border border-orange-100 space-y-4">
                                                    <div>
                                                        <label className="block text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2 ml-1">
                                                            Blocker Type <span className="text-red-500">*</span>
                                                        </label>
                                                        <div className="relative">
                                                            <select
                                                                value={blockReasonCategory}
                                                                onChange={(e) => setBlockReasonCategory(e.target.value)}
                                                                className="w-full px-4 py-3 bg-white border border-orange-200 rounded-xl outline-none text-sm font-bold text-gray-700 focus:border-orange-500 appearance-none cursor-pointer"
                                                            >
                                                                <option value="" disabled>Select category...</option>
                                                                <option value="Technical">Technical Issue</option>
                                                                <option value="Dependency">Waiting on Dependency</option>
                                                                <option value="Resource">Missing Resource/Access</option>
                                                                <option value="Unclear">Requirements Unclear</option>
                                                                <option value="Other">Other</option>
                                                            </select>
                                                            <HelpCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-300 pointer-events-none" />
                                                        </div>
                                                        {touched.blockReasonCategory && errors.blockReasonCategory && (
                                                            <p className="text-[10px] font-bold text-red-500 ml-1 mt-1">
                                                                {errors.blockReasonCategory}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Helper Selection */}
                                                    <div>
                                                        <label className="block text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2 ml-1">
                                                            Request Support (Private)
                                                        </label>
                                                        <div className="relative">
                                                            <select
                                                                value={helperUserId}
                                                                onChange={(e) => setHelperUserId(e.target.value)}
                                                                className="w-full px-4 py-3 bg-white border border-orange-200 rounded-xl outline-none text-sm font-bold text-gray-700 focus:border-orange-500 appearance-none cursor-pointer"
                                                            >
                                                                <option value="">No specific helper</option>
                                                                {MOCK_HELPERS.map(h => (
                                                                    <option key={h.id} value={h.id}>{h.name}</option>
                                                                ))}
                                                            </select>
                                                            <UserCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-300 pointer-events-none" />
                                                        </div>
                                                    </div>

                                                    {/* Optional Context */}
                                                    <div>
                                                        <label className="block text-[10px] font-black text-orange-400 uppercase tracking-widest mb-2 ml-1">
                                                            Context (Optional)
                                                        </label>
                                                        <textarea
                                                            rows={2}
                                                            value={blockReasonText}
                                                            onChange={(e) => setBlockReasonText(e.target.value)}
                                                            placeholder="Brief details..."
                                                            className="w-full px-4 py-3 bg-white border border-orange-200 rounded-xl outline-none text-sm font-medium text-gray-700 focus:border-orange-500 resize-none"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </section>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isSubmitting || (status !== 'on_leave' && !isFormValid)}
                            className={`w-full group flex items-center justify-center gap-3 py-4 font-black rounded-2xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:shadow-none uppercase tracking-widest text-sm
                                ${status === 'on_leave'
                                    ? 'bg-amber-400 hover:bg-amber-500 text-white shadow-amber-200'
                                    : 'bg-turquoic-500 hover:bg-turquoic-600 text-white shadow-turquoic-200'
                                }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <>
                                    <span>{status === 'on_leave' ? 'Confirm Leave' : 'Submit Check-in'}</span>
                                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </button>
                        {status !== 'on_leave' && (
                            <p className="mt-4 text-center text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em]">
                                Return by 18:00
                            </p>
                        )}
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
        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${active
            ? 'bg-turquoic-50 border-turquoic-500 text-turquoic-700 shadow-md shadow-turquoic-100 scale-100 ring-1 ring-turquoic-200'
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
