import React from 'react';
import { Shield, Clock, Users, Target } from 'lucide-react';

export const WhatThisSystemIsNot: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">What This System Is Not</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    A clear policy on how the Project Visibility System operates and its intended purpose.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-red-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                        <Clock className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">NOT a Time Tracker</h3>
                    <p className="text-gray-600 leading-relaxed">
                        We do not track hours, minutes, or duration. Check-ins are about <strong>intent</strong> and <strong>blockers</strong>, not timesheets.
                        Timestamps are hidden from the dashboard to discourage "clock-watching".
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-red-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                        <Target className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">NOT a Productivity Score</h3>
                    <p className="text-gray-600 leading-relaxed">
                        There are no "productivity scores", "activity metrics", or "leaderboards".
                        The goal is to solve problems, not to gamify or rank employee output.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-red-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                        <Users className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">NOT a Tool for Blame</h3>
                    <p className="text-gray-600 leading-relaxed">
                        Blockers are reported to get help, not to assign blame.
                        The system is designed to identify <em>systemic</em> issues, not individual failures.
                        Helper assignments are private to avoid "hero culture" or public pressure.
                    </p>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-turquoic-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                        <Shield className="w-6 h-6 text-turquoic-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">IS a Tool for Support</h3>
                    <p className="text-gray-600 leading-relaxed">
                        The sole purpose is to ensure that when you are blocked, you get help immediately.
                        By making work visible, we reduce the need for status meetings and interruptions.
                    </p>
                </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 text-center">
                <p className="text-gray-500 text-sm">
                    This policy is hard-coded into the system's design. Features like detailed timestamps and duration tracking simply do not exist in the dashboard codebase.
                </p>
            </div>
        </div>
    );
};
