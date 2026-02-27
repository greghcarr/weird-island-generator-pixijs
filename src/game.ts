import { Application } from "pixi.js";
import { installGameFont } from "./font";
import { World } from "./world";
import { DART_BLUE, OCEAN_BLUE } from "./colors";
import { WorldOptions } from "./types";

export class Game {
    private static readonly WORLD_WIDTH = 1000;
    private static readonly WORLD_HEIGHT = 1000;

    private app: Application;
    private world!: World;

    private worldOptions: WorldOptions = {
        numLandmasses: 2,
        numMountainRanges: 3,
        numRivers: 3,
        numForests: 3,
    };

    constructor() {
        this.app = new Application();
    }

    async init() {
        installGameFont();

        await this.app.init({ background: OCEAN_BLUE, resizeTo: window });
        document.getElementById("pixi-container")!.appendChild(this.app.canvas);

        this.createWorld();

        this.populateWorld();

        this.addControls();

        this.addRegenerateButton();

        window.addEventListener("resize", () => this.onResize());
        this.onResize();

        this.app.ticker.add((time) => this.update(time));
    }

    private createWorld() {
        this.world = new World(Game.WORLD_WIDTH, Game.WORLD_HEIGHT);
        this.app.stage.addChild(this.world);
    }

    private populateWorld() {
        this.world.populate(this.worldOptions);
    }

    private makeSlider(label: string, key: keyof typeof this.worldOptions, min: number, max: number) {
        const wrapper = document.createElement("div");
        wrapper.style.cssText = `display: flex; flex-direction: column; gap: 4px;`;

        const topRow = document.createElement("div");
        topRow.style.cssText = `display: flex; justify-content: space-between;`;

        const labelEl = document.createElement("span");
        labelEl.textContent = label;

        const valueEl = document.createElement("span");
        valueEl.textContent = String(this.worldOptions[key]);

        topRow.appendChild(labelEl);
        topRow.appendChild(valueEl);

        const slider = document.createElement("input");
        slider.type = "range";
        slider.min = String(min);
        slider.max = String(max);
        slider.value = String(this.worldOptions[key]);
        slider.style.cssText = `width: 100%; cursor: pointer;`;

        slider.addEventListener("input", () => {
            this.worldOptions[key] = Number(slider.value);
            valueEl.textContent = slider.value;
        });

        wrapper.appendChild(topRow);
        wrapper.appendChild(slider);
        return wrapper;
    }

    private addControls() {
        const panel = document.createElement("div");
        panel.style.cssText = `
        position: absolute;
        top: 24px;
        left: 24px;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        padding: 16px;
        border-radius: 8px;
        font-family: sans-serif;
        font-size: 14px;
        z-index: 10;
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-width: 220px;
    `;

        panel.appendChild(this.makeSlider("Landmasses", "numLandmasses", 1, 4));
        panel.appendChild(this.makeSlider("Mountain Ranges", "numMountainRanges", 0, 10));
        panel.appendChild(this.makeSlider("Rivers", "numRivers", 0, 10));
        panel.appendChild(this.makeSlider("Forests", "numForests", 0, 10));

        document.getElementById("pixi-container")!.appendChild(panel);
    }

    private addRegenerateButton() {
        const button = document.createElement("button");
        button.textContent = "Create!";
        button.style.cssText = `
        position: absolute;
        bottom: 24px;
        left: 50%;
        transform: translateX(-50%);
        padding: 10px 24px;
        font-size: 16px;
        background: ${DART_BLUE};
        color: white;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        z-index: 10;
    `;

        button.addEventListener("click", () => this.regenerate());
        document.getElementById("pixi-container")!.appendChild(button);
    }

    private regenerate() {
        this.world.destroy();
        this.createWorld();
        this.populateWorld();
        this.onResize();
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