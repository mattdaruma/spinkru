import sound from './char_8.wav';
import { CharacterConfig } from '../../types';
import { Graphics } from 'pixi.js';
import spookySound from './char_8_spooky.wav';


export const char_8: CharacterConfig = {
    id: 'char_8',
    soundPath: sound,
    spookySoundPath: spookySound,
    draw: (g: Graphics, isSpooky: boolean = false) => {
        let color = isSpooky ? 0x0b0b0b : 0x222222;

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
        
        
        // Sunglasses
        g.rect(-70, -140, 60, 40);
        g.fill(0x000000);
        g.rect(10, -140, 60, 40);
        g.fill(0x000000);
        g.moveTo(-10, -120);
        g.lineTo(10, -120);
        g.stroke({ width: 4, color: 0x000000 });
        

        // Mouth
        g.moveTo(-20, -60);
        g.lineTo(20, -60);
        g.stroke({ width: 4, color: 0x000000 });
    }
};
