import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GenerateTextDto, ContentType } from './dto/generate-text.dto';
import { SuggestImageDto } from './dto/suggest-image.dto';
import { SuggestTimeDto } from './dto/suggest-time.dto';
// import { OpenAI } from 'openai'; // Uncomment when implementing actual API calls

interface TextSuggestionResponse {
  suggestions: string[];
}

interface ImageSuggestionResponse {
  suggestions: { url: string; alt: string }[];
}

interface TimeSuggestionResponse {
  suggestions: string[];
}

@Injectable()
export class IaAssistantService {
  private readonly logger = new Logger(IaAssistantService.name);
  // private openai: OpenAI; // Uncomment when implementing actual API calls

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('OPENAI_API_KEY');
    if (!apiKey) {
      this.logger.warn('OPENAI_API_KEY is not set. Real API calls will fail.');
    }
    // this.openai = new OpenAI({ apiKey }); // Uncomment when implementing actual API calls
  }

  async generateText(generateTextDto: GenerateTextDto): Promise<TextSuggestionResponse> {
    const { businessType, campaignGoal, contentType, keywords, tone } = generateTextDto;

    let prompt = `Você é um assistente de marketing digital.
Para um negócio do tipo "${businessType}" com o objetivo de campanha de "${campaignGoal}", gere 3 sugestões de ${this.getContentTypeDescription(contentType)}.
O tom da comunicação deve ser ${tone}.`;

    if (keywords && keywords.length > 0) {
      prompt += ` Por favor, incorpore as seguintes palavras-chave: ${keywords.join(', ')}.`;
    }

    prompt += "\nCada sugestão deve ser concisa e apropriada para o contexto.";

    this.logger.log(`Generated Prompt: ${prompt}`);

    // Simulate API Call
    // In a real scenario:
    // const response = await this.openai.chat.completions.create({
    //   model: "gpt-4", // Or "gpt-3.5-turbo"
    //   messages: [{ role: "user", content: prompt }],
    //   n: 3, // Number of suggestions
    // });
    // const suggestions = response.choices.map(choice => choice.message.content.trim());
    // return { suggestions };

    // Mocked response
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    const mockSuggestions = [
      `Sugestão de ${this.getContentTypeDescription(contentType)} 1 (mockada) para ${businessType} com tom ${tone}.`,
      `Sugestão de ${this.getContentTypeDescription(contentType)} 2 (mockada) focada em ${campaignGoal}.`,
      `Sugestão de ${this.getContentTypeDescription(contentType)} 3 (mockada) ${keywords ? 'usando keywords: ' + keywords.join(', ') : ''}.`,
    ];
    return { suggestions: mockSuggestions };
  }

  private getContentTypeDescription(contentType: ContentType): string {
    switch (contentType) {
      case ContentType.SOCIAL_POST_CAPTION: return 'legenda para post em rede social';
      case ContentType.EMAIL_SUBJECT: return 'assunto de email';
      case ContentType.EMAIL_BODY: return 'corpo de email';
      case ContentType.BLOG_POST_TITLE: return 'título para post de blog';
      case ContentType.PRODUCT_DESCRIPTION: return 'descrição de produto';
      case ContentType.AD_COPY: return 'texto para anúncio';
      default: return 'texto de marketing';
    }
  }

  async suggestImages(suggestImageDto: SuggestImageDto): Promise<ImageSuggestionResponse> {
    const { businessType, campaignGoal, textContext } = suggestImageDto;
    this.logger.log(`Suggesting images for: ${businessType}, ${campaignGoal}, Context: ${textContext}`);
    
    // Simulate API Call or logic
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      suggestions: [
        { url: `https://via.placeholder.com/600x400.png?text=Imagem+Sugerida+para+${encodeURIComponent(businessType)}+1`, alt: `Imagem para ${campaignGoal} 1` },
        { url: `https://via.placeholder.com/600x400.png?text=Imagem+Sugerida+para+${encodeURIComponent(businessType)}+2`, alt: `Imagem para ${campaignGoal} 2` },
      ],
    };
  }

  async suggestOptimalPostTimes(suggestTimeDto: SuggestTimeDto): Promise<TimeSuggestionResponse> {
    const { platform, businessType } = suggestTimeDto;
    this.logger.log(`Suggesting times for platform: ${platform}, Business: ${businessType || 'N/A'}`);

    // Simulate API Call or logic
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let mockTimes: string[] = [];
    if (platform === 'email') {
        mockTimes = ["08:00 AM (Terça-feira)", "10:00 AM (Quinta-feira)", "02:00 PM (Quarta-feira)"];
    } else {
        mockTimes = ["09:30 AM", "01:15 PM", "05:45 PM", `Melhor horário para ${platform} e ${businessType || 'negócios em geral'}`];
    }
    return { suggestions: mockTimes };
  }
}
