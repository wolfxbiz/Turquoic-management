export type WorkStatus = 'in_office' | 'remote' | 'on_leave';

export interface CheckInFormData {
    status: WorkStatus;
    projectId: string;
    intent: string;
    isBlocked: boolean;
    blockReason?: string;
}

export interface ProjectOption {
    id: string;
    name: string;
}

export interface CheckInResponse {
    id: string;
    status: WorkStatus;
    projectId: string;
    intent: string;
    isBlocked: boolean;
    blockReason?: string;
    checkInDate: string;
    checkedInAt?: string;
    checkedOutAt?: string;
}
