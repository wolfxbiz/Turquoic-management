import { DashboardData } from './types';

export const mockDashboardData: DashboardData = {
    summary: { inOffice: 8, remote: 5, onLeave: 2, blocked: 3 },
    checkIns: [
        {
            id: '1',
            userId: 'u1',
            userName: 'Alice Johnson',
            status: 'remote',
            projectName: 'Client Portal Redesign',
            location: 'remote',
            intent: 'Finishing authentication flow and testing edge cases',
            isBlocked: true,
            blockReason: 'Waiting for design mockups from client team',
            user: { id: 'u1', fullName: 'Alice Johnson', email: 'alice@example.com' },
            project: { id: 'p1', name: 'Client Portal Redesign' }
        },
        {
            id: '2',
            userId: 'u2',
            userName: 'Bob Smith',
            status: 'in_office',
            projectName: 'API Migration',
            location: 'office',
            intent: 'Setting up database migrations for the new schema',
            isBlocked: false,
            user: { id: 'u2', fullName: 'Bob Smith', email: 'bob@example.com' },
            project: { id: 'p2', name: 'API Migration' }
        },
        {
            id: '3',
            userId: 'u3',
            userName: 'Charlie Davis',
            status: 'remote',
            projectName: 'Internal Tools',
            location: 'remote',
            intent: 'Code review and testing the new features',
            isBlocked: true,
            blockReason: 'Need access to production logs for debugging',
            user: { id: 'u3', fullName: 'Charlie Davis', email: 'charlie@example.com' },
            project: { id: 'p3', name: 'Internal Tools' }
        },
        {
            id: '4',
            userId: 'u4',
            userName: 'Diana Prince',
            status: 'in_office',
            projectName: 'Client Portal Redesign',
            location: 'office',
            intent: 'Working on responsive design for mobile',
            isBlocked: false,
            user: { id: 'u4', fullName: 'Diana Prince', email: 'diana@example.com' },
            project: { id: 'p1', name: 'Client Portal Redesign' }
        },
        {
            id: '5',
            userId: 'u5',
            userName: 'Ethan Hunt',
            status: 'on_leave',
            projectName: 'N/A',
            location: 'remote',
            intent: 'Vacation',
            isBlocked: false,
            user: { id: 'u5', fullName: 'Ethan Hunt', email: 'ethan@example.com' }
        }
    ]
};
