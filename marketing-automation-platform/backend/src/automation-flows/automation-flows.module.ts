import { Module } from '@nestjs/common';
import { AutomationFlowsService } from './automation-flows.service';
import { AutomationFlowsController } from './automation-flows.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    PrismaModule, // PrismaService is global
    AuthModule,   // For JWT authentication guard
  ],
  controllers: [AutomationFlowsController],
  providers: [AutomationFlowsService],
})
export class AutomationFlowsModule {}
