import { IsEnum, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { TriggerType } from '../enums/trigger-type.enum';

export class CreateAutomationTriggerDto {
  @IsNotEmpty({ message: 'Trigger type should not be empty' })
  @IsEnum(TriggerType, { message: 'Invalid trigger type selected' })
  type: TriggerType;

  @IsOptional()
  @IsObject({ message: 'Configuration must be an object' })
  // Specific validation for config based on type would be ideal here in a real scenario.
  // For example, if type is CLIENT_BIRTHDAY, config might require a 'daysBefore' number.
  // For now, IsObject allows any JSON structure.
  config?: Record<string, any>; 
}
