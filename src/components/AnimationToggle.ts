import { Container, Graphics, Text, Rectangle } from 'pixi.js';

export class AnimationToggle extends Container {
    private g: Graphics;
    private text: Text;

    constructor() {
        super();
        this.x = 80;
        this.y = 20;

        this.eventMode = 'static';
        this.cursor = 'pointer';
        this.hitArea = new Rectangle(0, 0, 50, 50);
        this.on('pointerdown', this.handleToggle.bind(this));

        this.g = new Graphics();
        this.addChild(this.g);

        this.text = new Text({ text: '✨', style: { fill: 0xffffff, fontSize: 24 } });
        this.addChild(this.text);
        
        this.updateStyle();
    }

    private handleToggle() {
        const isEnabled = (window as any)._animationsEnabled !== false; // true by default
        (window as any)._animationsEnabled = !isEnabled;
        
        this.updateStyle();
        window.dispatchEvent(new CustomEvent('animationsChange', { 
            detail: { enabled: !isEnabled } 
        }));
    }

    private updateStyle() {
        const isEnabled = (window as any)._animationsEnabled !== false;
        
        this.g.clear();
        this.g.roundRect(0, 0, 50, 50, 10);
        this.g.fill(isEnabled ? 0x008800 : 0x880000);
        
        this.text.text = isEnabled ? '✨' : '⏸️';
        this.text.x = 25 - this.text.width / 2;
        this.text.y = 25 - this.text.height / 2;
    }
}
