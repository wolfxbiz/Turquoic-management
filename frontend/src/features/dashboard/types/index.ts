export type CheckInStatus = 'in_office' | 'remote' | 'on_leave';

export interface PresenceStats {
    inOffice: number;
    remote: number;
    onLeave: number;
    blocked: number;
}

export interface CheckIn {
    id: string;
    userName: string;
    status: CheckInStatus;
    projectName?: string;
    intent: string;
    isBlocked: boolean;
    blockReason?: string; // Legacy/Compat
    blockReasonText?: string;
    blockReasonCategory?: string;
    helperUserId?: string;
}

export interface DashboardData {
    summary: PresenceStats;
    presenceList: CheckIn[];
}


