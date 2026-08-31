import sound from './melody.wav';
import { CharacterConfig } from '../../types';
import { Graphics } from 'pixi.js';
import spookySound from './melody_spooky.wav';


export const starterCharacter: CharacterConfig = {
    id: 'starter',
    soundPath: sound,
    spookySoundPath: spookySound,
    draw: (g: Graphics, isSpooky: boolean = false) => {
        let bodyColor = isSpooky ? 0x162d51 : 0x4287f5;
        
        // --- Body ---
        g.poly([
            -30, -100, 
            30, -100, 
            50, 220, 
            -50, 220
        ]);
        g.fill(bodyColor);
        g.stroke({ width: 4, color: 0x000000 });

        // --- Head ---
        g.circle(0, -100, 100);
        g.fill(bodyColor);
        g.stroke({ width: 4, color: 0x000000 });

        // --- Eyes ---
        const eyeY = -120;
        const eyeRadius = 25;
        
        const eyeBgColor = isSpooky ? 0x000000 : 0xffffff;
        const pupilColor = isSpooky ? 0xffffff : 0x000000;
        
        // Left eye background
        g.circle(-40, eyeY, eyeRadius);
        g.fill(eyeBgColor);
        g.stroke({ width: 4, color: 0x000000 });
        
        // Right eye background
        g.circle(40, eyeY, eyeRadius);
        g.fill(eyeBgColor);
        g.stroke({ width: 4, color: 0x000000 });

        // --- Pupils ---
        // Left pupil
        g.circle(-40, eyeY, 10);
        g.fill(pupilColor);
        
        // Right pupil
        g.circle(40, eyeY, 10);
        g.fill(pupilColor);

        // --- Eyelids ---
        // Left eyelid
        g.beginPath();
        g.arc(-40, eyeY, eyeRadius, Math.PI, 0); // Top half arc
        g.closePath();
        g.fill(bodyColor); // Skin color
        g.stroke({ width: 4, color: 0x000000 });

        // Right eyelid
        g.beginPath();
        g.arc(40, eyeY, eyeRadius, Math.PI, 0);
        g.closePath();
        g.fill(bodyColor);
        g.stroke({ width: 4, color: 0x000000 });

        // --- Mouth ---
        g.moveTo(-20, -60);
        g.lineTo(20, -60);
        g.stroke({ width: 4, color: 0x000000 });
    }
};