import { IsString, MaxLength } from 'class-validator';

export class UpdateOutcomeDto {
    @IsString()
    @MaxLength(500)
    outcomeText: string;
}
