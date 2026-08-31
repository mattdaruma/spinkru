import { Container, Graphics, Text, Rectangle } from 'pixi.js';

export class RefreshButton extends Container {
    private g: Graphics;
    private text: Text;

    constructor() {
        super();
        this.x = 20;
        this.y = 20;

        this.eventMode = 'static';
        this.cursor = 'pointer';
        this.hitArea = new Rectangle(0, 0, 50, 50);
        this.on('pointerdown', this.handleRefresh.bind(this));

        this.g = new Graphics();
        this.g.roundRect(0, 0, 50, 50, 10);
        this.g.fill(0x555555);
        this.addChild(this.g);

        this.text = new Text({ text: '🔄', style: { fontSize: 24 } });
        this.text.x = 25 - this.text.width / 2;
        this.text.y = 25 - this.text.height / 2;
        this.addChild(this.text);
    }

    private async handleRefresh() {
        this.text.text = '⏳';
        this.text.x = 25 - this.text.width / 2;
        this.text.y = 25 - this.text.height / 2;
        
        if ('caches' in window) {
            try {
                const cacheNames = await caches.keys();
                await Promise.all(cacheNames.map(name => caches.delete(name)));
            } catch (e) {
                console.error('Error clearing caches', e);
            }
        }
        if ('serviceWorker' in navigator) {
            try {
                const registrations = await navigator.serviceWorker.getRegistrations();
                for (let registration of registrations) {
                    await registration.unregister();
                }
            } catch (e) {
                console.error('Error unregistering sw', e);
            }
        }
        window.location.reload();
    }
}
