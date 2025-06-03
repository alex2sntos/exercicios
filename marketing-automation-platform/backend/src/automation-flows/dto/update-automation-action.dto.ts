import { PartialType } from '@nestjs/mapped-types';
import { CreateAutomationActionDto } from './create-automation-action.dto';

export class UpdateAutomationActionDto extends PartialType(CreateAutomationActionDto) {}
