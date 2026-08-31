import sound from './red_demon.wav';
import { CharacterConfig } from '../../types';
import { Graphics } from 'pixi.js';
import spookySound from './red_demon_spooky.wav';


export const red_demon: CharacterConfig = {
    id: 'red_demon',
    soundPath: sound,
    spookySoundPath: spookySound,
    draw: (g: Graphics, isSpooky: boolean = false) => {
        const bodyColor = isSpooky ? 0x880000 : 0xff0000; 
        const hornColor = isSpooky ? 0x550000 : 0xcc0000;
        
        // --- Side Horns (Behind head) ---
        // Far left horn (Reverted to previous taller height)
        g.poly([-90, -130, -65, -165, -130, -190]);
        g.fill(hornColor);
        g.stroke({ width: 4, color: 0x000000, join: 'round' });

        // Far right horn (Reverted to previous taller height)
        g.poly([90, -130, 65, -165, 130, -190]);
        g.fill(hornColor);
        g.stroke({ width: 4, color: 0x000000, join: 'round' });

        // --- Body ---
        g.poly([
            -20, -100, 
            20, -100, 
            55, 170, 
            -55, 170
        ]);
        g.fill(bodyColor);
        g.stroke({ width: 4, color: 0x000000, join: 'round' });

        // --- Head ---
        g.circle(0, -100, 100);
        g.fill(bodyColor);
        g.stroke({ width: 4, color: 0x000000 });

        // --- Front Horns (Middle 3) ---
        // Left middle horn
        g.beginPath();
        g.moveTo(-52, -172);
        g.quadraticCurveTo(-40, -165, -28, -178);
        g.lineTo(-55, -210); // Shorter by 3px, slanted outward
        g.closePath();
        g.fill(hornColor);
        g.stroke({ width: 4, color: 0x000000, join: 'round' });

        // Center horn (Base moved up 3px, tip shortened 3px -> tip Y stays at -225)
        g.beginPath();
        g.moveTo(-15, -185);
        g.quadraticCurveTo(0, -177, 15, -185);
        g.lineTo(0, -225);
        g.closePath();
        g.fill(hornColor);
        g.stroke({ width: 4, color: 0x000000, join: 'round' });

        // Right middle horn
        g.beginPath();
        g.moveTo(28, -178);
        g.quadraticCurveTo(40, -165, 52, -172);
        g.lineTo(55, -210); // Shorter by 3px, slanted outward
        g.closePath();
        g.fill(hornColor);
        g.stroke({ width: 4, color: 0x000000, join: 'round' });

        // --- Eyes ---
        const eyeY = -100;
        const eyeRadius = 35;
        const eyeBgColor = isSpooky ? 0x000000 : 0xffffff;
        const pupilColor = isSpooky ? 0xff0000 : 0x000000;
        
        // Left eye background
        g.circle(-40, eyeY, eyeRadius);
        g.fill(eyeBgColor);
        g.stroke({ width: 4, color: 0x000000 });
        
        // Right eye background
        g.circle(40, eyeY, eyeRadius);
        g.fill(eyeBgColor);
        g.stroke({ width: 4, color: 0x000000 });

        // --- Pupils ---
        g.circle(-40, eyeY, 24);
        g.fill(pupilColor);
        
        g.circle(40, eyeY, 24);
        g.fill(pupilColor);

        // --- Eyelids (Half-lidded) ---
        g.beginPath();
        g.arc(-40, eyeY, eyeRadius, Math.PI, 0);
        g.closePath();
        g.fill(bodyColor);
        g.stroke({ width: 4, color: 0x000000 });

        g.beginPath();
        g.arc(40, eyeY, eyeRadius, Math.PI, 0);
        g.closePath();
        g.fill(bodyColor);
        g.stroke({ width: 4, color: 0x000000 });

        // --- Eyebrows (Angry, narrower, less steep, more curved) ---
        g.beginPath();
        g.moveTo(-60, -150);
        g.quadraticCurveTo(-40, -160, -15, -140);
        g.stroke({ width: 4, color: 0x000000, cap: 'round' });

        g.beginPath();
        g.moveTo(60, -150);
        g.quadraticCurveTo(40, -160, 15, -140);
        g.stroke({ width: 4, color: 0x000000, cap: 'round' });

        // --- Mouth (Straight line, slightly lower) ---
        g.beginPath();
        g.moveTo(-15, -33);
        g.lineTo(15, -33);
        g.stroke({ width: 4, color: 0x000000, cap: 'round' });
    }
};
