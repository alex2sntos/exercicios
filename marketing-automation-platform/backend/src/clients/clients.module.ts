import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; // To use AuthGuard and access req.user

@Module({
  imports: [
    PrismaModule, // PrismaService is global, but good practice to import
    AuthModule,   // For JWT authentication guard
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
