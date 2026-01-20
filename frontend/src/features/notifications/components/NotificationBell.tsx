import React, { useState } from 'react';
import { Bell, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

export const NotificationBell: React.FC = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => setIsOpen(!isOpen);

    const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        markAsRead(id);
    };

    return (
        <div className="relative z-50">
            <button
                onClick={handleToggle}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                title="Notifications"
            >
                <Bell className="w-6 h-6 text-gray-600" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 origin-top-right"
                        >
                            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <h3 className="font-semibold text-gray-900">Notifications</h3>
                                {notifications.length > 0 && (
                                    <button
                                        onClick={() => markAllAsRead()}
                                        className="text-xs text-turquoic-600 hover:text-turquoic-700 font-medium hover:underline"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        <Bell className="w-8 h-8 mx-auto mb-3 text-gray-300" />
                                        <p className="text-sm">No notifications yet</p>
                                    </div>
                                ) : (
                                    <ul className="divide-y divide-gray-100">
                                        {notifications.map((notification) => (
                                            <li
                                                key={notification.id}
                                                className={`p-4 hover:bg-gray-50 transition-colors relative group ${!notification.isRead ? 'bg-turquoic-50/30' : ''
                                                    }`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`mt-1 w-2 h-2 rounded-full ${!notification.isRead ? 'bg-turquoic-500' : 'bg-transparent'
                                                        }`} />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900 mb-0.5">
                                                            {notification.title}
                                                        </p>
                                                        <p className="text-sm text-gray-600 leading-relaxed mb-2">
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                        </p>
                                                    </div>
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={(e) => handleMarkAsRead(e, notification.id)}
                                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-turquoic-600 hover:bg-turquoic-50 rounded-lg transition-all"
                                                            title="Mark as read"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
