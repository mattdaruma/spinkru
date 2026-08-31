import sound from './grey_hat.wav';
import spookySound from './grey_hat_spooky.wav';
import { CharacterConfig } from '../../types';
import { Graphics } from 'pixi.js';

export const grey_hat: CharacterConfig = {
    id: 'grey_hat',
    soundPath: sound,
    spookySoundPath: spookySound,
    draw: (g: Graphics, isSpooky: boolean = false) => {
        // Base colors matching the trash can image
        const bodyColor = isSpooky ? 0x666666 : 0xa9acaf;
        const shadowColor = isSpooky ? 0x444444 : 0x878a8d;
        const glareColor = isSpooky ? 0xaaaaaa : 0xffffff;
        const pupilColor = isSpooky ? 0xff0000 : 0x000000;
        const eyeColor = isSpooky ? 0x000000 : 0xffffff;
        
        // --- 1. Body ---
        g.poly([
            -20, -100,
            20, -100,
            45, 170,
            -45, 170
        ]);
        g.fill(bodyColor);
        g.stroke({ width: 4, color: 0x000000, join: 'round' });

        // Small shadow on body under head
        g.beginPath();
        g.ellipse(0, -90, 25, 8);
        g.fill(shadowColor);

        // --- 2. Head ---
        g.circle(0, -100, 100);
        g.fill(bodyColor);
        g.stroke({ width: 4, color: 0x000000 });

        // Shadow on Face (covers top half, dipping down to -70)
        g.beginPath();
        g.arc(0, -100, 100, Math.PI, 0); // Top half of head
        g.bezierCurveTo(50, -70, -50, -70, -100, -100); // Convex curve dipping down
        g.closePath();
        g.fill(shadowColor);

        // --- 3. Eyes ---
        // Left Eye
        g.circle(-40, -95, 35);
        g.fill(eyeColor);
        g.stroke({ width: 4, color: 0x000000 });

        g.circle(-40, -95, 24);
        g.fill(pupilColor);

        // Top Crescent Eyelids
        const lidStart = Math.PI + 0.15; 
        const lidEnd = 2 * Math.PI - 0.15;   

        // Left Eyelid
        g.beginPath();
        g.arc(-40, -95, 35, lidStart, lidEnd); 
        g.quadraticCurveTo(-40, -125, -40 + 35 * Math.cos(lidStart), -95 + 35 * Math.sin(lidStart)); 
        g.closePath();
        g.fill(shadowColor);
        g.stroke({ width: 4, color: 0x000000, join: 'round' });

        // Right Eye
        g.circle(40, -95, 35);
        g.fill(eyeColor);
        g.stroke({ width: 4, color: 0x000000 });

        g.circle(40, -95, 24);
        g.fill(pupilColor);

        // Right Eyelid
        g.beginPath();
        g.arc(40, -95, 35, lidStart, lidEnd); 
        g.quadraticCurveTo(40, -125, 40 + 35 * Math.cos(lidStart), -95 + 35 * Math.sin(lidStart)); 
        g.closePath();
        g.fill(shadowColor);
        g.stroke({ width: 4, color: 0x000000, join: 'round' });

        // --- 4. Mouth ---
        // Horizontal line, slightly wider and lower
        g.beginPath();
        g.moveTo(-20, -35);
        g.lineTo(20, -35);
        g.stroke({ width: 4, color: 0x000000, cap: 'round' });

        // --- 5. Hat (Cymbal / Lid) ---
        // Hat Base
        g.beginPath();
        g.ellipse(0, -165, 145, 38);
        g.fill(bodyColor);

        // Full Glare
        g.beginPath();
        g.moveTo(-75, -133);   // Front left
        g.lineTo(15, -128);    // Front right (crosses center)
        g.lineTo(20, -202);    // Back right
        g.lineTo(10, -202);    // Back left
        g.closePath();
        g.fill(glareColor);

        // Hat Stroke
        g.beginPath();
        g.ellipse(0, -165, 145, 38);
        g.stroke({ width: 4, color: 0x000000 });

        // --- 6. Handle (Hair) ---
        g.beginPath();
        g.moveTo(-6, -165);
        g.lineTo(-4, -235);
        // Left prong
        g.quadraticCurveTo(-12, -235, -15, -230); 
        g.quadraticCurveTo(-10, -245, 0, -245);   
        // Right prong
        g.quadraticCurveTo(10, -245, 15, -230);   
        g.quadraticCurveTo(12, -235, 4, -235);    
        g.lineTo(6, -165);
        g.closePath();
        g.fill(bodyColor);
        g.stroke({ width: 4, color: 0x000000, join: 'round' });

        // Glare Patch over the LEFT side of the Handle
        // This ensures the glare crosses OVER the left side of the hair, 
        // but the hair covers the glare on the right side.
        g.beginPath();
        g.moveTo(-6, -165); // Handle left base
        g.lineTo(0, -165);  // Handle center base
        g.lineTo(0, -202);  // Up the center stem
        g.lineTo(-5, -202); // Left edge of stem
        g.closePath();
        g.fill(glareColor);
    }
};
