import { Module } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { WebsiteController } from './website.controller';
import { PuppeteerModule } from 'nest-puppeteer';
import { HttpModule } from '@nestjs/axios';
import { LaunchOptions } from 'puppeteer';

@Module({
  imports: [
    PuppeteerModule.forRoot(

      <LaunchOptions>{
        // pipe: true,
        executablePath: process.env.CHROMIUM_PATH,
        args: ['--no-sandbox',
          '--headless',
          '--disable-gpu',
          '--window-size=1920x1080'
        ],
      }, // optional, any Puppeteer launch options here or leave empty for good defaults */,
    ),
    HttpModule.register({

    }),
  ],
  controllers: [WebsiteController],
  providers: [WebsiteService]
})
export class WebsiteModule { }
