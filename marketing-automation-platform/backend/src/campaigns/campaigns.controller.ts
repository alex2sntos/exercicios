import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  ParseUUIDPipe,
  ValidationPipe,
  UsePipes,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { CreateSocialPostDto } from './dto/create-social-post.dto';
import { CreateEmailDto } from './dto/create-email.dto';
import { AuthGuard } from '@nestjs/passport';
import { User as UserModel } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user: Omit<UserModel, 'password'>;
}

@UseGuards(AuthGuard('jwt'))
@Controller('campaigns')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  // Campaign CRUD
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCampaignDto: CreateCampaignDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.campaignsService.create(createCampaignDto, userId);
  }

  @Get()
  findAll(
    @Req() req: AuthenticatedRequest,
    @Query('status') status?: string,
    @Query('channel') channel?: string,
  ) {
    const userId = req.user.id;
    return this.campaignsService.findAll(userId, status, channel);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.campaignsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCampaignDto: UpdateCampaignDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.campaignsService.update(id, updateCampaignDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.campaignsService.remove(id, userId);
  }

  // Social Posts within a Campaign
  @Post(':campaignId/social-posts')
  @HttpCode(HttpStatus.CREATED)
  addSocialPost(
    @Param('campaignId', ParseUUIDPipe) campaignId: string,
    @Body() createSocialPostDto: CreateSocialPostDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.campaignsService.addSocialPost(campaignId, createSocialPostDto, userId);
  }

  // Emails within a Campaign
  @Post(':campaignId/emails')
  @HttpCode(HttpStatus.CREATED)
  addEmail(
    @Param('campaignId', ParseUUIDPipe) campaignId: string,
    @Body() createEmailDto: CreateEmailDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.campaignsService.addEmail(campaignId, createEmailDto, userId);
  }
}
