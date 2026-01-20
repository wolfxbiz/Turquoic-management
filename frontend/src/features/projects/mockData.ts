export interface MockProject {
    id: string;
    name: string;
    description: string;
    owner: string;
    status: 'active' | 'archived';
}

export interface MockUser {
    id: string;
    name: string;
}

export const mockProjects: MockProject[] = [
    { id: '1', name: 'Client Portal Redesign', description: 'Modernizing the client-facing portal with React', owner: 'Alice Johnson', status: 'active' },
    { id: '2', name: 'API Migration', description: 'Moving to microservices architecture', owner: 'Bob Smith', status: 'active' },
    { id: '3', name: 'Internal Tools', description: 'Building employee productivity tools', owner: 'Charlie Davis', status: 'active' },
    { id: '4', name: 'Legacy System Update', description: 'Updating old PHP codebase', owner: 'Diana Prince', status: 'archived' }
];

export const mockUsers: MockUser[] = [
    { id: '1', name: 'Alice Johnson' },
    { id: '2', name: 'Bob Smith' },
    { id: '3', name: 'Charlie Davis' },
    { id: '4', name: 'Diana Prince' }
];
