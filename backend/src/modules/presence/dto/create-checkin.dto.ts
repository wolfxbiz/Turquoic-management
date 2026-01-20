import { IsEnum, IsUUID, IsString, MaxLength, IsBoolean, IsOptional } from 'class-validator';

export enum WorkStatus {
    IN_OFFICE = 'in_office',
    REMOTE = 'remote',
    ON_LEAVE = 'on_leave',
}

export class CreateCheckInDto {
    @IsEnum(WorkStatus)
    status: WorkStatus;

    @IsString()
    @IsOptional()
    location?: string;

    @IsUUID()

    @IsOptional()
    projectId?: string;

    @IsString()
    @MaxLength(120)
    intent: string;

    @IsBoolean()
    isBlocked: boolean;

    @IsOptional()
    @IsString()
    blockReason?: string;
}
