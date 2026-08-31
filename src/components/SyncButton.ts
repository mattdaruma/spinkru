import { Container, Graphics, Ticker } from 'pixi.js';
import { Howler } from 'howler';

export class SyncButton extends Container {
    private ringBg: Graphics;
    private ringFill: Graphics;
    private icon: Graphics;
    private isMuted: boolean = false;
    private elapsedMs: number = 0;

    constructor() {
        super();
        
        this.eventMode = 'static';
        this.cursor = 'pointer';

        this.ringBg = new Graphics();
        this.addChild(this.ringBg);

        this.ringFill = new Graphics();
        this.addChild(this.ringFill);

        this.icon = new Graphics();
        this.addChild(this.icon);

        this.on('pointerdown', () => {
            this.isMuted = !this.isMuted;
            Howler.mute(this.isMuted);
            this.drawIcon();
        });

        this.drawIcon();
        this.drawRing(0);

        Ticker.shared.add(this.tick.bind(this));
    }

    private drawIcon() {
        this.icon.clear();
        
        // Speaker icon base
        this.icon.poly([-10, -5, -5, -5, 5, -15, 5, 15, -5, 5, -10, 5]);
        this.icon.fill(0xffffff);
        
        if (!this.isMuted) {
            // Sound waves
            this.icon.moveTo(10, -5);
            this.icon.bezierCurveTo(15, -5, 15, 5, 10, 5);
            this.icon.moveTo(15, -10);
            this.icon.bezierCurveTo(25, -10, 25, 10, 15, 10);
            this.icon.stroke({ width: 2, color: 0xffffff });
        } else {
            // X mark
            this.icon.moveTo(10, -5);
            this.icon.lineTo(20, 5);
            this.icon.moveTo(20, -5);
            this.icon.lineTo(10, 5);
            this.icon.stroke({ width: 2, color: 0xffffff });
        }
    }

    private tick(ticker: Ticker) {
        const oldMarker = Math.floor(this.elapsedMs / 8000);
        this.elapsedMs += ticker.deltaMS;
        const newMarker = Math.floor(this.elapsedMs / 8000);

        const cycleMs = this.elapsedMs % 16000;
        let progress = 0;
        if (cycleMs <= 8000) {
            // Filling
            progress = cycleMs / 8000;
        } else {
            // Unfilling
            progress = 1 - ((cycleMs - 8000) / 8000);
        }

        this.drawRing(progress);

        if (newMarker > oldMarker) {
            window.dispatchEvent(new Event('syncMarker'));
        }
    }

    private drawRing(progress: number) {
        this.ringBg.clear();
        this.ringBg.circle(0, 0, 30);
        this.ringBg.stroke({ width: 4, color: 0x555555 });
        this.ringBg.fill(0x333333);

        this.ringFill.clear();
        
        const cycleMs = this.elapsedMs % 16000;
        if (cycleMs <= 8000) {
            // Filling clockwise
            if (progress > 0) {
                this.ringFill.beginPath();
                this.ringFill.arc(0, 0, 30, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * progress), false);
                this.ringFill.stroke({ width: 4, color: 0xffffff });
            }
        } else {
            // Unfilling clockwise (tail catches up to head)
            // progress goes from 1 down to 0
            const clearProgress = 1 - progress; // goes from 0 to 1
            if (clearProgress < 1) {
                this.ringFill.beginPath();
                this.ringFill.arc(0, 0, 30, -Math.PI / 2 + (Math.PI * 2 * clearProgress), -Math.PI / 2 + (Math.PI * 2), false);
                this.ringFill.stroke({ width: 4, color: 0xffffff });
            }
        }
    }
}
