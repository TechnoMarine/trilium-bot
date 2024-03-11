import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { session } from 'telegraf';
import { TelegramService } from './telegram.service';
import { WelcomeScene } from './scenes/welcome.scene';
import { LibraryScene } from './scenes/library.scene';
import { TriliumModule } from '../trilium/trilium.module';

@Module({
  providers: [TelegramService, WelcomeScene, LibraryScene],
  imports: [
    TelegrafModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const token = configService.get<string>('BOT_TOKEN');
        return {
          token: token,
          middlewares: [session()],
        };
      },
      inject: [ConfigService],
    }),
    TriliumModule,
  ],
})
export class TelegramModule {}
