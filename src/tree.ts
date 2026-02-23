import { TREE_GREEN } from "./colors";
import { TextSprite } from "./text-sprite";

export class Tree extends TextSprite {
    constructor(x: number, y: number, fontSize: number) {
        super(x, y, fontSize);
        this.text = 'T';
        this.tint = TREE_GREEN;
    }
}