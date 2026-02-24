import { Container, Graphics } from "pixi.js";
import { convertHashTo0x, SAND_TAN } from "./colors";

export interface LandmassOptions {
    x: number,
    y: number,
    width: number,
    height: number,
    color?: number,
}

export class Landmass extends Container {
    private graphics: Graphics;
    private points: { x: number; y: number }[] = [];

    constructor(
        options: LandmassOptions,
    ) {
        super();
        const { x, y, width, height, color = convertHashTo0x(SAND_TAN) } = options;
        this.position.set(x - width / 2, y - height / 2); // offset so x,y is the center
        this.graphics = new Graphics();
        this.addChild(this.graphics);
        this.drawShape(width, height, color);
    }

    private drawShape(width: number, height: number, color: number) {
        const points = this.generatePoints(width, height);

        this.graphics.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            // use bezier curves between points for smooth organic edges
            const prev = points[i - 1];
            const curr = points[i];
            const cpX = (prev.x + curr.x) / 2;
            const cpY = (prev.y + curr.y) / 2;
            this.graphics.quadraticCurveTo(prev.x, prev.y, cpX, cpY);
        }
        this.graphics.closePath();
        this.graphics.fill({ color });
    }

    private generatePoints(width: number, height: number): { x: number; y: number }[] {
        this.points = [];
        const pointCount = 12 + Math.floor(Math.random() * 8); // 12-20 points around the perimeter
        const centerX = width / 2;
        const centerY = height / 2;

        for (let i = 0; i < pointCount; i++) {
            const angle = (i / pointCount) * Math.PI * 2;

            // randomize the radius at each point to create an irregular shape
            const radiusX = width * (0.3 + Math.random() * 0.2);
            const radiusY = height * (0.3 + Math.random() * 0.2);

            this.points.push({
                x: centerX + Math.cos(angle) * radiusX,
                y: centerY + Math.sin(angle) * radiusY,
            });
        }

        return this.points;
    }

    getPoints(): { x: number; y: number }[] {
        return this.points.map(p => ({
            x: p.x + this.x,
            y: p.y + this.y,
        }));
    }
}