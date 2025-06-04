import { Injectable, NotFoundException, ForbiddenException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CreateSocialPostDto } from './dto/create-social-post.dto';
import { CreateEmailDto } from './dto/create-email.dto';
import { Campaign, SocialPost, Email, Prisma } from '@prisma/client';

@Injectable()
export class CampaignsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCampaignDto: CreateCampaignDto, userId: string): Promise<Campaign> {
    if (!userId) {
      throw new BadRequestException('User ID is required to create a campaign.');
    }
    try {
      return this.prisma.campaign.create({
        data: {
          ...createCampaignDto,
          userId,
          startDate: createCampaignDto.startDate ? new Date(createCampaignDto.startDate) : undefined,
          endDate: createCampaignDto.endDate ? new Date(createCampaignDto.endDate) : undefined,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException('Could not create campaign.');
    }
  }

  async findAll(userId: string, status?: string, channel?: string): Promise<Campaign[]> {
    const whereClause: Prisma.CampaignWhereInput = { userId };

    if (status) {
      whereClause.status = status;
    }
    if (channel) {
      whereClause.channels = { has: channel };
    }

    return this.prisma.campaign.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Campaign | null> {
    const campaign = await this.prisma.campaign.findUnique({
      where: { id },
      include: {
        socialPosts: true,
        emails: true,
      },
    });

    if (!campaign) {
      throw new NotFoundException(`Campaign with ID "${id}" not found.`);
    }
    if (campaign.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this campaign.');
    }
    return campaign;
  }

  async update(id: string, updateCampaignDto: UpdateCampaignDto, userId: string): Promise<Campaign> {
    const campaign = await this.findOne(id, userId); // Ensures campaign exists and belongs to user

    if (!campaign) { // Safeguard, should be handled by findOne
        throw new NotFoundException(`Campaign with ID "${id}" not found.`);
    }

    try {
      return this.prisma.campaign.update({
        where: { id },
        data: {
            ...updateCampaignDto,
            startDate: updateCampaignDto.startDate ? new Date(updateCampaignDto.startDate) : undefined,
            endDate: updateCampaignDto.endDate ? new Date(updateCampaignDto.endDate) : undefined,
        },
      });
    } catch (error) {
        throw new InternalServerErrorException('Could not update campaign.');
    }
  }

  async remove(id: string, userId: string): Promise<Campaign> {
    const campaign = await this.findOne(id, userId); // Ensures campaign exists and belongs to user
    
    if (!campaign) { // Safeguard
        throw new NotFoundException(`Campaign with ID "${id}" not found.`);
    }

    // For now, we'll actually delete. Consider soft delete (archiving) later.
    // Deleting a campaign will also delete related SocialPosts and Emails due to cascading delete configured in schema.prisma (implicit)
    // If not configured, manual deletion or disassociation would be needed.
    // Let's assume cascading delete is the desired behavior for now.
    try {
        return this.prisma.campaign.delete({
            where: { id },
        });
    } catch (error) {
        // Log error
        throw new InternalServerErrorException('Could not delete campaign.');
    }
  }

  async addSocialPost(campaignId: string, createSocialPostDto: CreateSocialPostDto, userId: string): Promise<SocialPost> {
    const campaign = await this.findOne(campaignId, userId); // Validates ownership and existence
    if (!campaign) {
        throw new NotFoundException(`Campaign with ID "${campaignId}" not found or you don't have access.`);
    }

    try {
      return this.prisma.socialPost.create({
        data: {
          ...createSocialPostDto,
          campaignId,
          scheduledAt: new Date(createSocialPostDto.scheduledAt),
        },
      });
    } catch (error) {
        throw new InternalServerErrorException('Could not add social post to campaign.');
    }
  }

  async addEmail(campaignId: string, createEmailDto: CreateEmailDto, userId: string): Promise<Email> {
    const campaign = await this.findOne(campaignId, userId); // Validates ownership and existence
     if (!campaign) {
        throw new NotFoundException(`Campaign with ID "${campaignId}" not found or you don't have access.`);
    }
    
    // The Email model has a `status` field (default: "pending").
    // We can add `scheduledAt` to the DTO and then decide if we map it to a specific status or a new field.
    // For now, `scheduledAt` from DTO is directly used.
    try {
      return this.prisma.email.create({
        data: {
          ...createEmailDto,
          campaignId,
          // sentAt will be null initially, status defaults to 'pending'
          // If createEmailDto.scheduledAt implies a 'scheduled' status, this logic could be added here.
          // For now, the model's default status is 'pending'.
        },
      });
    } catch (error) {
        // Log error
        throw new InternalServerErrorException('Could not add email to campaign.');
    }
  }
}
