import { director } from "cc";
import { SCENE } from "../../common/enums";
import { util } from "../util";
import { sceneCommon } from "../../common/common/common";


export async function  sceneDirector(sceneNow: SCENE, sceneWill: SCENE) {
  const close = await util.message.load()
  director.preloadScene(sceneWill, async()=> {
      sceneCommon.lastScene = sceneNow
      sceneCommon.currentScene = sceneWill
      close();
  })
  director.loadScene(sceneWill);
}