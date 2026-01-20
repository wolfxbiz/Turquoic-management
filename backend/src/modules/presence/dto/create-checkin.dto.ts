import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsEnum, MaxLength, IsUUID } from 'class-validator';

export enum WorkStatus {
    IN_OFFICE = 'in_office',
    REMOTE = 'remote',
    ON_LEAVE = 'on_leave',
}

export class CreateCheckInDto {
    @IsEnum(WorkStatus)
    status: WorkStatus;

    // Nullable if on_leave
    @IsOptional()
    @IsUUID()
    projectId?: string;

    // Nullable if on_leave
    @IsOptional()
    @MaxLength(120)
    intent?: string;

    @IsBoolean()
    isBlocked: boolean;

    @IsOptional()
    @IsString()
    blockReasonCategory?: string;

    @IsOptional()
    @MaxLength(120)
    blockReasonText?: string;

    @IsOptional()
    @IsUUID()
    helperUserId?: string;
}
