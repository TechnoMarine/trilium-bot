import { Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { TelegrafContext } from '../telegram.interfaces';
import { SCENES } from '../telegram.scenes';
import { Markup } from 'telegraf';
import { BaseScene } from './base.scene';

const SceneCommands = {
  library: 'Библиотека',
} as const;

@Scene(SCENES.WELCOME_SCENE)
export class WelcomeScene extends BaseScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: TelegrafContext) {
    await ctx.reply('You are in welcome scene');
    await ctx.reply('welcome', await this.buildSceneKeyboard());
    return;
  }

  async buildSceneKeyboard() {
    const buttons = [];
    for (const key in SceneCommands) {
      buttons.push(Markup.button.text(SceneCommands[key]));
    }
    return Markup.keyboard(buttons).oneTime().resize();
  }

  @Hears(SceneCommands.library)
  async bookDownload(@Ctx() ctx: TelegrafContext) {
    await ctx.scene.enter(SCENES.LIBRARY_SCENE);
    return;
  }
}
