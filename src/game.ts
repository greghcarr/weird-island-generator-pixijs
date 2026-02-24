import { Application } from "pixi.js";
import { installGameFont } from "./font";
import { World } from "./world";
import { convertHashTo0x, OCEAN_BLUE, SAND_TAN } from "./colors";
import { LandmassOptions } from "./landmass";
import { WorldOptions } from "./types";

export class Game {
    private static readonly WORLD_WIDTH = 1000;
    private static readonly WORLD_HEIGHT = 1000;

    private app: Application;
    private worldOptions!: WorldOptions;
    private world!: World;

    constructor() {
        this.app = new Application();
    }

    async init() {
        installGameFont();

        await this.app.init({ background: OCEAN_BLUE, resizeTo: window });
        document.getElementById("pixi-container")!.appendChild(this.app.canvas);

        this.initWorldOptions();

        this.createWorld();

        this.populateWorld();

        window.addEventListener("resize", () => this.onResize());
        this.onResize();

        this.app.ticker.add((time) => this.update(time));
    }

    private initWorldOptions() {
        const landmassOptionsTemplate = {
            x: Game.WORLD_WIDTH / 2,
            y: Game.WORLD_HEIGHT / 2,
            width: Game.WORLD_WIDTH * 1,
            height: Game.WORLD_HEIGHT * 1,
            color: convertHashTo0x(SAND_TAN),
        } as LandmassOptions;

        let landmassOptionsList = [
            {...landmassOptionsTemplate},
        ];

        this.worldOptions = {
            landmassOptionsList,
            numRivers: 3,
            numMountainRanges: 5,
            numForests: 3,
        } as WorldOptions;
    }

    private createWorld() {
        this.world = new World(Game.WORLD_WIDTH, Game.WORLD_HEIGHT);
        this.app.stage.addChild(this.world);
    }

    private populateWorld() {
        this.world.populate(this.worldOptions);
    }

    private onResize() {
        const scaleX = this.app.screen.width / Game.WORLD_WIDTH;
        const scaleY = this.app.screen.height / Game.WORLD_HEIGHT;
        const scale = Math.min(scaleX, scaleY);

        this.world.scale.set(scale);
        this.world.x = (this.app.screen.width - Game.WORLD_WIDTH * scale) / 2;
        this.world.y = (this.app.screen.height - Game.WORLD_HEIGHT * scale) / 2;
    }

    private update(time: any) {
        this.world.update(time);
    }
}