import { AVGGame } from '..';
import { AVGEngineError } from "./../core/engine-errors";
import * as vm from "vm";

import { AVGNativeFS } from "../core/native-modules/avg-native-fs";
import { AVGScriptUnit } from "../scripting/script-unit";
import { Sandbox } from "../core/sandbox";
import { Transpiler } from "../scripting/transpiler";
import { i18n } from "../core";

export class AVGStory {
  private static sanbox: Sandbox = new Sandbox();

  // private _scriptUnits: Array<AVGScriptUnit> = [];
  // private _cursor: number = 0;
  private _code: string;
  private _compiled: string;
  public static TracingScriptFile: string;

  // private static _scriptingHandle: Promise<{}> = null;
  private static _scriptingResolver = null;
  // private static _scriptingEvalInContext = null;
  constructor() { }

  public async loadFromFile(filename: string) {
    AVGStory.TracingScriptFile = filename;

    const response = await AVGNativeFS.readFileSync(filename);

    this.loadFromString(response);
  }

  public async loadFromString(code: string) {
    this._code = code;
    this.compile();
  }

  private compile() {
    this._compiled = Transpiler.transpileFromCode(this._code);
  }

  public static UnsafeTerminate() {
    // AVGStory.sanbox._shouldForceTerminate = true;
    // AVGStory._scriptingEvalInContext.call(AVGStory.sanbox);

    // AVGStory._scriptingResolver();
  }

  public async stop() {
    AVGStory._scriptingResolver = null;
  }

  public async run() {
    return new Promise((resolve, reject) => {
      try {
        // AVGStory._scriptingResolver = resolve;

        // Universal
        const evalInContext = (js, context) => {
          const result = (() => {
            return eval(js);
          }).call(context);

          return result;
        };

        try {

          AVGStory.sanbox.game = AVGGame.getInstance();
          const context = {
            ...AVGStory.sanbox,
            done: () => {
              if (resolve)
                resolve();
            }
          };

          evalInContext(this._compiled, context);
        } catch (err) {
          throw err;
        }

        // Run in Node.js
        // let script = new vm.Script(this._compiled);
        // script.runInNewContext(vm.createContext(AVGStory.sanbox), {
        //   displayErrors: true
        // });
      } catch (err) {
        AVGEngineError.emit(i18n.lang.SCRIPTING_AVS_RUNTIME_EXCEPTION, err, {});
      }
    });
  }
}
