import { MOUNTAIN_BROWN } from "./colors";
import { TextSprite } from "./text-sprite";

export class Mountain extends TextSprite {
    constructor(x: number, y: number, fontSize: number) {
        super(x, y, fontSize);
        this.text = '^';
        this.tint = MOUNTAIN_BROWN;
    }
}