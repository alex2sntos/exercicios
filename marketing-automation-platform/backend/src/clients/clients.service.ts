import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client, Prisma } from '@prisma/client'; // Import Client and Prisma types

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createClientDto: CreateClientDto, userId: string): Promise<Client> {
    if (!userId) {
      throw new BadRequestException('User ID is required to create a client.');
    }
    // Ensure at least one identifying piece of information is present if name is not.
    if (!createClientDto.name && !createClientDto.email && !createClientDto.phone) {
        throw new BadRequestException('Client name, email, or phone must be provided.');
    }

    try {
      const client = await this.prisma.client.create({
        data: {
          ...createClientDto,
          userId: userId,
        },
      });
      return client;
    } catch (error) {
      // Handle potential errors, e.g., Prisma unique constraint errors if you add them later
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // Example: if you had a unique constraint on email per user
        // if (error.code === 'P2002') {
        //   throw new ConflictException('Email already exists for this user.');
        // }
      }
      throw new BadRequestException('Could not create client. Please check your input.');
    }
  }

  async findAll(userId: string, status?: string, tags?: string[]): Promise<Client[]> {
    const whereClause: Prisma.ClientWhereInput = { userId };

    if (status) {
      whereClause.status = status;
    }

    if (tags && tags.length > 0) {
      whereClause.tags = { hasSome: tags };
    }

    return this.prisma.client.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Client | null> {
    const client = await this.prisma.client.findUnique({
      where: { id },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID "${id}" not found.`);
    }

    if (client.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this client.');
    }

    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto, userId: string): Promise<Client> {
    const client = await this.findOne(id, userId); // Ensures client exists and belongs to user

    if (!client) { // Should be handled by findOne, but as a safeguard
        throw new NotFoundException(`Client with ID "${id}" not found.`);
    }

    // Ensure user is not trying to change the userId
    if ((updateClientDto as any).userId && (updateClientDto as any).userId !== userId) {
        throw new ForbiddenException('You cannot change the ownership of the client.');
    }
    
    try {
      return this.prisma.client.update({
        where: { id },
        data: updateClientDto,
      });
    } catch (error) {
        // Log error if necessary
        throw new BadRequestException('Could not update client. Please check your input.');
    }
  }

  async remove(id: string, userId: string): Promise<Client> {
    const client = await this.findOne(id, userId); // Ensures client exists and belongs to user

    if (!client) { // Should be handled by findOne, but as a safeguard
        throw new NotFoundException(`Client with ID "${id}" not found.`);
    }

    return this.prisma.client.delete({
      where: { id },
    });
  }
}
