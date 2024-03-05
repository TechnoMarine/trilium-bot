import { TelegrafContext } from '../telegram.interfaces';
import { SCENES } from '../telegram.scenes';

export class BaseScene {
  protected async enterGeneralScene(ctx: TelegrafContext) {
    return await ctx.scene.enter(SCENES.WELCOME_SCENE);
  }
}
