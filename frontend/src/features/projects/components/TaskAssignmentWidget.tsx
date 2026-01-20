import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { projectsService } from '../../projects/api/projectsService';
import { ListTodo, ArrowRight, UserCheck, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    projectId: string;
}

export const TaskAssignmentWidget: React.FC<Props> = ({ projectId }) => {
    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ['projects', projectId, 'tasks'],
        queryFn: () => projectsService.getTasks(projectId),
        refetchInterval: 30000,
    });

    if (isLoading) {
        return <div className="h-64 bg-gray-50 rounded-[2rem] animate-pulse" />;
    }

    return (
        <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-xl shadow-gray-200/50 space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div className="bg-turquoic-600 p-2.5 rounded-xl shadow-lg shadow-turquoic-200">
                        <ListTodo className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h4 className="text-lg font-black text-gray-900 tracking-tight">Assignment Feed</h4>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Accountability Stream</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{tasks.length} Operations</span>
                </div>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {tasks.length > 0 ? tasks.map((task: any, i: number) => (
                    <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group bg-gray-50/50 hover:bg-white border border-gray-100/50 hover:border-turquoic-100 hover:shadow-lg hover:shadow-turquoic-50/50 rounded-2xl p-5 transition-all duration-300"
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md ${task.status === 'done' ? 'bg-emerald-100 text-emerald-700' :
                                    task.status === 'in-progress' ? 'bg-amber-100 text-amber-700' :
                                        'bg-turquoic-100 text-turquoic-700'
                                    }`}>
                                    {task.status}
                                </span>
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <Clock className="w-3 h-3" />
                                    <span className="text-[9px] font-bold uppercase">Live update</span>
                                </div>
                            </div>

                            <h5 className="font-black text-gray-800 tracking-tight text-sm line-clamp-1">{task.title}</h5>

                            <div className="flex items-center justify-between mt-1 pt-4 border-t border-gray-100/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 bg-white rounded-lg border border-gray-200 flex items-center justify-center text-[9px] font-black uppercase overflow-hidden" title={`Assigner: ${task.assigner.fullName}`}>
                                        {task.assigner.fullName.charAt(0)}
                                    </div>
                                    <ArrowRight className="w-3 h-3 text-gray-300" />
                                    <div className="w-7 h-7 bg-gray-900 border border-gray-800 rounded-lg flex items-center justify-center text-[9px] font-black uppercase text-white overflow-hidden shadow-md shadow-gray-200" title={`Assignee: ${task.assignee.fullName}`}>
                                        {task.assignee.fullName.charAt(0)}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <UserCheck className="w-3.5 h-3.5 text-turquoic-500" />
                                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-tight">
                                        {task.assignee.fullName.split(' ')[0]}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                        <div className="bg-white p-3 rounded-full shadow-sm mb-4">
                            <ListTodo className="w-6 h-6 text-gray-300" />
                        </div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">No active assignments</p>
                    </div>
                )}
            </div>
        </div>
    );
};
