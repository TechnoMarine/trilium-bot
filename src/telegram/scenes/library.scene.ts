import { Command, Ctx, Hears, Scene, SceneEnter } from 'nestjs-telegraf';
import { TelegrafContext } from '../telegram.interfaces';
import { SCENES } from '../telegram.scenes';
import { Markup } from 'telegraf';
import { BaseScene } from './base.scene';

const SceneCommands = {
  bookList: 'Список книг',
  bookDownload: 'Скачать книгу',
  back: 'Назад',
} as const;

@Scene(SCENES.LIBRARY_SCENE)
export class WelcomeScene extends BaseScene {
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: TelegrafContext) {
    await ctx.reply('You are in welcome scene');
    await ctx.reply('кнопки', await this.buildSceneKeyboard());
    return;
  }

  async buildSceneKeyboard() {
    const buttons = [];
    for (const key in SceneCommands) {
      buttons.push(Markup.button.text(SceneCommands[key]));
    }
    return Markup.keyboard(buttons).oneTime().resize();
  }

  @Hears(SceneCommands.bookDownload)
  async bookDownload(@Ctx() ctx: TelegrafContext) {
    await ctx.reply('Теперь вы можете скачать книгу');
    return;
  }

  @Command(SceneCommands.back)
  async exit(@Ctx() ctx: TelegrafContext) {
    return ctx.reply('Вы вышли из сцены');
  }
}
