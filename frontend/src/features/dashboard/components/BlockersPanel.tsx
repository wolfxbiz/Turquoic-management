import React from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { CheckIn } from '../types';

interface BlockersPanelProps {
    blockers: CheckIn[];
}

export const BlockersPanel: React.FC<BlockersPanelProps> = ({ blockers }) => {
    return (
        <section className="bg-white rounded-2xl shadow-sm border-2 border-red-100 overflow-hidden transition-all duration-300 hover:shadow-md">
            <div className="bg-gradient-to-r from-red-50 to-white px-6 py-5 border-b border-red-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                        <ShieldAlert className="w-5 h-5 text-red-600" />
                    </div>
                    <h2 className="text-xl font-black text-red-700 tracking-tight flex items-center gap-2">
                        Active Blockers
                    </h2>
                </div>
                <span className="bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg shadow-red-200">
                    {blockers.length} {blockers.length === 1 ? 'Person' : 'People'} Stuck
                </span>
            </div>
            <div className="p-6">
                {blockers.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {blockers.map((blocker) => (
                            <div
                                key={blocker.id}
                                className="group bg-orange-50 border border-orange-200 rounded-xl p-5 flex gap-5 hover:bg-orange-100 transition-all duration-300"
                            >
                                <div className="bg-orange-200 p-2.5 rounded-xl h-fit shadow-inner group-hover:scale-110 transition-transform">
                                    <AlertCircle className="w-6 h-6 text-orange-700" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-gray-900 group-hover:text-orange-800 transition-colors uppercase tracking-tight">
                                            {blocker.userName}
                                        </h3>
                                    </div>
                                    <p className="text-[10px] font-black text-orange-600 uppercase tracking-[0.15em] mb-3">
                                        Project: {blocker.projectName}
                                    </p>
                                    <p className="text-sm text-gray-700 leading-relaxed font-medium bg-white/50 p-3 rounded-lg border border-orange-200 group-hover:bg-white transition-colors">
                                        {blocker.blockReason}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-green-50/50 rounded-2xl border border-dashed border-green-200">
                        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-lg shadow-green-100">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <p className="text-xl font-black text-gray-900">No blockers today! 🎉</p>
                        <p className="text-gray-500 mt-2 font-medium">Everyone is moving full steam ahead.</p>
                    </div>
                )}
            </div>
        </section>
    );
};
