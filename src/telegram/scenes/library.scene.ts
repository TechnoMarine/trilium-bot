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
import { CatchSceneCommandErrorAsync } from '../bot.decorators';
import { Logger } from '@nestjs/common';
import { numberValidate } from '../telegram.validators';

const SceneCommands = {
  bookList: 'Список книг',
  bookDownload: 'Скачать книгу',
  back: 'Назад',
} as const;

@Scene(SCENES.LIBRARY_SCENE)
export class LibraryScene extends BaseScene {
  private logger = new Logger('LibraryScene');

  constructor(private readonly triliumService: TriliumService) {
    super();
  }

  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: TelegrafContext) {
    await ctx.reply(`Выберите действие`, await this.buildSceneKeyboard());
    return;
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
    await ctx.reply(`Cписок книг: \n ${msg}`, await this.buildSceneKeyboard());
    return;
  }

  @Hears(SceneCommands.bookDownload)
  @CatchSceneCommandErrorAsync
  async bookDownload(@Ctx() ctx: TelegrafContext) {
    await ctx.reply(`Выберите книгу из списка ниже`);
    const booksName = await this.triliumService.getBooksName();

    const numeratedBooks = new Map();
    let i = 0;
    for (const [bookId, bookName] of booksName.entries()) {
      numeratedBooks.set(String(i), [bookId, bookName]);
      i++;
    }

    let msg = '';
    for (const [num, book] of numeratedBooks.entries()) {
      msg += `${num}. ${book[1]}\n`;
    }
    ctx.scene.session.state['otherData'] = {
      bookDownloadState: true,
      bookMap: numeratedBooks,
    };
    await ctx.reply(msg);
    return;
  }

  @On('text')
  @CatchSceneCommandErrorAsync
  async bookDownloadSelected(@Ctx() ctx: TelegrafContext, @Next() next) {
    const { otherData } = ctx.scene.session.state;

    if (!otherData?.bookDownloadState) {
      return await next();
    }

    const { bookMap } = otherData;
    const bookNumber = ctx.message.text;
    if (!numberValidate(bookNumber)) {
      await ctx.reply('Неверный формат ввода. Повторите попытку');
      return;
    }
    const bookNode = bookMap?.get(bookNumber);

    if (!bookNode) {
      return await next(); // Assuming here that if the book number doesn't exist, it should proceed to the next middleware.
    }

    try {
      await ctx.reply(`Вы выбрали книгу ${bookNode[1]}. Отправка началась`);
      const bookStream = await this.triliumService.getNodeContentStream(
        bookNode[0],
      );
      await ctx.replyWithDocument({
        source: bookStream,
        filename: bookNode[1],
      });
      return;
    } finally {
      delete otherData['bookDownloadState'];
      delete otherData['bookList'];
      delete otherData['bookMap'];
    }
  }

  @Command(SceneCommands.back)
  async exit(@Ctx() ctx: TelegrafContext) {
    await ctx.scene.enter(SCENES.WELCOME_SCENE);
    return;
  }
}
