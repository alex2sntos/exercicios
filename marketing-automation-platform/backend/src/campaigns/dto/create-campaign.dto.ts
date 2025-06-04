import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, ArrayNotEmpty, MinLength } from 'class-validator';

// Example enum for channels, can be expanded
export enum CampaignChannel {
  EMAIL = 'email',
  INSTAGRAM = 'instagram',
  FACEBOOK = 'facebook',
  WHATSAPP = 'whatsapp',
  SMS = 'sms',
  LINKEDIN = 'linkedin',
  TWITTER = 'twitter', // X
  TIKTOK = 'tiktok',
  OTHER = 'other',
}

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  COMPLETED = 'completed',
  ARCHIVED = 'archived',
  PAUSED = 'paused',
}

export class CreateCampaignDto {
  @IsNotEmpty({ message: 'Campaign name should not be empty' })
  @IsString({ message: 'Campaign name must be a string' })
  @MinLength(3, { message: 'Campaign name must be at least 3 characters long' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Goal must be a string' })
  goal?: string;

  @IsArray({ message: 'Channels must be an array' })
  @ArrayNotEmpty({ message: 'At least one channel must be selected' })
  @IsEnum(CampaignChannel, { each: true, message: 'Invalid channel selected' })
  channels: CampaignChannel[];

  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid ISO 8601 date string' })
  startDate?: string; // Using string for ISO date format

  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid ISO 8601 date string' })
  endDate?: string; // Using string for ISO date format

  @IsOptional()
  @IsEnum(CampaignStatus, { message: 'Invalid status value' })
  status?: CampaignStatus = CampaignStatus.DRAFT;
}
