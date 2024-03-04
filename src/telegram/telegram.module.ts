import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';
import { session } from 'telegraf';
import { TelegramService } from './telegram.service';
import { WelcomeScene } from './scenes/welcome.scene';

@Module({
  providers: [TelegramService, WelcomeScene],
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
  ],
})
export class TelegramModule {}
