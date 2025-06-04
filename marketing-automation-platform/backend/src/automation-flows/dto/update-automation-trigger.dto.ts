import { PartialType } from '@nestjs/mapped-types';
import { CreateAutomationTriggerDto } from './create-automation-trigger.dto';

export class UpdateAutomationTriggerDto extends PartialType(CreateAutomationTriggerDto) {}
