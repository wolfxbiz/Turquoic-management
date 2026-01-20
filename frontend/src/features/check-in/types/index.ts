export type WorkStatus = 'in_office' | 'remote' | 'on_leave';

export interface CheckInFormData {
    status: WorkStatus;
    projectId?: string;
    intent?: string;
    isBlocked: boolean;
    blockReasonCategory?: string;
    blockReasonText?: string;
    helperUserId?: string;
}

export interface ProjectOption {
    id: string;
    name: string;
}

export interface CheckInResponse {
    id: string;
    status: WorkStatus;
    projectId: string | null;
    intent: string | null;
    isBlocked: boolean;
    blockReasonCategory: string | null;
    blockReasonText: string | null;
    helperUserId: string | null;
    checkInDate: string;
    checkedInAt?: string;
    checkedOutAt?: string;
}
