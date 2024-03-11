import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramModule } from './telegram/telegram.module';
import { ConfigModule } from '@nestjs/config';
import { TriliumModule } from './trilium/trilium.module';

@Module({
  imports: [TelegramModule, ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }), TriliumModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
