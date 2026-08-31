import sound from './char_19.wav';
import { CharacterConfig } from '../../types';
import { Graphics } from 'pixi.js';
import spookySound from './char_19_spooky.wav';


export const char_19: CharacterConfig = {
    id: 'char_19',
    soundPath: sound,
    spookySoundPath: spookySound,
    draw: (g: Graphics, isSpooky: boolean = false) => {
        let color = isSpooky ? 0x440000 : 0xcc0000;

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
        
        
        // Horns
        g.poly([-60, -180, -40, -180, -80, -250]);
        g.fill(isSpooky ? 0x666666 : 0xffffff);
        g.stroke({ width: 4, color: 0x000000 });
        g.poly([60, -180, 40, -180, 80, -250]);
        g.fill(isSpooky ? 0x666666 : 0xffffff);
        g.stroke({ width: 4, color: 0x000000 });
        

        // Mouth
        g.moveTo(-20, -60);
        g.lineTo(20, -60);
        g.stroke({ width: 4, color: 0x000000 });
    }
};
