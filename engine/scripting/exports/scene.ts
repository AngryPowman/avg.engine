import { APIExport, AVGExportedAPI } from "./avg-exported-api";
import { APIScene, SceneHandle } from "../api/api-scene";
import { Scene } from "../../data/scene";
import { mergeDeep, paramCompatible } from "../../core/utils";
import { ResourcePath } from "../../core/resource";
import { ResourceData } from "../../data/resource-data";
import { APIManager } from "../api-manager";
import { OP } from "../../const/op";
import { SoundBGM } from "../../data/sound";
import { APISound } from "../api/api-sound";
import { SoundTrack } from "../../const/model";

@APIExport("scene", EngineAPI_Scene)
export class EngineAPI_Scene extends AVGExportedAPI {
  /**
   * Load scene with image filename
   *
   * @export
   * @param {string} filename The background image file of scene
   * @param {Scene} [options]
   */
  public static async load(index: number, filename: string, options?: Scene): Promise<SceneHandle> {
    let model = new APIScene();
    model.index = index;

    options = mergeDeep(new Scene(), options);

    if (filename && filename.length > 0) {
      paramCompatible<APIScene, Scene>(model, options, {
        field: "file",
        value: ResourceData.from(filename, ResourcePath.Backgrounds)
      });
    } else {
      model.isAsync = false;
      paramCompatible<APIScene, Scene>(model, options, {
        field: "file",
        value: ResourceData.from("//:0")
      });
    }

    // options.duration = options.duration;
    // options.transition = options.transition || "";
    Object.assign(model.data, options);

    let proxy = APIManager.getImpl(APIScene.name, OP.LoadScene);
    if (proxy) {
      return <SceneHandle>await proxy.runner(<APIScene>model);
    } else {
      return null;
    }
  }

  public static async remove(index: number): Promise<SceneHandle> {
    let model = new APIScene();
    model.index = index;

    return <SceneHandle>await APIManager.getImpl(APIScene.name, OP.RemoveScene).runner(<APIScene>model);
  }

  public static async animate(index: number, animateName: string, options: any) {}
}
