import { Module } from '@nestjs/common';
import { IaAssistantService } from './ia-assistant.service';
import { IaAssistantController } from './ia-assistant.controller';
import { AuthModule } from '../auth/auth.module'; // For AuthGuard
import { ConfigModule } from '@nestjs/config'; // For ConfigService to get OPENAI_API_KEY

@Module({
  imports: [
    AuthModule,    // To protect routes
    ConfigModule,  // To access environment variables like OPENAI_API_KEY
  ],
  controllers: [IaAssistantController],
  providers: [IaAssistantService],
})
export class IaAssistantModule {}
