import { Container, Graphics } from "pixi.js";
import { OCEAN_BLUE } from "./colors";

export class River extends Container {
    constructor(
        points: { x: number; y: number }[]
    ) {
        super();
        if (points.length < 2) return;

        const graphics = new Graphics();

        // draw the river as a smooth curve through the points
        graphics.moveTo(points[0].x, points[0].y);

        for (let i = 1; i < points.length - 1; i++) {
            const curr = points[i];
            const next = points[i + 1];
            const cpX = (curr.x + next.x) / 2;
            const cpY = (curr.y + next.y) / 2;
            graphics.quadraticCurveTo(curr.x, curr.y, cpX, cpY);
        }

        graphics.lineTo(points[points.length - 1].x, points[points.length - 1].y);

        // rivers get wider as they flow downstream
        graphics.stroke({ width: 10, color: OCEAN_BLUE, alpha: 0.85 });

        this.addChild(graphics);
    }
}