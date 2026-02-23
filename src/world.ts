import { Container } from "pixi.js";
import { Tree } from "./tree";
import { Landmass } from "./landmass";
import { pointInPolygon } from "./helpers";
import { convertHashTo0x, SAND_TAN } from "./colors";
import { Mountain } from "./mountain";
import { River } from "./river";

export class World extends Container {
    private landmass!: Landmass;

    constructor(
        private readonly worldWidth: number,
        private readonly worldHeight: number,
    ) {
        super();
        this.sortableChildren = true;
    }

    populateLand(xScale: number = 1, yScale: number = 1) {
        this.landmass = new Landmass(
            this.worldWidth / 2,
            this.worldHeight / 2,
            this.worldWidth * xScale,
            this.worldHeight * yScale,
            convertHashTo0x(SAND_TAN),
        );
        this.addChild(this.landmass);
    }

    makeRiver(boundaryPoints: { x: number; y: number }[], bounds: any) {
        const points = this.landmass.getPoints();
        const riverPoints: { x: number; y: number }[] = [];

        // start from a random inland point
        let x: number, y: number;
        let attempts = 0;
        do {
            // bias toward the center for the source
            x = bounds.x + bounds.width * (0.25 + Math.random() * 0.5);
            y = bounds.y + bounds.height * (0.25 + Math.random() * 0.5);
            attempts++;
        } while (!pointInPolygon(x, y, boundaryPoints) && attempts < 100);

        if (attempts >= 100) return;

        riverPoints.push({ x, y });

        // pick a general flow direction toward a random edge of the landmass
        const flowAngle = Math.random() * Math.PI * 2;
        const stepSize = 30;
        const maxSteps = 40;

        for (let i = 0; i < maxSteps; i++) {
            const prev = riverPoints[riverPoints.length - 1];

            // flow in general direction with some meandering wobble
            const wobble = (Math.random() - 0.5) * 3.2;
            const angle = flowAngle + wobble;

            const nx = prev.x + Math.cos(angle) * stepSize;
            const ny = prev.y + Math.sin(angle) * stepSize;

            riverPoints.push({ x: nx, y: ny });

            // stop when we've left the landmass — the river has reached the sea
            if (!pointInPolygon(nx, ny, boundaryPoints)) break;
        }

        const river = new River(riverPoints);
        this.addChild(river);
    }

    populateRivers(numRivers: number = 3) {
        const points = this.landmass.getPoints();
        const bounds = this.landmass.getBounds();

        for (let i = 0; i < numRivers; i++) {
            this.makeRiver(points, bounds);
        }
    }

    makeMountainRange(x: number, y: number, size: number, boundaryPoints: { x: number; y: number }[]) {
        const mountains: { x: number; y: number }[] = [];

        // place a founding mountain at the center
        mountains.push({ x, y });

        // grow the range by chaining mountains together
        const chainLength = 3 + Math.floor(Math.random() * 5);
        const rangeAngle = Math.random() * Math.PI * 2; // overall direction of the range

        for (let i = 0; i < chainLength; i++) {
            const prev = mountains[mountains.length - 1];

            // each mountain is placed roughly in the range direction with some wobble
            const angle = rangeAngle + (Math.random() - 0.5) * 0.8;
            const distance = size * (0.8 + Math.random() * 0.4);

            const mx = prev.x + Math.cos(angle) * distance;
            const my = prev.y + Math.sin(angle) * distance;

            if (!pointInPolygon(mx, my, boundaryPoints)) continue;

            mountains.push({ x: mx, y: my });
        }

        for (const m of mountains) {
            const mountainSize = size * (0.5 + Math.random() * 0.5);
            const mountain = new Mountain(m.x, m.y, mountainSize);
            this.addChild(mountain);
        }
    }

    populateMountains(numRanges: number) {
        const points = this.landmass.getPoints();
        const bounds = this.landmass.getBounds();

        for (let i = 0; i < numRanges; i++) {
            let mx: number, my: number;
            let attempts = 0;
            do {
                mx = bounds.x + Math.random() * bounds.width;
                my = bounds.y + Math.random() * bounds.height;
                attempts++;
            } while (!pointInPolygon(mx, my, points) && attempts < 100);

            if (attempts < 100) {
                const rangeSize = 120 + Math.random() * 40;
                this.makeMountainRange(mx, my, rangeSize, points);
            }
        }
    }

    makeForest(x: number, y: number, size: number, boundaryPoints: { x: number; y: number }[]) {
        const trees: { x: number; y: number }[] = [];

        const founderCount = 2 + Math.floor(Math.random() * 4);
        for (let i = 0; i < founderCount; i++) {
            const founderX = x + (Math.random() - 0.5) * size * 0.5;
            const founderY = y + (Math.random() - 0.5) * size * 0.5;
            if (pointInPolygon(founderX, founderY, boundaryPoints)) {
                trees.push({
                    x: founderX,
                    y: founderY,
                });
            }
        }

        const generations = 8;
        for (let gen = 0; gen < generations; gen++) {
            const currentTrees = [...trees];
            for (const parent of currentTrees) {
                const seedCount = 100 + Math.floor(Math.random() * 0);
                for (let s = 0; s < seedCount; s++) {
                    const angle = Math.random() * Math.PI * 2;
                    // vary distance more dramatically for irregular spread
                    const distance = 10 + Math.random() * size * 0;

                    const seedX = parent.x + Math.cos(angle) * distance;
                    const seedY = parent.y + Math.sin(angle) * distance;

                    // survival chance decreases with distance from forest center
                    const distFromCenter = Math.hypot(seedX - x, seedY - y);
                    const survivalChance = Math.max(0, 0.2 - (distFromCenter / (size * 0.1)));
                    if (Math.random() > survivalChance) continue;

                    if (!pointInPolygon(seedX, seedY, boundaryPoints)) continue;

                    trees.push({ x: seedX, y: seedY });
                }
            }
        }

        for (const t of trees) {
            const treeSize = 32 + Math.random() * 32;
            const tree = new Tree(t.x, t.y, treeSize);
            this.addChild(tree);
        }
    }

    populateTrees(numForests: number) {
        const points = this.landmass.getPoints();
        const bounds = this.landmass.getBounds();

        for (let i = 0; i < numForests; i++) {
            // keep trying random positions until we find one inside the landmass
            let fx: number, fy: number;
            let attempts = 0;
            do {
                fx = bounds.x + Math.random() * bounds.width;
                fy = bounds.y + Math.random() * bounds.height;
                attempts++;
            } while (!pointInPolygon(fx, fy, points) && attempts < 100);

            if (attempts < 100) {
                const forestSize = 80 + Math.random() * 120;
                this.makeForest(fx, fy, forestSize, points);
            }
        }
    }

    populate() {
        this.populateLand(1 + Math.random() * 1.5, 2 + Math.random() * 0.5);
        this.populateRivers(0 + Math.random() * 7);
        this.populateMountains(2 + Math.random() * 8);
        this.populateTrees(1 + Math.random() * 9);
    }

    update(time: any) {
        // update game objects each tick
    }
}