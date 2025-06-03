import { IsEnum, IsInt, IsNotEmpty, IsObject, IsOptional, Min } from 'class-validator';
import { ActionType } from '../enums/action-type.enum';

export class CreateAutomationActionDto {
  @IsNotEmpty({ message: 'Action type should not be empty' })
  @IsEnum(ActionType, { message: 'Invalid action type selected' })
  type: ActionType;

  @IsNotEmpty({ message: 'Configuration should not be empty if action type requires it.' })
  @IsObject({ message: 'Configuration must be an object' })
  // Similar to triggers, config validation should ideally be type-specific.
  // e.g., if type is SEND_EMAIL, config might require 'emailTemplateId'.
  config: Record<string, any>;

  @IsNotEmpty({ message: 'Order of execution must be provided' })
  @IsInt({ message: 'Order must be an integer' })
  @Min(1, { message: 'Order must be at least 1' })
  order: number;

  @IsOptional()
  @IsInt({ message: 'Delay must be an integer' })
  @Min(0, { message: 'Delay cannot be negative' })
  delayMinutes?: number = 0;
}
