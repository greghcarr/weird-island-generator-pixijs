import { BitmapText } from "pixi.js";

export class TextSprite extends BitmapText {
    constructor(
        x: number,
        y: number,
        fontSize: number,
    ) {
        super({
            text: '!',
            style: {
                fontFamily: 'GameFont',
                fontSize,
                fill: '#ffffff',
            },
            anchor: { x: 0.5, y: 0.5 },
            x,
            y,
            eventMode: 'static',
            cursor: 'auto',
        });
        this.zIndex = y;
    }
}