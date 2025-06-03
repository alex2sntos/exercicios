import {
  Controller, Post, Body, UseGuards, Req, Get, Param, Query, ValidationPipe,
  UsePipes, HttpCode, HttpStatus, ParseUUIDPipe, BadRequestException,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { GenerateReportDto } from './dto/generate-report.dto';
import { ReportDto } from './dto/report.dto';
import { AuthGuard } from '@nestjs/passport';
import { User as UserModel } from '@prisma/client';
import { ReportTypeEnum } from './enums/report-type.enum';

interface AuthenticatedRequest extends Request {
  user: Omit<UserModel, 'password'>;
}

@UseGuards(AuthGuard('jwt'))
@Controller('reports')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post('generate')
  @HttpCode(HttpStatus.CREATED)
  async generateReport(@Body() generateReportDto: GenerateReportDto, @Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const { reportType, campaignId, startDate, endDate } = generateReportDto;

    let reportEntity;
    if (reportType === ReportTypeEnum.CAMPAIGN_SUMMARY) {
      reportEntity = await this.reportsService.generateCampaignSummaryReport(
        userId,
        campaignId,
        startDate ? new Date(startDate) : undefined,
        endDate ? new Date(endDate) : undefined,
      );
    } else {
      // Placeholder for other report types
      throw new BadRequestException(`Report type "${reportType}" is not yet implemented for generation.`);
    }
    return ReportDto.fromEntity(reportEntity);
  }

  @Get()
  async listReports(
    @Req() req: AuthenticatedRequest,
    @Query('type') reportType?: ReportTypeEnum,
  ) {
    const userId = req.user.id;
    const reports = await this.reportsService.listReports(userId, reportType);
    return reports.map(ReportDto.fromEntity);
  }

  @Get(':id')
  async getReportById(@Param('id', ParseUUIDPipe) id: string, @Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    const report = await this.reportsService.getReportById(id, userId);
    return ReportDto.fromEntity(report);
  }

  @Post(':id/send-whatsapp')
  @HttpCode(HttpStatus.OK)
  async sendReportToWhatsApp(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.reportsService.simulateSendReportToWhatsApp(id, userId);
  }
}
