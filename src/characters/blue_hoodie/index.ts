import sound from './blue_hoodie.wav';
import { CharacterConfig } from '../../types';
import { Graphics } from 'pixi.js';
import spookySound from './blue_hoodie_spooky.wav';


export const blue_hoodie: CharacterConfig = {
    id: 'blue_hoodie',
    soundPath: sound,
    spookySoundPath: spookySound,
    draw: (g: Graphics, isSpooky: boolean = false) => {
        const bodyColor = isSpooky ? 0x000088 : 0x0000ff;
        const hoodColor = isSpooky ? 0x000044 : 0x00008b;
        const shadowColor = isSpooky ? 0x000033 : 0x0000cc;

        // --- Body ---
        g.poly([
            -20, -100, 
            20, -100, 
            55, 170, 
            -55, 170
        ]);
        g.fill(bodyColor);
        g.stroke({ width: 4, color: 0x000000, join: 'round' });

        // --- Body Hoodie Drape ---
        g.poly([
            -20, -100,
            20, -100,
            43.3, 80,
            0, 55, // Triangular inlet
            -43.3, 80
        ]);
        g.fill(hoodColor);
        g.stroke({ width: 4, color: 0x000000, join: 'round' });

        // --- Hood (Around head) ---
        g.circle(0, -100, 125);
        g.fill(hoodColor);
        g.stroke({ width: 4, color: 0x000000 });

        // --- Black Ring (Between head and hoodie) ---
        g.circle(0, -100, 112);
        g.fill(0x000000);

        // --- Head ---
        g.circle(0, -100, 100);
        g.fill(bodyColor);

        // --- Face Shadow (Top of head, stopping just below eyes) ---
        const shadowAngle = 0.38;
        g.beginPath();
        g.arc(0, -100, 100, Math.PI - shadowAngle, 2 * Math.PI + shadowAngle);
        g.quadraticCurveTo(0, -60, -100 * Math.cos(shadowAngle), -100 + 100 * Math.sin(shadowAngle));
        g.closePath();
        g.fill(shadowColor);

        // --- Head Stroke ---
        g.circle(0, -100, 100);
        g.stroke({ width: 4, color: 0x000000 });

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

        // --- Eyebrows (Small, thin, slightly curved) ---
        g.beginPath();
        g.moveTo(-55, -145);
        g.quadraticCurveTo(-40, -150, -25, -145);
        g.stroke({ width: 2, color: 0x000000, cap: 'round' });

        g.beginPath();
        g.moveTo(55, -145);
        g.quadraticCurveTo(40, -150, 25, -145);
        g.stroke({ width: 2, color: 0x000000, cap: 'round' });

        // --- Mouth (Straight line, low) ---
        g.beginPath();
        g.moveTo(-20, -45);
        g.lineTo(20, -45);
        g.stroke({ width: 4, color: 0x000000, cap: 'round' });
    }
};
