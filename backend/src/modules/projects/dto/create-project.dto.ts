import { IsString, IsOptional, IsUUID, MinLength } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    @MinLength(3)
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsUUID()
    ownerId: string;

    @IsOptional()
    @IsString()
    direction?: string;

    @IsOptional()
    progress?: number;
}
