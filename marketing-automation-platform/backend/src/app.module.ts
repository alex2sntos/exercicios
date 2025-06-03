import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule } from './clients/clients.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { IaAssistantModule } from './ia-assistant/ia-assistant.module';
import { AutomationFlowsModule } from './automation-flows/automation-flows.module';
import { ReportsModule } from './reports/reports.module';
import { IntegrationsModule } from './integrations/integrations.module'; // Added IntegrationsModule import

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ClientsModule,
    CampaignsModule,
    IaAssistantModule,
    AutomationFlowsModule,
    ReportsModule,
    IntegrationsModule, // Imported IntegrationsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
