import { Controller, Post, Body, UseGuards, ValidationPipe, UsePipes, HttpCode, HttpStatus, Req } from '@nestjs/common';
import { IaAssistantService } from './ia-assistant.service';
import { GenerateTextDto } from './dto/generate-text.dto';
import { SuggestImageDto } from './dto/suggest-image.dto';
import { SuggestTimeDto } from './dto/suggest-time.dto';
import { AuthGuard } from '@nestjs/passport';
import { User as UserModel } from '@prisma/client'; // To avoid conflict if req.user is typed

// If your AuthGuard and JwtStrategy populate req.user, you might want to type it
interface AuthenticatedRequest extends Request {
  user: Omit<UserModel, 'password'>; 
}

@UseGuards(AuthGuard('jwt'))
@Controller('ia-assistant')
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }))
export class IaAssistantController {
  constructor(private readonly iaAssistantService: IaAssistantService) {}

  @Post('generate-text')
  @HttpCode(HttpStatus.OK)
  async generateText(@Body() generateTextDto: GenerateTextDto, @Req() req: AuthenticatedRequest) {
    // You can use req.user here if needed, for example, to log which user is making requests
    // or to tailor suggestions based on user's business history (future enhancement)
    return this.iaAssistantService.generateText(generateTextDto);
  }

  @Post('suggest-images')
  @HttpCode(HttpStatus.OK)
  async suggestImages(@Body() suggestImageDto: SuggestImageDto, @Req() req: AuthenticatedRequest) {
    return this.iaAssistantService.suggestImages(suggestImageDto);
  }

  @Post('suggest-times')
  @HttpCode(HttpStatus.OK)
  async suggestOptimalPostTimes(@Body() suggestTimeDto: SuggestTimeDto, @Req() req: AuthenticatedRequest) {
    return this.iaAssistantService.suggestOptimalPostTimes(suggestTimeDto);
  }
}
