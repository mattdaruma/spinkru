import { Application } from 'pixi.js';
import { allCharacters } from './characters/index';
import { Character } from './components/Character';

(async () => {
    const app = new Application();
    await app.init({ 
        width: 400, 
        height: 500, 
        backgroundAlpha: 0, 
        antialias: true 
    });
    
    document.getElementById('pixi-app')!.appendChild(app.canvas);

    let currentCharacter: Character | null = null;
    let isSpooky = false;

    const charSelect = document.getElementById('char-select') as HTMLSelectElement;
    const spookyToggle = document.getElementById('spooky-toggle') as HTMLInputElement;
    const animToggle = document.getElementById('anim-toggle') as HTMLInputElement;
    const refUpload = document.getElementById('ref-upload') as HTMLInputElement;
    const refOpacity = document.getElementById('ref-opacity') as HTMLInputElement;
    const refOverlay = document.getElementById('reference-overlay') as HTMLImageElement;
    const downloadBtn = document.getElementById('download-btn') as HTMLButtonElement;

    // Populate select dropdown
    allCharacters.forEach(c => {
        // Skip starter character if you want, or just include it.
        const option = document.createElement('option');
        option.value = c.id;
        option.textContent = c.id;
        charSelect.appendChild(option);
    });

    // Mock global state required by the Character component
    (window as any)._theme = 'day';
    (window as any)._animationsEnabled = false;

    function renderCharacter() {
        if (currentCharacter) {
            app.stage.removeChild(currentCharacter);
            currentCharacter.destroy();
        }

        const config = allCharacters.find(c => c.id === charSelect.value);
        if (!config) return;

        (window as any)._theme = isSpooky ? 'spooky_day' : 'day';
        
        currentCharacter = new Character(config);
        
        // Center the character visually in the 400x500 canvas.
        // Assuming base structure: head at -100 (R=100) -> top is -200. Body bottom is 170.
        // Total height ~370. Center Y is (-200 + 170) / 2 = -15.
        // If we want the center of the character (-15) to be at the center of the canvas (250),
        // we set currentCharacter.y = 250 - (-15) = 265. Let's use 260.
        currentCharacter.x = 200;
        currentCharacter.y = 260; 
        
        app.stage.addChild(currentCharacter);

        if ((window as any)._animationsEnabled) {
            currentCharacter.startAnimating();
        }
    }

    charSelect.addEventListener('change', renderCharacter);
    
    spookyToggle.addEventListener('change', (e) => {
        isSpooky = (e.target as HTMLInputElement).checked;
        const themeEvent = new CustomEvent('themeChange', { detail: { theme: isSpooky ? 'spooky_day' : 'day' } });
        window.dispatchEvent(themeEvent);
    });

    animToggle.addEventListener('change', (e) => {
        (window as any)._animationsEnabled = (e.target as HTMLInputElement).checked;
        const animEvent = new CustomEvent('animationsChange', { detail: { enabled: (window as any)._animationsEnabled } });
        window.dispatchEvent(animEvent);
    });

    refUpload.addEventListener('change', (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            refOverlay.src = url;
            refOverlay.style.display = 'block';
        } else {
            refOverlay.style.display = 'none';
        }
    });

    refOpacity.addEventListener('input', (e) => {
        refOverlay.style.opacity = (e.target as HTMLInputElement).value;
    });

    downloadBtn.addEventListener('click', async () => {
        if (!currentCharacter) return;
        
        // Temporarily center it perfectly for the snapshot if needed, 
        // or just snap the canvas. Snapping the canvas is easier.
        try {
            const base64 = await app.renderer.extract.base64(app.stage);
            const a = document.createElement('a');
            a.href = base64;
            a.download = `${charSelect.value}${isSpooky ? '_spooky' : ''}.png`;
            a.click();
        } catch (err) {
            console.error("Failed to extract image", err);
            alert("Could not download image. Check console for details.");
        }
    });

    // Ensure we render the initially selected character
    renderCharacter();
})();
