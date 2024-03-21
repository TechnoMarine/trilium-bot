import { Context } from 'telegraf';
import { SceneContextScene } from 'telegraf/typings/scenes';
import { SCENES } from './telegram.scenes';

export type TelegrafContext = Context & {
  scene: ISceneContextScene;
};

interface ISceneContextScene extends SceneContextScene<TelegrafContext> {
  enter: (sceneId: (typeof SCENES)[keyof typeof SCENES]) => Promise<unknown>;
  session: ISession;
}

interface ISession {
  state: IState;
}

interface IState {
  otherData: IOtherData;
}

interface IOtherData {
  bookDownloadState?: boolean;
  bookMap: Map<string, string>;
}
