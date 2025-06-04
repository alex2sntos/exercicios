import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateAutomationFlowDto {
  @IsNotEmpty({ message: 'Flow name should not be empty' })
  @IsString()
  @MinLength(3, { message: 'Flow name must be at least 3 characters long' })
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = false;
}
