import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    CheckSquare,
    FolderKanban,
    LogOut,
    User as UserIcon,
    Menu,
    X,
    ShieldCheck,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../features/auth/authStore';
import { NotificationBell } from '../features/notifications/components/NotificationBell';

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { user, logout } = useAuthStore();
    const location = useLocation();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    const navItems = [
        {
            label: 'Dashboard',
            path: '/dashboard',
            icon: <LayoutDashboard className="w-5 h-5" />,
            roles: ['user', 'admin']
        },
        {
            label: 'Daily Check-in',
            path: '/check-in',
            icon: <CheckSquare className="w-5 h-5" />,
            roles: ['user', 'admin']
        },
        {
            label: 'Projects',
            path: '/projects',
            icon: <FolderKanban className="w-5 h-5" />,
            roles: ['admin']
        },
        {
            label: 'System Admin',
            path: '/admin',
            icon: <ShieldCheck className="w-5 h-5" />,
            roles: ['admin']
        },
    ];

    const filteredNavItems = navItems.filter(item =>
        item.roles.includes('user') || (item.roles.includes('admin') && user?.isAdmin)
    );

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900 selection:bg-turquoic-100 selection:text-turquoic-700">


            {/* Desktop Sidebar */}

            <aside className="hidden lg:flex w-72 bg-white border-r border-gray-200 flex-col sticky top-0 h-screen shadow-sm z-50">
                {/* Logo */}
                <div className="p-6">
                    <div className="flex items-center gap-3">
                        <img
                            src="/turquoic-logo.png"
                            alt="TURQUOIC"
                            className="w-32 h-auto object-contain"
                        />
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 px-4 space-y-1.5 mt-4">
                    {filteredNavItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center justify-between px-5 py-3 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'bg-turquoic-500 shadow-md shadow-turquoic-100 text-white transform translate-x-1'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 active:scale-95'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                        {item.icon}
                                    </span>
                                    <span className={`text-sm font-semibold uppercase tracking-wide ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                                        {item.label}
                                    </span>
                                </div>
                                {isActive && (
                                    <motion.div layoutId="active" className="w-1.5 h-1.5 bg-white rounded-full" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* User Card */}
                <div className="p-6 mt-auto">
                    <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 shadow-inner">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 border border-gray-200 shadow-sm relative overflow-hidden group">
                                {user?.avatarUrl ? (
                                    <img src={user.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <UserIcon className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                                )}
                                {user?.isAdmin && (
                                    <div className="absolute top-0 right-0 p-1 bg-amber-400 rounded-bl-lg shadow-sm" title="Administrator">
                                        <ShieldCheck className="w-2.5 h-2.5 text-white" />
                                    </div>
                                )}
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold text-gray-900 truncate leading-none mb-1 uppercase tracking-tight">
                                    {user?.fullName || 'Anonymous'}
                                </p>
                                <p className="text-[10px] font-semibold text-gray-400 truncate uppercase tracking-widest">
                                    {user?.jobTitle || (user?.isAdmin ? 'Administrator' : 'Team Member')}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group active:scale-95"
                        >
                            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Sign Out</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Header & Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Desktop Header */}
                <header className="hidden lg:flex h-16 bg-white border-b border-gray-200 items-center justify-between px-10 sticky top-0 z-40 shadow-sm">
                    <h1 className="text-lg font-bold text-gray-800 uppercase tracking-wide">
                        {
                            navItems.find(item => item.path === location.pathname)?.label || 'Dashboard'
                        }
                    </h1>
                    <NotificationBell />
                </header>

                {/* Mobile Header */}
                <header className="lg:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-[60] shadow-sm">
                    <div className="flex items-center gap-3">
                        <img
                            src="/turquoic-logo.png"
                            alt="TURQUOIC"
                            className="h-8 w-auto object-contain"
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <NotificationBell />
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2.5 bg-gray-50 rounded-xl text-gray-600 active:scale-90 transition-all border border-gray-100"
                        >
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto relative p-6 lg:p-10 max-w-[1400px] mx-auto w-full">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>

            {/* Mobile Navigation Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[70] lg:hidden"
                        />
                        <motion.aside
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed left-0 top-0 bottom-0 w-[85%] max-w-[320px] bg-white z-[80] lg:hidden p-8 flex flex-col shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-12">
                                <img
                                    src="/turquoic-logo.png"
                                    alt="TURQUOIC"
                                    className="w-32 h-auto object-contain"
                                />
                            </div>

                            <nav className="space-y-3">
                                {filteredNavItems.map((item) => {
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center justify-between px-6 py-4 rounded-xl transition-all ${isActive
                                                ? 'bg-turquoic-500 text-white shadow-lg shadow-turquoic-100'
                                                : 'text-gray-500 hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                {item.icon}
                                                <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                                            </div>
                                            <ChevronRight className={`w-4 h-4 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                                        </Link>
                                    );
                                })}
                            </nav>

                            <div className="mt-auto pt-8 border-t border-gray-100">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                                        <UserIcon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 uppercase tracking-tight leading-none mb-1">{user?.fullName}</p>
                                        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest leading-none">{user?.email}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-red-50 text-red-600 font-bold rounded-xl uppercase tracking-widest text-[10px]"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out System
                                </button>
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Layout;
