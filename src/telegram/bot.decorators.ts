import { Logger } from '@nestjs/common';
import { TelegrafContext } from './telegram.interfaces';

const logger = new Logger('Top level logger');

export function CatchErrorAsync(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;
  descriptor.value = async function (ctx: TelegrafContext, ...args: any[]) {
    try {
      logger.verbose('Decorator works');
      return await originalMethod.apply(this, [ctx, args]);
    } catch (e) {
      logger.verbose(`${originalMethod.name} error. Description : ${e}`);
      await ctx.reply('Error in decorator');
      await ctx.scene.reenter();
      return;
    }
  };
}
