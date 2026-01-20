import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Info } from 'lucide-react';

interface BlockerHeatmapProps {
    data: { date: string; count: number }[];
}

export const BlockerHeatmap: React.FC<BlockerHeatmapProps> = ({ data }) => {
    // Generate dates for the last 30 days
    const days = useMemo(() => {
        const result = [];
        const today = new Date();
        for (let i = 29; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayData = data.find(d => d.date === dateStr);
            result.push({
                date: dateStr,
                count: dayData ? dayData.count : 0,
                label: date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
            });
        }
        return result;
    }, [data]);

    const getColor = (count: number) => {
        if (count === 0) return 'bg-gray-50 border-gray-100';
        if (count === 1) return 'bg-orange-100 border-orange-200 text-orange-600';
        if (count === 2) return 'bg-orange-300 border-orange-400 text-orange-800';
        if (count >= 3) return 'bg-red-500 border-red-600 text-white';
        return 'bg-gray-50 border-gray-100';
    };

    return (
        <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="bg-orange-50 p-2 rounded-xl">
                        <Flame className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 tracking-tight">Blocker Heatmap</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Last 30 Days Trend</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600 transition-colors cursor-help group relative">
                    <Info className="w-4 h-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">LEGEND</span>

                    {/* Legend Tooltip */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 shadow-xl rounded-xl p-3 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-gray-50 border border-gray-100 rounded" />
                                <span className="text-[10px] font-bold text-gray-500 uppercase">0 Blockers</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-orange-100 border border-orange-200 rounded" />
                                <span className="text-[10px] font-bold text-gray-500 uppercase">1 Blocker</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-orange-300 border border-orange-400 rounded" />
                                <span className="text-[10px] font-bold text-gray-500 uppercase">2 Blockers</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-500 border border-red-600 rounded" />
                                <span className="text-[10px] font-bold text-gray-500 uppercase">3+ Blockers</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-15 gap-2 md:gap-3">
                {days.map((day, idx) => (
                    <motion.div
                        key={day.date}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.01 }}
                        className={`aspect-square rounded-lg md:rounded-xl border-2 flex flex-col items-center justify-center transition-all hover:scale-110 cursor-default relative group/item ${getColor(day.count)}`}
                    >
                        {day.count > 0 && (
                            <span className="text-[10px] md:text-xs font-black">{day.count}</span>
                        )}

                        {/* Day Tooltip */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-[10px] font-bold rounded opacity-0 group-hover/item:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-10">
                            {day.label}: {day.count} blocker{day.count !== 1 ? 's' : ''}
                        </div>
                    </motion.div>
                ))}
            </div>

            <p className="text-[10px] text-gray-400 font-medium italic text-center">
                Visualizing blockers helps identify systemic bottlenecks and team load patterns over time.
            </p>
        </section>
    );
};
