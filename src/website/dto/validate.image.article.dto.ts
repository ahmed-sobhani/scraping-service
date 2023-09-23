import { Exclude, Expose } from "class-transformer";

/**
 * Scraped Image Info
 */
@Exclude()
export class ImageValidationDto {

    /** no_violation of image */
    @Expose()
    no_violation: string;

    /** comment_text of image validation */
    @Expose()
    comment_text: string;

}