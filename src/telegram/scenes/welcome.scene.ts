import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { TelegrafContext } from '../telegram.interfaces';
import { Message } from 'telegraf/typings/core/types/typegram';
import { SCENES } from '../telegram.scenes';

@Scene(SCENES.WELCOME_SCENE)
export class WelcomeScene {
  @SceneEnter()
  async onSceneEnter(
    @Ctx() ctx: TelegrafContext,
  ): Promise<Message.TextMessage> {
    await ctx.reply('You are in welcome scene');
    return;
  }
}
