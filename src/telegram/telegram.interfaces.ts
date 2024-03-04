import { Context as BaseContext } from 'telegraf';
import { SceneContextScene } from 'telegraf/typings/scenes';
import { SCENES } from './telegram.scenes';

export type TelegrafContext = BaseContext & {
  scene: ISceneContextScene;
};

interface ISceneContextScene extends SceneContextScene<TelegrafContext> {
  enter: (sceneId: (typeof SCENES)[keyof typeof SCENES]) => Promise<unknown>;
}
