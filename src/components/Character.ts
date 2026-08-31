import { Container, Graphics, Ticker } from 'pixi.js';
import { CharacterConfig } from '../types';

export class Character extends Container {
    public config: CharacterConfig;
    private g: Graphics;
    private onThemeChange: (e: any) => void;
    private onAnimationsChange: (e: any) => void;
    private animTicker: ((ticker: Ticker) => void) | null = null;
    private animTime: number = 0;
    private isAnimationActive: boolean = false;

    constructor(config: CharacterConfig) {
        super();
        this.config = config;
        
        this.g = new Graphics();
        this.addChild(this.g);
        
        const currentTheme = (window as any)._theme || 'day';
        this.config.draw(this.g, this.isThemeSpooky(currentTheme));

        this.onThemeChange = (e: any) => {
            this.g.clear();
            this.config.draw(this.g, this.isThemeSpooky(e.detail.theme));
        };
        
        this.onAnimationsChange = (e: any) => {
            if (this.isAnimationActive) {
                if (e.detail.enabled) {
                    if (!this.animTicker) this.startAnimating(true);
                } else {
                    if (this.animTicker) this.stopAnimating(true);
                }
            }
        };
        
        window.addEventListener('themeChange', this.onThemeChange);
        window.addEventListener('animationsChange', this.onAnimationsChange);
        
        this.on('destroyed', () => {
            window.removeEventListener('themeChange', this.onThemeChange);
            window.removeEventListener('animationsChange', this.onAnimationsChange);
            this.stopAnimating();
        });
    }

    private isThemeSpooky(theme: string): boolean {
        return theme === 'spooky_day' || theme === 'spooky_night';
    }

    public startAnimating(resume: boolean = false) {
        if (!resume) this.isAnimationActive = true;
        
        if (this.animTicker) return;
        
        if ((window as any)._animationsEnabled === false) return;

        let hash = 0;
        for (let i = 0; i < this.config.id.length; i++) {
            hash = this.config.id.charCodeAt(i) + ((hash << 5) - hash);
        }
        const animType = Math.abs(hash) % 4;
        const speed = 0.005 + ((Math.abs(hash) % 10) / 2000); // 0.005 - 0.0095

        this.animTicker = (ticker: Ticker) => {
            this.animTime += ticker.deltaMS * speed;
            
            if (animType === 0) {
                // Subtle bouncing
                this.g.scale.y = 1 + Math.sin(this.animTime) * 0.03;
                this.g.scale.x = 1 - Math.sin(this.animTime) * 0.01;
            } else if (animType === 1) {
                // Subtle tilting
                this.g.rotation = Math.sin(this.animTime) * 0.05;
            } else if (animType === 2) {
                // Subtle nodding
                this.g.y = Math.sin(this.animTime * 1.5) * 4;
            } else if (animType === 3) {
                // Breathing
                this.g.scale.x = 1 + Math.sin(this.animTime) * 0.02;
                this.g.scale.y = 1 + Math.sin(this.animTime) * 0.02;
            }
        };
        Ticker.shared.add(this.animTicker);
    }
    
    public stopAnimating(pause: boolean = false) {
        if (!pause) this.isAnimationActive = false;
        
        if (this.animTicker) {
            Ticker.shared.remove(this.animTicker);
            this.animTicker = null;
            // Reset transforms
            this.g.scale.set(1);
            this.g.rotation = 0;
            this.g.y = 0;
        }
    }
}
