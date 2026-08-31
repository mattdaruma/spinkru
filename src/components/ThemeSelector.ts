import { Container, Graphics, Text, Application } from 'pixi.js';

export class ThemeSelector extends Container {
    private buttons: { g: Graphics; text: Text; theme: 'day' | 'night' | 'spooky_day' | 'spooky_night' | 'yang' | 'yin' }[] = [];
    private app: Application;

    constructor(app: Application, appWidth: number) {
        super();
        this.app = app;
        this.x = appWidth - 1000;
        this.y = 20;

        this.buildButtons();
        this.updateButtonStyles();
    }

    private buildButtons() {
        const themes: ('day' | 'night' | 'spooky_day' | 'spooky_night' | 'yang' | 'yin')[] = ['day', 'night', 'spooky_day', 'spooky_night', 'yang', 'yin'];

        themes.forEach((theme, index) => {
            const btn = new Container();
            btn.eventMode = 'static';
            btn.cursor = 'pointer';
            btn.x = index * 165;

            const g = new Graphics();
            btn.addChild(g);

            const words = theme.split('_');
            const label = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            
            const text = new Text({ text: label, style: { fill: 0xffffff, fontSize: 18 } });
            text.x = 75 - text.width / 2;
            text.y = 14;
            btn.addChild(text);

            this.buttons.push({ g, text, theme });

            btn.on('pointerdown', () => this.handleThemeClick(theme));
            this.addChild(btn);
        });
    }

    private handleThemeClick(theme: 'day' | 'night' | 'spooky_day' | 'spooky_night' | 'yang' | 'yin') {
        (window as any)._theme = theme;
        
        if (theme === 'day') this.app.renderer.background.color = 0x87ceeb;
        if (theme === 'night') this.app.renderer.background.color = 0x05051a;
        if (theme === 'spooky_day') this.app.renderer.background.color = 0x111111;
        if (theme === 'spooky_night') this.app.renderer.background.color = 0x000000;
        if (theme === 'yang') this.app.renderer.background.color = 0xdddddd; // Light grey sky
        if (theme === 'yin') this.app.renderer.background.color = 0x111111;  // Dark grey/black sky
        
        this.updateButtonStyles();
        window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme } }));
    }

    private updateButtonStyles() {
        const currentTheme = (window as any)._theme;
        this.buttons.forEach(btn => {
            btn.g.clear();
            btn.g.roundRect(0, 0, 150, 50, 10);
            if (btn.theme === currentTheme) {
                btn.g.stroke({ width: 3, color: 0xffffff });
            }
            btn.g.fill(0x333333);
        });
    }
}