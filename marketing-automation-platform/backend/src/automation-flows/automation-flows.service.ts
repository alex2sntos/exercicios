import { Injectable, NotFoundException, ForbiddenException, BadRequestException, InternalServerErrorException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAutomationFlowDto } from './dto/create-automation-flow.dto';
import { UpdateAutomationFlowDto } from './dto/update-automation-flow.dto';
import { CreateAutomationTriggerDto } from './dto/create-automation-trigger.dto';
import { UpdateAutomationTriggerDto } from './dto/update-automation-trigger.dto';
import { CreateAutomationActionDto } from './dto/create-automation-action.dto';
import { UpdateAutomationActionDto } from './dto/update-automation-action.dto';
import { AutomationFlow, AutomationTrigger, AutomationAction, Prisma } from '@prisma/client';

@Injectable()
export class AutomationFlowsService {
  constructor(private readonly prisma: PrismaService) {}

  // Helper to check flow ownership
  private async checkFlowOwnership(flowId: string, userId: string): Promise<AutomationFlow> {
    const flow = await this.prisma.automationFlow.findUnique({ where: { id: flowId } });
    if (!flow) {
      throw new NotFoundException(`Automation flow with ID "${flowId}" not found.`);
    }
    if (flow.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this automation flow.');
    }
    return flow;
  }

  // AutomationFlow CRUD
  async createFlow(dto: CreateAutomationFlowDto, userId: string): Promise<AutomationFlow> {
    if (!userId) throw new BadRequestException('User ID is required.');
    try {
      return this.prisma.automationFlow.create({ data: { ...dto, userId } });
    } catch (error) {
      throw new InternalServerErrorException('Could not create automation flow.');
    }
  }

  async findAllFlows(userId: string): Promise<AutomationFlow[]> {
    return this.prisma.automationFlow.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneFlow(id: string, userId: string): Promise<AutomationFlow | null> {
    const flow = await this.checkFlowOwnership(id, userId);
    return this.prisma.automationFlow.findUnique({
      where: { id },
      include: { triggers: { orderBy: { createdAt: 'asc' } }, actions: { orderBy: { order: 'asc' } } },
    });
  }

  async updateFlow(id: string, dto: UpdateAutomationFlowDto, userId: string): Promise<AutomationFlow> {
    await this.checkFlowOwnership(id, userId);
    try {
      return this.prisma.automationFlow.update({ where: { id }, data: dto });
    } catch (error) {
      throw new InternalServerErrorException('Could not update automation flow.');
    }
  }

  async removeFlow(id: string, userId: string): Promise<AutomationFlow> {
    await this.checkFlowOwnership(id, userId);
    // Cascading delete for triggers and actions should be handled by Prisma schema (onDelete: Cascade)
    // If not, manual deletion would be required here.
    try {
      return this.prisma.automationFlow.delete({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Could not delete automation flow.');
    }
  }

  // AutomationTrigger CRUD
  async addTriggerToFlow(flowId: string, dto: CreateAutomationTriggerDto, userId: string): Promise<AutomationTrigger> {
    await this.checkFlowOwnership(flowId, userId);
    // Potentially check for conflicting triggers (e.g. only one 'client_created' trigger per flow)
    const existingTriggers = await this.prisma.automationTrigger.findMany({ where: { flowId, type: dto.type }});
    if (dto.type === 'client_created' && existingTriggers.length > 0) { // Example of a unique trigger type per flow
        throw new ConflictException(`A trigger of type '${dto.type}' already exists for this flow.`);
    }
    try {
      return this.prisma.automationTrigger.create({ data: { ...dto, flowId } });
    } catch (error) {
      throw new InternalServerErrorException('Could not add trigger to flow.');
    }
  }

  async findTriggerById(triggerId: string, userId: string): Promise<AutomationTrigger> {
    const trigger = await this.prisma.automationTrigger.findUnique({ 
        where: { id: triggerId },
        include: { flow: true } 
    });
    if (!trigger) {
      throw new NotFoundException(`Trigger with ID "${triggerId}" not found.`);
    }
    if (trigger.flow.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this trigger.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { flow, ...result } = trigger; // Exclude the full flow object from the direct response
    return result as AutomationTrigger;
  }

  async updateTrigger(triggerId: string, dto: UpdateAutomationTriggerDto, userId: string): Promise<AutomationTrigger> {
    const trigger = await this.findTriggerById(triggerId, userId); // Validates ownership via flow
     if (!trigger) { // Should be handled by findTriggerById
      throw new NotFoundException(`Trigger with ID "${triggerId}" not found.`);
    }
    try {
      return this.prisma.automationTrigger.update({ where: { id: triggerId }, data: dto });
    } catch (error) {
      throw new InternalServerErrorException('Could not update trigger.');
    }
  }

  async removeTrigger(triggerId: string, userId: string): Promise<AutomationTrigger> {
    const trigger = await this.findTriggerById(triggerId, userId); // Validates ownership
     if (!trigger) {
      throw new NotFoundException(`Trigger with ID "${triggerId}" not found.`);
    }
    try {
      return this.prisma.automationTrigger.delete({ where: { id: triggerId } });
    } catch (error) {
      throw new InternalServerErrorException('Could not delete trigger.');
    }
  }

  // AutomationAction CRUD
  async addActionToFlow(flowId: string, dto: CreateAutomationActionDto, userId: string): Promise<AutomationAction> {
    await this.checkFlowOwnership(flowId, userId);
    // Check for order conflicts if necessary, or let the DB handle it if there's a unique constraint on (flowId, order)
    try {
      return this.prisma.automationAction.create({ data: { ...dto, flowId } });
    } catch (error) {
       if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        // Example: unique constraint on order per flow
        throw new ConflictException(`An action with order ${dto.order} already exists for this flow.`);
      }
      throw new InternalServerErrorException('Could not add action to flow.');
    }
  }

  async findActionById(actionId: string, userId: string): Promise<AutomationAction> {
    const action = await this.prisma.automationAction.findUnique({ 
        where: { id: actionId },
        include: { flow: true }
    });
    if (!action) {
      throw new NotFoundException(`Action with ID "${actionId}" not found.`);
    }
    if (action.flow.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this action.');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { flow, ...result } = action;
    return result as AutomationAction;
  }

  async updateAction(actionId: string, dto: UpdateAutomationActionDto, userId: string): Promise<AutomationAction> {
    const action = await this.findActionById(actionId, userId); // Validates ownership
    if (!action) {
      throw new NotFoundException(`Action with ID "${actionId}" not found.`);
    }
    try {
      return this.prisma.automationAction.update({ where: { id: actionId }, data: dto });
    } catch (error) {
       if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002' && dto.order) {
        throw new ConflictException(`An action with order ${dto.order} already exists for this flow.`);
      }
      throw new InternalServerErrorException('Could not update action.');
    }
  }

  async removeAction(actionId: string, userId: string): Promise<AutomationAction> {
    const action = await this.findActionById(actionId, userId); // Validates ownership
     if (!action) {
      throw new NotFoundException(`Action with ID "${actionId}" not found.`);
    }
    try {
      return this.prisma.automationAction.delete({ where: { id: actionId } });
    } catch (error) {
      throw new InternalServerErrorException('Could not delete action.');
    }
  }
}
