import { Env } from "./env";
import * as path from "path";
import * as fs from "fs";
export enum ResourcePath {
    // Audio
    BGM,
    BGS,
    SE,
    Voice,

    // Graphics
    Backgrounds,
    Images,
    Characters,
    Masks,
    UI,
    Icons,
    Effects,

    // Plugins
    Plugins,

    // Data
    Data,

    // Script
    Scripts
}

export class Resource {
    private static _paths: Map<ResourcePath, string>;
    private static _assetsRoot: string;

    public static init(rootDir: string) {
        this._assetsRoot = rootDir;

        /* 
            To use initialize paths, you should create the following directory structure:
            
            Root
            ├── audio
            │   ├── bgm
            │   ├── bgs
            │   ├── voice
            │   └── se
            ├── data
            ├── graphics
            │   ├── backgrounds
            │   ├── images
            │   ├── characters
            │   ├── effects
            │   ├── masks
            │   ├── icons
            │   └── ui
            ├── plugins
            └── scripts
        */

        this._paths = new Map<ResourcePath, string>([
            [ResourcePath.BGM, "audio/bgm"],
            [ResourcePath.BGS, "audio/bgs"],
            [ResourcePath.SE, "audio/se"],
            [ResourcePath.Voice, "audio/voice"],
            [ResourcePath.Backgrounds, "graphics/backgrounds"],
            [ResourcePath.Images, "graphics/images"],
            [ResourcePath.Characters, "graphics/characters"],
            [ResourcePath.Masks, "graphics/masks"],
            [ResourcePath.UI, "graphics/ui"],
            [ResourcePath.Icons, "graphics/icons"],
            [ResourcePath.Effects, "graphics/effects"],
            [ResourcePath.Plugins, "plugins"],
            [ResourcePath.Data, "data"],
            [ResourcePath.Scripts, "scripts"]
        ]);

        console.log(`Initialize resource root folder: ${this._assetsRoot}`);
    }

    public static getRoot(): string {
        return this._assetsRoot;
    }

    public static getPath(dir: ResourcePath, joinPath: string = ""): string {
        let dirPath = this._paths.get(dir);
        if (!dirPath) {
            return undefined;
        }

        if (Env.isRunStandalone()) {
            // Run in node.js
            dirPath = path.join(this._assetsRoot, dirPath, joinPath);
        }

        return dirPath;
    }

    public static readFileText(file: string): string {
        return fs.readFileSync(file, { encoding: "utf8", flag: "r" });
    }
}
