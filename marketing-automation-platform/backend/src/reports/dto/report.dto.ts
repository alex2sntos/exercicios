import { IsDate, IsEnum, IsJSON, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ReportTypeEnum } from '../enums/report-type.enum';
import { ReportStatusEnum } from '../enums/report-status.enum'; // Assuming ReportStatus was also defined as an enum

export class ReportDto {
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsEnum(ReportTypeEnum)
  type: ReportTypeEnum;

  @IsNotEmpty()
  @IsJSON({ message: 'Report data must be a valid JSON object' })
  data: any; // Prisma's Json type maps to 'any' or a specific interface

  @IsNotEmpty()
  @IsDate()
  generatedAt: Date;
  
  @IsOptional()
  @IsDate()
  sentAt?: Date;

  @IsNotEmpty()
  @IsEnum(ReportStatusEnum)
  status: ReportStatusEnum;

  @IsNotEmpty()
  @IsDate()
  createdAt: Date;

  @IsNotEmpty()
  @IsDate()
  updatedAt: Date;

  // Helper method to create a DTO from a Prisma Report model
  static fromEntity(entity: any): ReportDto { // Use 'any' if Prisma model type is not directly available/compatible
    const dto = new ReportDto();
    dto.id = entity.id;
    dto.userId = entity.userId;
    dto.type = entity.type as ReportTypeEnum;
    dto.data = entity.data; // Prisma handles JSON conversion
    dto.generatedAt = entity.generatedAt;
    dto.sentAt = entity.sentAt;
    dto.status = entity.status as ReportStatusEnum;
    dto.createdAt = entity.createdAt;
    dto.updatedAt = entity.updatedAt;
    return dto;
  }
}
