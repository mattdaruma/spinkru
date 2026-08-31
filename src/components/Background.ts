import { Container, Graphics, Ticker } from 'pixi.js';

export class Background extends Container {
    private clouds: Graphics;
    private hills: Graphics;
    private stars: Graphics;

    private currentTheme: string = 'day';
    private cloudOffset: number = 0;
    
    // Generate persistent star data with unique phase offsets for twinkling
    private starData = Array.from({ length: 150 }).map(() => ({
        x: Math.random() * 1920,
        y: Math.random() * 600,
        r: Math.random() * 2 + 1,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.03 + 0.01
    }));

    private tickFn = (ticker: Ticker) => this.tick(ticker);

    constructor() {
        super();
        this.clouds = new Graphics();
        this.hills = new Graphics();
        this.stars = new Graphics();
        
        this.addChild(this.stars);
        this.addChild(this.clouds);
        this.addChild(this.hills);
        
        this.build('day');

        window.addEventListener('themeChange', (e: any) => {
            this.build(e.detail.theme);
        });

        Ticker.shared.add(this.tickFn);

        this.on('destroyed', () => {
            Ticker.shared.remove(this.tickFn);
        });
    }

    private build(theme: 'day' | 'night' | 'spooky_day' | 'spooky_night' | 'yang' | 'yin') {
        this.currentTheme = theme;
        this.hills.clear();
        this.drawHills(theme);
    }

    private tick(ticker: Ticker) {
        const isNight = this.currentTheme === 'night' || this.currentTheme === 'spooky_night' || this.currentTheme === 'yin';
        const isSpooky = this.currentTheme === 'spooky_day' || this.currentTheme === 'spooky_night';
        const isGreyscale = this.currentTheme === 'yang' || this.currentTheme === 'yin';

        if (isNight) {
            this.clouds.clear();
            this.updateAndDrawStars(ticker.deltaTime, isSpooky, isGreyscale);
        } else {
            this.stars.clear();
            this.updateAndDrawClouds(ticker.deltaTime, isSpooky, isGreyscale);
        }
    }

    private updateAndDrawStars(delta: number, isSpooky: boolean, isGreyscale: boolean) {
        this.stars.clear();
        let starColor = isSpooky ? 0xffff00 : 0xffffff;
        if (isGreyscale) starColor = 0xdddddd;

        for (const star of this.starData) {
            star.phase += star.speed * delta;
            // Oscillate alpha between ~0.1 and ~1.0
            const alpha = Math.max(0.1, 0.4 + Math.sin(star.phase) * 0.6);
            
            this.stars.circle(star.x, star.y, star.r).fill({ color: starColor, alpha });
        }
    }

    private updateAndDrawClouds(delta: number, isSpooky: boolean, isGreyscale: boolean) {
        this.clouds.clear();
        let cloudColor = isSpooky ? 0xaa0000 : 0xffffff;
        if (isGreyscale) cloudColor = 0xffffff;

        this.cloudOffset += 0.3 * delta;
        // Seamlessly wrap the clouds back to the start
        if (this.cloudOffset > 1920) {
            this.cloudOffset -= 1920;
        }

        const drawCloudSet = (offsetX: number) => {
            this.clouds.circle(300 + offsetX, 240, 80);
            this.clouds.circle(380 + offsetX, 200, 100);
            this.clouds.circle(460 + offsetX, 220, 80);
            this.clouds.circle(540 + offsetX, 250, 60);
            
            this.clouds.circle(900 + offsetX, 180, 70);
            this.clouds.circle(980 + offsetX, 150, 90);
            this.clouds.circle(1060 + offsetX, 180, 60);

            this.clouds.circle(1400 + offsetX, 280, 70);
            this.clouds.circle(1480 + offsetX, 250, 90);
            this.clouds.circle(1560 + offsetX, 280, 60);
        };

        // Draw the primary set and a trailing set for a seamless loop
        drawCloudSet(this.cloudOffset);
        drawCloudSet(this.cloudOffset - 1920);

        this.clouds.fill({ color: cloudColor, alpha: 0.8 });
    }

    private drawHills(theme: string) {
        this.hills.ellipse(300, 750, 900, 300);
        this.hills.ellipse(1600, 750, 1100, 400);
        this.hills.ellipse(960, 750, 1200, 300);
        
        let hillColor = 0x3eb43e; // Day
        if (theme === 'night') hillColor = 0x1f5c1f; // Dark green
        if (theme === 'spooky_day') hillColor = 0x550000; // Dark red
        if (theme === 'spooky_night') hillColor = 0x0a1f0a; // Even darker green
        if (theme === 'yang') hillColor = 0x888888; // Grey
        if (theme === 'yin') hillColor = 0x333333; // Dark grey
        
        this.hills.fill(hillColor);
    }
}
