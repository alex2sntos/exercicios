import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { ReportTypeEnum } from '../enums/report-type.enum';

export class GenerateReportDto {
  @IsNotEmpty({ message: 'Report type should not be empty' })
  @IsEnum(ReportTypeEnum, { message: 'Invalid report type selected' })
  reportType: ReportTypeEnum;

  @IsOptional()
  @IsUUID('4', { message: 'Campaign ID must be a valid UUID' })
  campaignId?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid ISO 8601 date string' })
  startDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid ISO 8601 date string' })
  endDate?: string;
}
