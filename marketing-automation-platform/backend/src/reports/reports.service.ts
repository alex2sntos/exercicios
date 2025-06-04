import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException, Logger, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { ReportTypeEnum } from './enums/report-type.enum';
import { ReportStatusEnum } from './enums/report-status.enum';
import { Report, Prisma, Campaign, SocialPost, Email } from '@prisma/client';

interface CampaignMetrics {
  totalCampaigns: number;
  activeCampaigns: number;
  totalSocialPosts: number;
  totalEmailsSent: number; // Assuming 'sent' status means sent for Email model
  // Placeholders for more complex metrics
  totalReach?: number;
  totalClicks?: number;
  totalEngagement?: number;
  totalConversions?: number;
}

@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);
  private twilioAccountSid: string;
  private twilioAuthToken: string;
  private twilioWhatsAppFrom: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.twilioAccountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID');
    this.twilioAuthToken = this.configService.get<string>('TWILIO_AUTH_TOKEN');
    this.twilioWhatsAppFrom = this.configService.get<string>('TWILIO_WHATSAPP_FROM');

    if (!this.twilioAccountSid || !this.twilioAuthToken || !this.twilioWhatsAppFrom) {
      this.logger.warn('Twilio credentials not fully set. WhatsApp simulation might not reflect real API parameters.');
    }
  }

  async generateCampaignSummaryReport(
    userId: string,
    campaignId?: string,
    startDate?: Date,
    endDate?: Date,
  ): Promise<Report> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with ID "${userId}" not found.`);
    }

    const campaignWhereClause: Prisma.CampaignWhereInput = { userId };
    if (campaignId) {
      campaignWhereClause.id = campaignId;
    }
    if (startDate) {
      campaignWhereClause.createdAt = { ...campaignWhereClause.createdAt, gte: startDate };
    }
    if (endDate) {
      campaignWhereClause.createdAt = { ...campaignWhereClause.createdAt, lte: endDate };
    }

    const campaigns = await this.prisma.campaign.findMany({
      where: campaignWhereClause,
      include: { socialPosts: true, emails: { where: { status: 'sent' } } }, // Assuming 'sent' status for emails
    });

    if (campaignId && campaigns.length === 0) {
        throw new NotFoundException(`Campaign with ID "${campaignId}" not found or does not belong to user.`);
    }

    const metrics: CampaignMetrics = {
      totalCampaigns: campaigns.length,
      activeCampaigns: campaigns.filter(c => c.status === 'active').length,
      totalSocialPosts: campaigns.reduce((sum, c) => sum + c.socialPosts.length, 0),
      totalEmailsSent: campaigns.reduce((sum, c) => sum + c.emails.length, 0),
      // Mocked complex metrics
      totalReach: Math.floor(Math.random() * 5000) + 1000,
      totalClicks: Math.floor(Math.random() * 500) + 100,
      totalEngagement: Math.floor(Math.random() * 1000) + 200,
      totalConversions: Math.floor(Math.random() * 50) + 10,
    };
    
    const reportData = {
        title: campaignId ? `Summary for Campaign: ${campaigns[0]?.name || campaignId}` : 'Overall Campaign Summary',
        period: { 
            from: startDate?.toISOString().split('T')[0] || 'N/A', 
            to: endDate?.toISOString().split('T')[0] || 'N/A' 
        },
        campaignsConsidered: campaigns.map(c => ({id: c.id, name: c.name, status: c.status})),
        ...metrics,
    };

    try {
      return this.prisma.report.create({
        data: {
          userId,
          type: ReportTypeEnum.CAMPAIGN_SUMMARY,
          data: reportData as unknown as Prisma.JsonObject, // Cast to Prisma.JsonObject
          status: ReportStatusEnum.GENERATED,
        },
      });
    } catch (error) {
      this.logger.error('Failed to save report', error.stack);
      throw new InternalServerErrorException('Could not generate or save the report.');
    }
  }

  async getReportById(id: string, userId: string): Promise<Report | null> {
    const report = await this.prisma.report.findUnique({ where: { id } });
    if (!report) {
      throw new NotFoundException(`Report with ID "${id}" not found.`);
    }
    if (report.userId !== userId) {
      throw new ForbiddenException('You do not have permission to access this report.');
    }
    return report;
  }

  async listReports(userId: string, reportType?: ReportTypeEnum): Promise<Report[]> {
    const whereClause: Prisma.ReportWhereInput = { userId };
    if (reportType) {
      whereClause.type = reportType;
    }
    return this.prisma.report.findMany({
      where: whereClause,
      orderBy: { generatedAt: 'desc' },
    });
  }

  async simulateSendReportToWhatsApp(reportId: string, userId: string): Promise<{ message: string; reportStatus: ReportStatusEnum }> {
    const report = await this.getReportById(reportId, userId); // Validates ownership
    if (!report) { // Should be handled by getReportById
      throw new NotFoundException(`Report with ID "${reportId}" not found.`);
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.phoneNumber) {
      throw new BadRequestException('User phone number is not configured for WhatsApp notifications.');
    }

    // Simulate Twilio API call
    const messageBody = `Olá ${user.businessName}! Seu relatório '${report.type}' (ID: ${report.id}) foi gerado. Resumo: ${JSON.stringify(report.data, null, 2).substring(0, 200)}...`;
    this.logger.log(`SIMULATING WhatsApp message to ${user.phoneNumber} from ${this.twilioWhatsAppFrom}`);
    this.logger.log(`Twilio SID: ${this.twilioAccountSid ? 'Configured' : 'NOT CONFIGURED'}`);
    this.logger.log(`Message Body: ${messageBody}`);
    
    // Simulate success/failure
    const simulatedSuccess = Math.random() > 0.1; // 90% success rate for simulation

    if (simulatedSuccess) {
      await this.prisma.report.update({
        where: { id: reportId },
        data: { status: ReportStatusEnum.SENT, sentAt: new Date() },
      });
      this.logger.log(`Report ${reportId} status updated to SENT.`);
      return { message: `Simulated: Report ${reportId} sent to WhatsApp number ${user.phoneNumber}.`, reportStatus: ReportStatusEnum.SENT };
    } else {
      await this.prisma.report.update({
        where: { id: reportId },
        data: { status: ReportStatusEnum.FAILED_TO_SEND },
      });
      this.logger.warn(`Simulated: Failed to send report ${reportId} to WhatsApp.`);
      return { message: `Simulated: Failed to send report ${reportId} to WhatsApp.`, reportStatus: ReportStatusEnum.FAILED_TO_SEND };
    }
  }
}
