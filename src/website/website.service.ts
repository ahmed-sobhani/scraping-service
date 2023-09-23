import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectBrowser, InjectPage } from 'nest-puppeteer';
import { Browser, Page } from 'puppeteer';
import { ScrapeOutputDto } from './dto/scrape.article.output.dto';

/**
 * Service Provider to Scrape Webite
 */
@Injectable()
export class WebsiteService {

    /**
     * Constructor of WebsiteService
     * @param browser puppeteer browser instance
     * @param page puppeteer page instance
     * @param http http request instance
     */
    constructor(
        @InjectBrowser() private readonly browser: Browser,
        @InjectPage() private readonly page: Page,
        private readonly http: HttpService
    ) { }

    async onModuleDestroy() {
        console.log(`***\t onModuleDestroy`)
        await this.browser.close();
    }

    /**
     * Get Insight of an article placed at website.com
     * @param url URL of article
     * @returns Insight data of article.
     */
    async scrapeArticle(url: string): Promise<ScrapeOutputDto> {
        console.log(url);
        const page = await this.browser.newPage()

        try {
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
            await page.goto(url, { waitUntil: 'networkidle2' });
            await page.waitForSelector(".sarticletext")

            var images_count = (await page.$$('.sarticletext img')).length;
            
            let links = await page.$$eval('.sarticletext a',
                assetLinks => assetLinks.map((link: any) => link.href)
            );
            let videos = await page.$$eval('.sarticletext iframe',
                assetLinks => assetLinks.map((link: any) => link.src)
            );
            let images = await page.$$eval('.sarticletext img',
                assetLinks => assetLinks.map((link: any) => {
                    console.log("------------ image", link)

                    return {
                        src: link?.src,
                        name: link?.src?.split('/').pop(),
                        alt: link?.alt,
                        naturalWidth: link?.naturalWidth,
                        naturalHeight: link?.naturalHeight,
                        contentSize: link?.contentSize
                    }
                })
            );
            let introImages = await page.$$eval('.sintoroimg_main img',
                assetLinks => assetLinks.map((link: any) => {
                    return {
                        src: link?.src,
                        name: link?.src?.split('/').pop(),
                        alt: link?.alt,
                        naturalWidth: link?.naturalWidth,
                        naturalHeight: link?.naturalHeight,
                        contentSize: link?.contentSize
                    }
                })
            );
            console.log("introImage: ", introImages);

            images = await Promise.all(images.map(async (image: any) => {
                try {
                    const res = await this.http.get(image?.src).toPromise();
                    return {
                        ...image,
                        contentSize: (res?.headers["content-length"] / 1024)?.toFixed(2)
                    }
                } catch (error) {
                    console.log(`Error on get this Image: ${image?.src}`)
                }
            }))
            introImages = await Promise.all(introImages.map(async (image: any) => {
                try {
                    const res = await this.http.get(image?.src).toPromise();
                    return {
                        ...image,
                        contentSize: (res?.headers["content-length"] / 1024)?.toFixed(2)
                    }
                } catch (error) {
                    console.log(`Error on get this Image: ${image?.src}`)
                }
            }))
            let intro_image = introImages ? introImages[0] : null;
            links = links.filter(x => !x.includes("javascript:void") && x && x!="#")
            var links_count = links.length;
            const inside_links = links.filter(x => x.includes("website.com") && x && x!="#")
            const outside_links = links.filter(x => !x.includes("website.com") && x && x!="#")
            var text = await page.$eval('.sarticletext', element => element.textContent)

            const article_datetime = await page.$$eval("dl > dd.published > time", el => el.map(x => x.getAttribute("datetime")));
            let itext = text?.replace(/(^\s*)|(\s*$)/gi, "");
            itext = itext?.replace(/[ ]{2,}/gi, " ");
            itext = itext?.replace(/\n /, "\n");
            console.log(images);


            setTimeout(async ()=>{
                await page.close()
            }, 30000)

            return {
                intro_image,
                article_datetime: article_datetime && article_datetime.length > 0 ? article_datetime[0] : null,
                images,
                images_count,
                char_count: text?.length,
                links_count,
                links, inside_links,
                inside_links_count: inside_links.length,
                outside_links,
                outside_links_count: outside_links.length,
                videos, videos_count: videos?.length,
                word_counts: itext?.split("\n").join(" ").split(' ')?.filter(x => x != "").length,
                words: itext?.split("\n").join(" ").split(' ')?.filter(x => x != ""),
                text,
            };
        } catch (err) {
            await page.close()
            // await this.browser.close()
            throw new Error(err?.message)
        }
    }

    containsSpecialCharacters(str): boolean{
        var regex = /[ !@#$%^&*()+\=\[\]{};':"\\|,<>\/?]/g;
        return regex.test(str);
    }
}
