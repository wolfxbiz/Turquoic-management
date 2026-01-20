import React from 'react';
import { Users, ChevronDown, Check, FilterX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Team, teamsService } from '../api/teamsService';
import { useQuery } from '@tanstack/react-query';

interface TeamFilterProps {
    selectedTeamId: string | null;
    onSelectTeam: (teamId: string | null) => void;
}

export const TeamFilter: React.FC<TeamFilterProps> = ({ selectedTeamId, onSelectTeam }) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const { data: teams = [] } = useQuery({
        queryKey: ['teams'],
        queryFn: teamsService.getTeams,
    });

    const selectedTeam = teams.find(t => t.id === selectedTeamId);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-turquoic-400 transition-all font-bold text-gray-700 active:scale-95 group"
            >
                <div className="bg-gray-50 p-1.5 rounded-lg group-hover:bg-turquoic-50 transition-colors">
                    <Users className="w-4 h-4 text-gray-500 group-hover:text-turquoic-600" />
                </div>
                <span className="text-sm">
                    {selectedTeam ? selectedTeam.name : 'All Teams'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-2 w-64 bg-white border border-gray-100 shadow-2xl rounded-2xl p-2 z-20 overflow-hidden"
                        >
                            <div className="space-y-1">
                                <button
                                    onClick={() => {
                                        onSelectTeam(null);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${!selectedTeamId ? 'bg-turquoic-50 text-turquoic-700' : 'hover:bg-gray-50 text-gray-600'}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <FilterX className="w-4 h-4" />
                                        <span className="text-sm font-bold">All Teams</span>
                                    </div>
                                    {!selectedTeamId && <Check className="w-4 h-4" />}
                                </button>

                                <div className="h-px bg-gray-50 mx-2 my-1" />

                                {teams.map((team) => (
                                    <button
                                        key={team.id}
                                        onClick={() => {
                                            onSelectTeam(team.id);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-colors ${selectedTeamId === team.id ? 'bg-turquoic-50 text-turquoic-700' : 'hover:bg-gray-50 text-gray-600'}`}
                                    >
                                        <span className="text-sm font-bold">{team.name}</span>
                                        {selectedTeamId === team.id && <Check className="w-4 h-4" />}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};
