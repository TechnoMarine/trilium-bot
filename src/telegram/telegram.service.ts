import { Update, Ctx, Start, Help, On, Hears } from 'nestjs-telegraf';
import { TelegrafContext } from './telegram.interfaces';
import { SCENES } from './telegram.scenes';

@Update()
export class TelegramService {
  @Start()
  async start(@Ctx() ctx: TelegrafContext) {
    await ctx.reply('Welcome');
  }

  @Help()
  async help(@Ctx() ctx: TelegrafContext) {
    await ctx.reply('Send me a sticker');
  }

  @On('sticker')
  async on(@Ctx() ctx: TelegrafContext) {
    await ctx.reply('👍');
    await ctx.scene.enter(SCENES.WELCOME_SCENE);
  }

  @Hears('hi')
  async hears(@Ctx() ctx: TelegrafContext) {
    await ctx.scene.enter(SCENES.WELCOME_SCENE);
  }
}
