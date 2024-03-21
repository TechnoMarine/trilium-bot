import {
  Command,
  Ctx,
  Hears,
  Next,
  On,
  Scene,
  SceneEnter,
} from 'nestjs-telegraf';
import { TelegrafContext } from '../telegram.interfaces';
import { SCENES } from '../telegram.scenes';
import { Markup } from 'telegraf';
import { BaseScene } from './base.scene';
import { TriliumService } from '../../trilium/trilium.service';

const SceneCommands = {
  bookList: 'Список книг',
  bookDownload: 'Скачать книгу',
  back: 'Назад',
} as const;

@Scene(SCENES.LIBRARY_SCENE)
export class LibraryScene extends BaseScene {
  constructor(private readonly triliumService: TriliumService) {
    super();
  }

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: TelegrafContext) {
    return await ctx.reply(
      'Выберите действие',
      await this.buildSceneKeyboard(),
    );
  }

  private async buildSceneKeyboard() {
    const buttons = [];
    for (const key in SceneCommands) {
      buttons.push(Markup.button.text(SceneCommands[key]));
    }
    return Markup.keyboard(buttons).oneTime().resize();
  }

  @Hears(SceneCommands.bookList)
  async getListBook(@Ctx() ctx: TelegrafContext) {
    const msg = await this.triliumService.getBookList();
    return await ctx.reply(
      `Cписок книг: \n ${msg}`,
      await this.buildSceneKeyboard(),
    );
  }

  @Hears(SceneCommands.bookDownload)
  async bookDownload(@Ctx() ctx: TelegrafContext) {
    await ctx.reply('Выберите книгу из списка ниже');
    const booksName = await this.triliumService.getBooksName();

    const numeratedBooks = new Map();
    let i = 0;
    for (const [bookId, bookName] of booksName.entries()) {
      numeratedBooks.set(i, [bookId, bookName]);
      i++;
    }

    let msg = '';
    // let bookMsg = await this.triliumService.buildBookListMessage(booksName);
    for (const [num, book] of numeratedBooks.entries()) {
      msg += `${num}. ${book[1]}\n`;
    }
    ctx.scene.session.state['otherData'] = {
      bookDownloadState: true,
      bookMap: numeratedBooks,
    };
    await ctx.reply(msg);
  }

  @On('text')
  async bookDownloadSelected(@Ctx() ctx: TelegrafContext, @Next() next) {
    if (
      ctx.scene.session.state['otherData'].hasOwnProperty('bookDownloadState')
    ) {
      if (!ctx.scene.session.state['otherData']['bookDownloadState']) {
        return next();
      }
    }
    const { otherData } = ctx.scene.session.state;
    const { bookMap } = otherData;
    try {
      const bookNumber = ctx.message.text;
      const bookNode = bookMap.get(bookNumber);
      await ctx.reply(`Вы выбрали книгу с id ${bookNode[0]}`);
    } catch (e) {
      delete otherData['bookDownloadState'];
      delete otherData['bookList'];
      return await ctx.reply('Неверный формат');
    }
  }

  @Command(SceneCommands.back)
  async exit(@Ctx() ctx: TelegrafContext) {
    return ctx.scene.enter(SCENES.WELCOME_SCENE);
  }
}
