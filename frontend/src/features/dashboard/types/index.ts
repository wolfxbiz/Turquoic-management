export type CheckInStatus = 'in_office' | 'remote' | 'on_leave';

export interface PresenceStats {
    inOffice: number;
    remote: number;
    onLeave: number;
    blocked: number;
}

export interface CheckIn {
    id: string;
    userId?: string;
    userName: string;
    status: CheckInStatus;
    projectName?: string;
    intent?: string;
    isBlocked: boolean;
    blockReason?: string; // Legacy/Compat
    blockReasonText?: string;
    blockReasonCategory?: string;
    helperUserId?: string;
    location?: string;
    user?: { id: string; fullName: string; email: string };
    project?: { id: string; name: string };
}

export interface DashboardData {
    summary: PresenceStats;
    presenceList: CheckIn[];
}


