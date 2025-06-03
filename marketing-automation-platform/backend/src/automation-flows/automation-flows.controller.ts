import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req,
  ValidationPipe, UsePipes, HttpCode, HttpStatus, ParseUUIDPipe,
} from '@nestjs/common';
import { AutomationFlowsService } from './automation-flows.service';
import { CreateAutomationFlowDto } from './dto/create-automation-flow.dto';
import { UpdateAutomationFlowDto } from './dto/update-automation-flow.dto';
import { CreateAutomationTriggerDto } from './dto/create-automation-trigger.dto';
import { UpdateAutomationTriggerDto } from './dto/update-automation-trigger.dto';
import { CreateAutomationActionDto } from './dto/create-automation-action.dto';
import { UpdateAutomationActionDto } from './dto/update-automation-action.dto';
import { AuthGuard } from '@nestjs/passport';
import { User as UserModel } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user: Omit<UserModel, 'password'>;
}

@UseGuards(AuthGuard('jwt'))
@Controller('automation-flows')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class AutomationFlowsController {
  constructor(private readonly automationFlowsService: AutomationFlowsService) {}

  // AutomationFlow CRUD
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createFlow(@Body() dto: CreateAutomationFlowDto, @Req() req: AuthenticatedRequest) {
    return this.automationFlowsService.createFlow(dto, req.user.id);
  }

  @Get()
  findAllFlows(@Req() req: AuthenticatedRequest) {
    return this.automationFlowsService.findAllFlows(req.user.id);
  }

  @Get(':flowId')
  findOneFlow(@Param('flowId', ParseUUIDPipe) flowId: string, @Req() req: AuthenticatedRequest) {
    return this.automationFlowsService.findOneFlow(flowId, req.user.id);
  }

  @Patch(':flowId')
  updateFlow(
    @Param('flowId', ParseUUIDPipe) flowId: string,
    @Body() dto: UpdateAutomationFlowDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.automationFlowsService.updateFlow(flowId, dto, req.user.id);
  }

  @Delete(':flowId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeFlow(@Param('flowId', ParseUUIDPipe) flowId: string, @Req() req: AuthenticatedRequest) {
    return this.automationFlowsService.removeFlow(flowId, req.user.id);
  }

  // AutomationTrigger CRUD (aninhado)
  @Post(':flowId/triggers')
  @HttpCode(HttpStatus.CREATED)
  addTrigger(
    @Param('flowId', ParseUUIDPipe) flowId: string,
    @Body() dto: CreateAutomationTriggerDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.automationFlowsService.addTriggerToFlow(flowId, dto, req.user.id);
  }

  @Get(':flowId/triggers/:triggerId') // Ou /triggers/:triggerId e validar flowId internamente
  findTrigger(
    @Param('flowId', ParseUUIDPipe) flowId: string, // flowId aqui é para consistência da rota, mas não estritamente usado se triggerId é globalmente único e a validação de ownership é feita corretamente.
    @Param('triggerId', ParseUUIDPipe) triggerId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    // O service findTriggerById já valida o ownership do flow pai.
    return this.automationFlowsService.findTriggerById(triggerId, req.user.id);
  }
  
  @Patch(':flowId/triggers/:triggerId')
  updateTrigger(
    @Param('flowId', ParseUUIDPipe) flowId: string, // Similar ao GET, para consistência.
    @Param('triggerId', ParseUUIDPipe) triggerId: string,
    @Body() dto: UpdateAutomationTriggerDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.automationFlowsService.updateTrigger(triggerId, dto, req.user.id);
  }

  @Delete(':flowId/triggers/:triggerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeTrigger(
    @Param('flowId', ParseUUIDPipe) flowId: string, // Similar ao GET.
    @Param('triggerId', ParseUUIDPipe) triggerId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.automationFlowsService.removeTrigger(triggerId, req.user.id);
  }

  // AutomationAction CRUD (aninhado)
  @Post(':flowId/actions')
  @HttpCode(HttpStatus.CREATED)
  addAction(
    @Param('flowId', ParseUUIDPipe) flowId: string,
    @Body() dto: CreateAutomationActionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.automationFlowsService.addActionToFlow(flowId, dto, req.user.id);
  }

  @Get(':flowId/actions/:actionId')
  findAction(
    @Param('flowId', ParseUUIDPipe) flowId: string,
    @Param('actionId', ParseUUIDPipe) actionId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.automationFlowsService.findActionById(actionId, req.user.id);
  }

  @Patch(':flowId/actions/:actionId')
  updateAction(
    @Param('flowId', ParseUUIDPipe) flowId: string,
    @Param('actionId', ParseUUIDPipe) actionId: string,
    @Body() dto: UpdateAutomationActionDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.automationFlowsService.updateAction(actionId, dto, req.user.id);
  }

  @Delete(':flowId/actions/:actionId')
  @HttpCode(HttpStatus.NO_CONTENT)
  removeAction(
    @Param('flowId', ParseUUIDPipe) flowId: string,
    @Param('actionId', ParseUUIDPipe) actionId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.automationFlowsService.removeAction(actionId, req.user.id);
  }
}
