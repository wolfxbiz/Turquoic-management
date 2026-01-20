import React from 'react';
import { ProjectWithOwner } from '../types';
import { User } from '../../../types';
import { useQuery } from '@tanstack/react-query';
import { projectsService } from '../api/projectsService';
import { FolderGit2 } from 'lucide-react';

interface Props {
    project: ProjectWithOwner;
    isBlocked?: boolean;
}

export const ProjectVisibilityCard: React.FC<Props> = ({ project, isBlocked }) => {
    const { data: contributors = [] } = useQuery({
        queryKey: ['projects', project.id, 'contributors'],
        queryFn: () => projectsService.getContributors(project.id),
        refetchInterval: 60000,
    });

    return (
        <div className={`bg-white rounded-xl border ${isBlocked ? 'border-red-200 bg-red-50/50' : 'border-gray-100'} p-6 hover:shadow-md transition-shadow`}>
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${isBlocked ? 'bg-red-100' : 'bg-gray-50'}`}>
                    <FolderGit2 className={`w-5 h-5 ${isBlocked ? 'text-red-500' : 'text-gray-400'}`} />
                </div>
                {isBlocked && (
                    <span className="px-2 py-1 bg-red-100 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                        Blocked
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{project.name}</h3>
                {project.owner && (
                    <p className="text-xs text-gray-500">Ow: {project.owner.fullName}</p>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-xs font-medium text-gray-500">Active Today</span>

                <div className="flex -space-x-2">
                    {contributors.length > 0 ? contributors.slice(0, 5).map((u: User) => (
                        <div
                            key={u.id}
                            className="w-7 h-7 rounded-full border border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-600"
                            title={u.fullName}
                        >
                            {u.avatarUrl ? (
                                <img
                                    src={u.avatarUrl}
                                    alt={u.fullName}
                                    className="w-full h-full rounded-full object-cover"
                                />
                            ) : (
                                u.fullName.charAt(0)
                            )}
                        </div>
                    )) : (
                        <span className="text-xs text-gray-400 italic">None</span>
                    )}
                </div>
            </div>
        </div>
    );
};
