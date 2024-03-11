import { Update, Ctx, Start, On, Hears } from 'nestjs-telegraf';
import { TelegrafContext } from './telegram.interfaces';
import { SCENES } from './telegram.scenes';

@Update()
export class TelegramService {
  @Start()
  async start(@Ctx() ctx: TelegrafContext) {
    await ctx.scene.enter(SCENES.WELCOME_SCENE);
  }

  @On('text')
  async onText(@Ctx() ctx: TelegrafContext) {
    await ctx.scene.enter(SCENES.WELCOME_SCENE);
  }

  @Hears('hi')
  async hears(@Ctx() ctx: TelegrafContext) {
    return await ctx.reply('hi');
  }
}
