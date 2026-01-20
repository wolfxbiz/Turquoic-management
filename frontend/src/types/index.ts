export interface User {
    id: string;
    email: string;
    fullName: string;
    isAdmin: boolean;
    tenantId: string;
    team?: {
        id: string;
        name: string;
    };
    jobTitle?: string;
    avatarUrl?: string;
}

export interface Project {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'archived';
    ownerId: string;
    direction?: string;
    progress?: number;
    createdAt: string;
    updatedAt: string;
}

export interface Task {
    id: string;
    projectId: string;
    assigneeId: string;
    assignerId: string;
    title: string;
    description?: string;
    status: 'todo' | 'in-progress' | 'done';
    createdAt: string;
    assignee: User;
    assigner: User;
}

export interface CheckIn {

    id: string;
    userId: string;
    checkInDate: string;
    status: 'completed' | 'blocked';
    blockerDetails?: string;
    createdAt: string;
}
