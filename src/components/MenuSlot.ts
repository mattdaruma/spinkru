import { Container, Graphics } from 'pixi.js';

export class MenuSlot extends Container {
    constructor(width: number, height: number) {
        super();
        const g = new Graphics();
        g.roundRect(0, 0, width, height, 24);
        g.fill(0x333333);
        this.addChild(g);
    }
}
