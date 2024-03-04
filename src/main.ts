import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const PORT = parseInt(configService.get('PORT')) || 4001;
    await app.listen(PORT);
    console.log('port: ' + PORT);
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
