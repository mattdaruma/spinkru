import sound from './orange_dj.wav';
import { CharacterConfig } from '../../types';
import { Graphics } from 'pixi.js';
import spookySound from './orange_dj_spooky.wav';


export const orange_dj: CharacterConfig = {
    id: 'orange_dj',
    soundPath: sound,
    spookySoundPath: spookySound, // Unique syncopated beat
    draw: (g: Graphics, isSpooky: boolean = false) => {
        const bodyColor = isSpooky ? 0x8b4500 : 0xff8c00; 
        const lightOrange = isSpooky ? 0xb36b00 : 0xffcc77; // Lighter orange
        
        // --- Antennae ---
        // Left stem (thicker, longer, more outward)
        g.poly([-30, -175, -48, -187, -88, -237, -70, -225]);
        g.fill(lightOrange);
        g.stroke({ width: 4, color: 0x000000, join: 'round' });
        // Left circle (larger)
        g.circle(-80, -240, 25);
        g.fill(bodyColor);
        g.stroke({ width: 4, color: 0x000000 });

        // Right stem (thicker, longer, more outward)
        g.poly([30, -175, 48, -187, 88, -237, 70, -225]);
        g.fill(lightOrange);
        g.stroke({ width: 4, color: 0x000000, join: 'round' });
        // Right circle (larger)
        g.circle(80, -240, 25);
        g.fill(bodyColor);
        g.stroke({ width: 4, color: 0x000000 });

        // --- Body ---
        // Shorter body
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

        // --- Hair (Inside head, starting near top, pointing down and right) ---
        g.beginPath();
        g.moveTo(-15, -196); // Start near top edge
        g.lineTo(10, -150);  // wide slanted down-right
        g.lineTo(15, -188);  // back up towards edge
        g.lineTo(30, -165);  // narrow slanted down-right
        g.lineTo(35, -178);  // back up towards edge
        g.stroke({ width: 4, color: 0x000000, join: 'round', cap: 'round' });

        // --- Eyes (Center of head, larger) ---
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

        // --- Pupils (Twice as big) ---
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

        // --- Eyebrows (Highest on inside, slope down to outside, noticeably curved) ---
        g.beginPath();
        g.moveTo(-60, -145); // outside lower
        g.quadraticCurveTo(-40, -175, -20, -160); // inside higher, control point raised for curve
        g.stroke({ width: 4, color: 0x000000, cap: 'round' });

        g.beginPath();
        g.moveTo(20, -160); // inside higher
        g.quadraticCurveTo(40, -175, 60, -145); // outside lower, control point raised for curve
        g.stroke({ width: 4, color: 0x000000, cap: 'round' });

        // --- Mouth (Gentler curve / larger circle arc) ---
        g.beginPath();
        g.moveTo(-20, -45);
        g.quadraticCurveTo(0, -30, 20, -45);
        g.stroke({ width: 4, color: 0x000000, cap: 'round' });

        // --- DJ Headphones ---
        // Headband
        g.beginPath();
        g.arc(0, -100, 130, Math.PI, 0);
        g.stroke({ width: 16, color: lightOrange });
        
        // Headband outline
        g.beginPath();
        g.arc(0, -100, 138, Math.PI, 0);
        g.stroke({ width: 2, color: 0x000000 });
        g.beginPath();
        g.arc(0, -100, 122, Math.PI, 0);
        g.stroke({ width: 2, color: 0x000000 });

        // Left Cushion (Inner earpiece)
        g.roundRect(-110, -135, 10, 70, 5);
        g.fill(lightOrange);
        g.stroke({ width: 4, color: 0x000000 });

        // Left Earcup (Outer shell, semicircle)
        g.beginPath();
        g.arc(-110, -100, 35, Math.PI / 2, 3 * Math.PI / 2, false);
        g.closePath();
        g.fill(bodyColor);
        g.stroke({ width: 4, color: 0x000000, join: 'round' });
        
        // Right Cushion (Inner earpiece)
        g.roundRect(100, -135, 10, 70, 5);
        g.fill(lightOrange);
        g.stroke({ width: 4, color: 0x000000 });

        // Right Earcup (Outer shell, semicircle)
        g.beginPath();
        g.arc(110, -100, 35, -Math.PI / 2, Math.PI / 2, false);
        g.closePath();
        g.fill(bodyColor);
        g.stroke({ width: 4, color: 0x000000, join: 'round' });
    }
};
