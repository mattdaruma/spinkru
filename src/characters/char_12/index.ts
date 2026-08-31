import sound from './char_12.wav';
import { CharacterConfig } from '../../types';
import { Graphics } from 'pixi.js';
import spookySound from './char_12_spooky.wav';


export const char_12: CharacterConfig = {
    id: 'char_12',
    soundPath: sound,
    spookySoundPath: spookySound,
    draw: (g: Graphics, isSpooky: boolean = false) => {
        let color = isSpooky ? 0x555555 : 0xffffff;

        // Body
        g.poly([
            -30, -100, 
            30, -100, 
            50, 220, 
            -50, 220
        ]);
        g.fill(color);
        g.stroke({ width: 4, color: 0x000000 });

        // Head
        g.circle(0, -100, 100);
        g.fill(color);
        g.stroke({ width: 4, color: 0x000000 });

        
        // Left eye
        g.circle(-40, -120, 25);
        g.fill(isSpooky ? 0x000000 : 0xffffff);
        g.stroke({ width: 4, color: 0x000000 });
        g.circle(-40, -120, 10);
        g.fill(isSpooky ? 0xffffff : 0x000000);
        
        // Right eye
        g.circle(40, -120, 25);
        g.fill(isSpooky ? 0x000000 : 0xffffff);
        g.stroke({ width: 4, color: 0x000000 });
        g.circle(40, -120, 10);
        g.fill(isSpooky ? 0xffffff : 0x000000);
        
        
        // Top hat
        g.rect(-60, -180, 120, 20);
        g.fill(0x000000);
        g.rect(-40, -260, 80, 80);
        g.fill(0x000000);
        

        // Mouth
        g.moveTo(-20, -60);
        g.lineTo(20, -60);
        g.stroke({ width: 4, color: 0x000000 });
    }
};
