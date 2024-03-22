import { Logger } from '@nestjs/common';
import { TelegrafContext } from './telegram.interfaces';

const logger = new Logger('Scene command log');

export function CatchSceneCommandErrorAsync(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;
  descriptor.value = async function (
    ctx: TelegrafContext,
    next: any,
    ...args: any[]
  ) {
    try {
      return await originalMethod.apply(this, [ctx, next, args]);
    } catch (e) {
      logger.error(`${originalMethod.name} error. Description : ${e}`);
      await ctx.reply(`[Error in command ${originalMethod.name}]. ${e}`);
      await ctx.scene.reenter();
      return;
    }
  };
}
