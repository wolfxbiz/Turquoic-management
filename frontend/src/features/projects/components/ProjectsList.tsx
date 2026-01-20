import React, { useState, useEffect } from 'react';
import {
    Plus,
    Archive,
    Search,
    ShieldAlert,
    ShieldCheck,
    FolderKanban,
    User as UserIcon,
    CheckCircle2,
    Clock,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';
import { CreateProjectModal } from './CreateProjectModal';
import { useAuthStore } from '../../auth';
import { EmptyState } from '../../../components/EmptyState';
import { TableSkeleton } from './TableSkeleton';
import { useProjects } from '../hooks/useProjects';
import { ProjectTasks } from './ProjectTasks';

export const ProjectsList: React.FC = () => {
    const { user } = useAuthStore();
    const { projects, isLoading, archiveProject, createProject, updateProject } = useProjects();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Admin Check
    if (!user?.isAdmin) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center p-4">
                <div className="bg-red-50 p-6 rounded-full mb-6 border-4 border-white shadow-lg shadow-red-100">
                    <ShieldAlert className="w-16 h-16 text-red-500" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Access Denied</h2>
                <p className="text-gray-500 max-w-sm font-medium">
                    This management portal is restricted to system administrators. Please contact support if you believe this is an error.
                </p>
            </div>
        );
    }

    const handleArchive = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to archive "${name}"?`)) {
            try {
                await archiveProject(id);
                toast.success(`Project "${name}" archived`);
            } catch (error) {
                toast.error('Failed to archive project');
            }
        }
    };

    const handleEditClick = (project: any) => {
        setEditingProject(project);
        setIsModalOpen(true);
    };

    const handleCreateClick = () => {
        setEditingProject(null);
        setIsModalOpen(true);
    };

    const handleSaveProject = async (projectData: any) => {
        try {
            if (editingProject) {
                await updateProject({ id: editingProject.id, updates: projectData });
                toast.success('Project updated successfully! ✅');
            } else {
                await createProject(projectData);
                toast.success('Project created successfully! ✅');
            }
            setIsModalOpen(false);
            setEditingProject(null);
        } catch (error: any) {
            console.error('Project creation failed:', error);
            const message = error.response?.data?.message || error.message || 'Failed to create project';
            toast.error(`Error: ${Array.isArray(message) ? message.join(', ') : message}`);
        }

    };

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.owner?.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
            {/* Header */}

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <div className="bg-turquoic-500 p-1.5 rounded-lg">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-[10px] font-black text-turquoic-600 uppercase tracking-[0.3em]">Management</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
                    <p className="text-gray-500 font-medium max-w-lg">
                        Configure company-wide projects and manage team access.
                    </p>
                </div>

                <button
                    onClick={handleCreateClick}
                    className="flex items-center justify-center gap-3 px-8 py-4 bg-turquoic-500 text-white font-black rounded-2xl shadow-xl shadow-turquoic-100 hover:bg-turquoic-600 active:scale-95 transition-all uppercase tracking-widest text-xs"
                >
                    <Plus className="w-5 h-5" />
                    Create New Project
                </button>
            </div>

            {/* Filters & Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-3 h-fit">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-turquoic-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search by name, description or owner..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-4 focus:ring-turquoic-500/10 focus:border-turquoic-500 outline-none transition-all shadow-sm font-medium"
                        />
                    </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-center gap-6">
                    <div className="text-center text-sm font-bold text-gray-400 uppercase tracking-tighter">
                        <div className="text-2xl text-gray-900">{projects.length}</div> Total
                    </div>
                    <div className="w-px h-8 bg-gray-100" />
                    <div className="text-center text-sm font-bold text-gray-400 uppercase tracking-tighter">
                        <div className="text-2xl text-emerald-500">{projects.filter(p => p.status === 'active').length}</div> Active
                    </div>
                </div>
            </div>

            {/* Projects Table */}
            {isLoading ? (
                <TableSkeleton />
            ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        {filteredProjects.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Project Name</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Description</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Owner</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredProjects.map((project) => (
                                        <React.Fragment key={project.id}>
                                            <tr
                                                className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                                                onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                                            >
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-turquoic-50 rounded-2xl flex items-center justify-center text-turquoic-600 transition-transform group-hover:scale-110">
                                                            <FolderKanban className="w-6 h-6" />
                                                        </div>
                                                        <span className="font-black text-gray-900 uppercase tracking-tight">{project.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <p className="text-sm text-gray-500 font-medium line-clamp-1 max-w-xs">
                                                        {project.description}
                                                    </p>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 border-2 border-white shadow-sm">
                                                            <UserIcon className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-sm font-bold text-gray-700">{project.owner?.fullName || 'Unknown'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${project.status === 'active'
                                                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                                                        : 'bg-gray-50 text-gray-500 border-gray-100'
                                                        }`}>
                                                        {project.status === 'active' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                                        {project.status}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right" onClick={(e) => e.stopPropagation()}>
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditClick(project);
                                                            }}
                                                            className="bg-white p-2.5 text-gray-400 hover:text-turquoic-600 hover:bg-turquoic-50 hover:border-turquoic-100 border border-gray-100 rounded-xl transition-all shadow-sm active:scale-90"
                                                            title="Edit Project"
                                                        >
                                                            <FolderKanban className="w-5 h-5" />
                                                        </button>
                                                        {project.status === 'active' && (
                                                            <button
                                                                onClick={() => handleArchive(project.id, project.name)}
                                                                className="bg-white p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 border border-gray-100 rounded-xl transition-all shadow-sm active:scale-90"
                                                                title="Archive Project"
                                                            >
                                                                <Archive className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                        <div className="p-2.5 text-gray-400 hover:text-gray-900 transition-colors">
                                                            {expandedId === project.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>

                                            {expandedId === project.id && (
                                                <tr className="bg-gray-50/30">
                                                    <td colSpan={5} className="px-8 py-0">
                                                        <div className="py-8 px-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
                                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Project Details</h4>
                                                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-w-3xl">
                                                                <p className="text-gray-600 font-medium leading-relaxed">
                                                                    {project.description}
                                                                </p>
                                                            </div>

                                                            <div className="max-w-3xl">
                                                                <ProjectTasks projectId={project.id} />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-12">
                                <EmptyState
                                    title="No projects found"
                                    description={searchQuery ? `No projects matching "${searchQuery}"` : "Start by creating your first company project."}
                                    action={searchQuery ? (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            className="text-turquoic-600 font-black uppercase tracking-widest text-xs"
                                        >
                                            Clear search
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setIsModalOpen(true)}
                                            className="px-6 py-3 bg-turquoic-500 text-white font-black rounded-xl"
                                        >
                                            Create First Project
                                        </button>
                                    )}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modals */}
            {isModalOpen && (
                <CreateProjectModal
                    project={editingProject}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingProject(null);
                    }}
                    onSave={handleSaveProject}
                />
            )}
        </div>
    );
};

export default ProjectsList;
