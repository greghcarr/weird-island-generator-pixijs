import { BitmapFont } from "pixi.js";

export function installGameFont() {
    BitmapFont.install({
        name: 'GameFont',
        style: {
            fontFamily: 'Courier New',
            fontSize: 128,
            fill: 'white',
        },
        chars: [
            ['a', 'z'],
            ['A', 'Z'],
            ['0', '9'],
            '!@#$%^&*()_+-=[]{} ',
        ],
        resolution: 2,
    });
}