import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // To access environment variables
import { AuthModule } from '../auth/auth.module'; // For protecting controller routes

import { MetaApiService } from './meta-api.service';
import { GmailApiService } from './gmail-api.service';
import { EmailProvidersService } from './email-providers.service';
import { IntegrationsController } from './integrations.controller';

@Module({
  imports: [
    ConfigModule, // Make ConfigService available to services
    AuthModule,   // If controller is used and needs route protection
  ],
  providers: [
    MetaApiService,
    GmailApiService,
    EmailProvidersService,
  ],
  controllers: [
    IntegrationsController // Controller for testing purposes
  ],
  exports: [ // Export services if they need to be used by other modules (e.g., CampaignsModule)
    MetaApiService,
    GmailApiService,
    EmailProvidersService,
  ],
})
export class IntegrationsModule {}
