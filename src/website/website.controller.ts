import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ResultDto } from 'src/common/dto/result.dto';
import { ScrapeInputDto } from './dto/scrape.article.input.dto';
import { WebsiteService } from './website.service';

/**
 * Webite Scrape Patterns
 */
@Controller()
export class WebsiteController {
  /**
   * Constructor of controller
   * @param websiteService Instance of WebsiteService
   */
  constructor(private readonly websiteService: WebsiteService) { }

  /**
   * Scrape And Get Data From Webite
   * @param ScrapeInputDto Contain URL of article 
   * @returns An object of basic result
   */
  @MessagePattern('scrapeArticleWebsite')
  async findAll({ url }: ScrapeInputDto): Promise<ResultDto> {
    try {
      const data = await this.websiteService.scrapeArticle(url);
      return new ResultDto(200, data, null);
    } catch (err) {
      return new ResultDto(
        err?.message === 'internal server error' ? 500 : 400,
        null,
        err?.message,
      );
    }
  }
}
