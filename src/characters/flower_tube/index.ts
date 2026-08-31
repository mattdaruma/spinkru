import sound from './flower_tube.wav';
import spookySound from './flower_tube_spooky.wav';
import { CharacterConfig } from '../../types';
import { Graphics } from 'pixi.js';

export const flower_tube: CharacterConfig = {
    id: 'flower_tube',
    soundPath: sound,
    spookySoundPath: spookySound,
    draw: (g: Graphics, isSpooky: boolean = false) => {
        // Green skin
        const bodyColor = isSpooky ? 0x224422 : 0x77dd77;
        
        // Shades of green for the hair
        const greens = isSpooky ? [0x002200, 0x003300, 0x114411, 0x001100] : [0x228b22, 0x006400, 0x32cd32, 0x008000];
        
        const drawHair = (x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, width: number, colorIdx: number) => {
            g.beginPath();
            g.moveTo(x1, y1);
            g.quadraticCurveTo(cx, cy, x2, y2);
            g.stroke({ width: width + 8, color: 0x000000, cap: 'round' });
            g.beginPath();
            g.moveTo(x1, y1);
            g.quadraticCurveTo(cx, cy, x2, y2);
            g.stroke({ width: width, color: greens[colorIdx], cap: 'round' });
        };

        // --- Back Hair (Behind Head) ---
        // Edges of the hair cascading down, hugging the 100px radius sphere
        drawHair(-50, -180, -115, -150, -110, -50, 26, 0);
        drawHair(50, -180, 115, -150, 110, -50, 26, 1);
        drawHair(-20, -195, -100, -180, -115, -80, 26, 2);
        drawHair(20, -195, 100, -180, 115, -80, 26, 3);

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

        // --- Front Hair (Covering Head) ---
        // Tightly packed tubes draping over the scalp
        // Left cascading tubes
        drawHair(-10, -195, -70, -190, -100, -80, 24, 0);
        drawHair(-25, -185, -85, -170, -105, -60, 24, 1);
        drawHair(-40, -170, -95, -140, -110, -40, 24, 2);
        drawHair(-15, -175, -50, -140, -60, -90, 20, 3);
        
        // Right cascading tubes
        drawHair(10, -195, 70, -190, 100, -80, 24, 2);
        drawHair(25, -185, 85, -170, 105, -60, 24, 3);
        drawHair(40, -170, 95, -140, 110, -40, 24, 0);
        drawHair(15, -175, 50, -140, 60, -90, 20, 1);

        // --- Flowers (Resting on top) ---
        const drawFlower = (cx: number, cy: number, radius: number) => {
            const petalRadius = radius * 0.6;
            const petalColor = isSpooky ? 0x660033 : 0xff99cc;
            const pollenColor = isSpooky ? 0x888800 : 0xffff00;
            
            for(let i=0; i<5; i++) {
                const angle = (Math.PI * 2 * i) / 5;
                const px = cx + Math.cos(angle) * radius * 0.7;
                const py = cy + Math.sin(angle) * radius * 0.7;
                
                g.circle(px, py, petalRadius);
                g.fill(petalColor);
                g.stroke({ width: 3, color: 0x000000 });
            }
            
            g.circle(cx, cy, radius * 0.5);
            g.fill(pollenColor);
            g.stroke({ width: 3, color: 0x000000 });
        };

        // 4 pink flowers sitting neatly on the crown of the head/hair
        drawFlower(-40, -185, 24); // Large, top left
        drawFlower(30, -190, 18);  // Medium, top right
        drawFlower(-5, -205, 16);  // Small, very top
        drawFlower(50, -165, 20);  // Medium-large, side right

        // --- Eyes (Half-lidded) ---
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

        // Pupils
        g.circle(-40, eyeY, 20);
        g.fill(pupilColor);
        
        g.circle(40, eyeY, 20);
        g.fill(pupilColor);

        // Eyelids (Half-lidded, skin colored)
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

        // --- Calm Smile ---
        g.beginPath();
        g.moveTo(-15, -40);
        g.quadraticCurveTo(0, -25, 15, -40);
        g.stroke({ width: 4, color: 0x000000, cap: 'round' });
    }
};
