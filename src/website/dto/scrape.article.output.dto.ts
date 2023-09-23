import { Exclude, Expose } from "class-transformer";
import { ImageDto } from "./image.article.dto";

/**
 * Data Model of Webite Article Insight's
 */
@Exclude()
export class ScrapeOutputDto {

    /** Object of intro image info */
    @Expose()
    intro_image: ImageDto;

    /** Article date time */
    @Expose()
    article_datetime: string;

    /** List of images object inside article */
    @Expose()
    images: ImageDto[];

    /** Number of images that article contains in  */
    @Expose()
    images_count: number;

    /** Number of characters of article text */
    @Expose()
    char_count: number;

    /** Number of links that article contains in  */
    @Expose()
    links_count: number;

    /** List of articles links */
    @Expose()
    links: string[];

    /** Number of links that refer to Webite */
    @Expose()
    inside_links_count: number;

    /** List of links that refer to Webite */
    @Expose()
    inside_links: string[];

    /** List of links that refer to other websites */
    @Expose()
    outside_links: string[];

    /** Number of links that refer to other websites */
    @Expose()
    outside_links_count: number;

    /** List of videos that article conatins in  */
    @Expose()
    videos: string[];

    /** Number of videos that article conatins in */
    @Expose()
    videos_count: number;

    /** Number of words that article contains */
    @Expose()
    word_counts: number;

    /** List of words that article contains */
    @Expose()
    words: string[];

    /** Text of article */
    @Expose()
    text: string;

    /** Category of article */
    @Expose()
    category?: string;

    /** Sub Category of article */
    @Expose()
    subCategory?: string;

    /** comment of image validation */
    @Expose()
    comment_text?: string;

}