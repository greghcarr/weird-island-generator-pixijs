import { Application } from "pixi.js";
import { installGameFont } from "./font";
import { World } from "./world";
import { OCEAN_BLUE } from "./colors";

export class Game {
    private static readonly WORLD_WIDTH = 1000;
    private static readonly WORLD_HEIGHT = 1000;

    private app: Application;
    private world!: World;

    constructor() {
        this.app = new Application();
    }

    async init() {
        installGameFont();

        await this.app.init({ background: OCEAN_BLUE, resizeTo: window });
        document.getElementById("pixi-container")!.appendChild(this.app.canvas);

        this.world = new World(Game.WORLD_WIDTH, Game.WORLD_HEIGHT);
        this.app.stage.addChild(this.world);

        this.world.populate();

        window.addEventListener("resize", () => this.onResize());
        this.onResize();

        this.app.ticker.add((time) => this.update(time));
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