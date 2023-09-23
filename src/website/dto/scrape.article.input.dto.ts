import { Exclude, Expose } from "class-transformer";
import { IsUrl } from "class-validator";

/**
 * Scrape Input Data
 */
@Exclude()
export class ScrapeInputDto {

    /** URL of article */
    @Expose()
    @IsUrl()
    url: string;

}