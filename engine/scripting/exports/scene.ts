import { APIExport, AVGExportedAPI } from "./avg-exported-api";
import { APIScene, SceneHandle } from "../api/api-scene";
import { Scene } from "../../data/scene";
import { mergeDeep, paramCompatible } from "../../core/utils";
import { ResourcePath } from "../../core/resource";
import { ResourceData } from "../../data/resource-data";
import { APIManager } from "../api-manager";
import { OP } from "../../const/op";
import { APISound } from "../api/api-sound";
import { SoundTrack } from "../../const/model";
import { Sandbox } from "../..";
import { APIExportName } from "../api-export-name";

@APIExport(APIExportName.Scene, EngineAPI_Scene)
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

    // 跳过模式处理，忽略时间
    if (Sandbox.isSkipMode && Sandbox.skipOptions.scenes === true) {
      model.data.duration = 0;
    }

    let proxy = APIManager.getImpl(APIScene.name, OP.LoadScene);
    if (proxy) {
      Sandbox.runtime.update(OP.LoadScene, {
        index: index,
        filename: filename,
        options: options
      });
      return <SceneHandle>await proxy.runner(<APIScene>model);
    } else {
      return null;
    }
  }

  public static async remove(index: number): Promise<SceneHandle> {
    let model = new APIScene();
    model.index = index;

    Sandbox.runtime.update(OP.RemoveScene, {
      index: index
    });
    return <SceneHandle>await APIManager.getImpl(APIScene.name, OP.RemoveScene).runner(<APIScene>model);
  }

  public static async animate(index: number, animateName: string, options: any) {}
}
