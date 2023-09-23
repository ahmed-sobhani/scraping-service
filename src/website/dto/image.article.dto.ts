import { Exclude, Expose } from "class-transformer";
import { IsUrl } from "class-validator";

/**
 * Scraped Image Info
 */
@Exclude()
export class ImageDto {

    /** Source of image */
    @Expose()
    src: string;

    /** Name of image */
    @Expose()
    name: string;

    /** Image's alt */
    @Expose()
    alt: string;

    /** Image's width */
    @Expose()
    naturalWidth: number;

    /** Image's height */
    @Expose()
    naturalHeight: number;

    /** Image's size(kb) */
    @Expose()
    contentSize: number;

}