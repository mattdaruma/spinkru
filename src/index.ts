import { Application, Container, Graphics, Text } from 'pixi.js';
import { Background } from './components/Background';
import { CharacterSlot } from './components/CharacterSlot';
import { Menu } from './components/Menu';
import { ThemeSelector } from './components/ThemeSelector';
import { AnimationToggle } from './components/AnimationToggle';
import { SyncButton } from './components/SyncButton';
import { RefreshButton } from './components/RefreshButton';

const appWidth = 1920;
const appHeight = 1080;
const menuHeight = 680;
const menuSlotHeight = 520;

(async () => {
    const app = new Application();
    
    await app.init({ 
        width: appWidth,
        height: appHeight, 
        backgroundColor: 0x87ceeb,
        antialias: true,
        resolution: window.devicePixelRatio || 1,
        autoDensity: true
    });
    
    document.body.appendChild(app.canvas);

    // Global state
    (window as any)._theme = 'day';
    (window as any)._animationsEnabled = true;

    // 1. Background
    app.stage.addChild(new Background());

    // Theme Toggle Button Row
    const themeSelector = new ThemeSelector(app, appWidth);
    app.stage.addChild(themeSelector);

    // Sync Button
    const syncButton = new SyncButton();
    syncButton.x = appWidth - 100;
    syncButton.y = 120;
    app.stage.addChild(syncButton);

    // Refresh Button
    const refreshButton = new RefreshButton();
    app.stage.addChild(refreshButton);

    // Animation Toggle Button
    const animationToggle = new AnimationToggle();
    app.stage.addChild(animationToggle);

    // 2. Landscape Character Slots
    const slotsContainer = new Container();
    const slotCount = 8;
    const spacing = appWidth / slotCount;
    
    for (let i = 0; i < slotCount; i++) {
        const slot = new CharacterSlot();
        slot.x = (spacing / 2) + (i * spacing);
        slot.y = menuSlotHeight;
        slotsContainer.addChild(slot);
    }
    
    app.stage.addChild(slotsContainer);

    // Create a drag layer that sits on top of EVERYTHING
    const dragLayer = new Container();

    // 3. Menu Pane
    // Pass the slots array and drag layer to the menu
    const menu = new Menu(slotsContainer.children, dragLayer);
    menu.y = menuHeight;
    app.stage.addChild(menu);

    // Add drag layer last so dragged items render over the menu
    app.stage.addChild(dragLayer);

})();
