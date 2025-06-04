import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ConfigModule } from '@nestjs/config'; // For ConfigService

@Module({
  imports: [
    PrismaModule, // PrismaService is global
    AuthModule,   // For JWT authentication guard
    ConfigModule, // To access environment variables like Twilio credentials
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
