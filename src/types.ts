import { Graphics } from 'pixi.js';

export interface CharacterConfig {
    id: string;
    soundPath: string;
    spookySoundPath?: string;
    draw: (g: Graphics, isSpooky: boolean) => void;
}