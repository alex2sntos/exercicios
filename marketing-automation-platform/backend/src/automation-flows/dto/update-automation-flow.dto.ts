import { PartialType } from '@nestjs/mapped-types';
import { CreateAutomationFlowDto } from './create-automation-flow.dto';

export class UpdateAutomationFlowDto extends PartialType(CreateAutomationFlowDto) {}
