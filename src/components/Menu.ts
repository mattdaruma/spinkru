import { Container, Graphics, AlphaFilter, Rectangle, Ticker } from 'pixi.js';
import { MenuSlot } from './MenuSlot';
import { Character } from './Character';
import { Howl } from 'howler';
import { allCharacters } from '../characters';

export class Menu extends Container {
    private pagesContainer: Container;
    private currentPage: number = 0;
    private totalPages: number;
    private isAnimating: boolean = false;
    private leftArrow: Graphics;
    private rightArrow: Graphics;
    private slotControllers: { setFitMode: (fit: boolean) => void, getFitMode: () => boolean }[] = [];
    private isGlobalFitMode: boolean = false;

    constructor(characterSlots: Container[], dragLayer: Container) {
        super();
        
        const pendingItems: { char: Character, sound: Howl, spookySound: Howl | null }[] = [];
        
        window.addEventListener('syncMarker', () => {
            if (pendingItems.length > 0) {
                const isSpooky = (window as any)._theme === 'spooky_day' || (window as any)._theme === 'spooky_night';
                
                for (const item of pendingItems) {
                    if (!item.sound.playing()) {
                        item.sound.play();
                    }
                    item.sound.volume(isSpooky ? 0 : 1);
                    
                    if (item.spookySound) {
                        if (!item.spookySound.playing()) {
                            item.spookySound.play();
                        }
                        item.spookySound.volume(isSpooky ? 1 : 0);
                    }
                    
                    item.char.startAnimating();
                }
                pendingItems.length = 0;
            }
        });

        // Menu Background
        const bg = new Graphics();
        bg.rect(0, 0, 1920, 400);
        bg.fill(0x1a1a1a);
        this.addChild(bg);

        // Select All / Unselect All Button
        const toggleAllButton = new Graphics();
        toggleAllButton.roundRect(1860, 20, 40, 40, 8);
        toggleAllButton.fill(0x333333);
        toggleAllButton.eventMode = 'static';
        toggleAllButton.cursor = 'pointer';
        
        const toggleAllIcon = new Graphics();
        toggleAllIcon.rect(1870, 30, 20, 20);
        toggleAllIcon.stroke({ width: 2, color: 0xffffff });
        toggleAllButton.addChild(toggleAllIcon);

        this.addChild(toggleAllButton);

        toggleAllButton.on('pointerdown', () => {
            this.isGlobalFitMode = !this.isGlobalFitMode;
            toggleAllButton.clear();
            toggleAllButton.roundRect(1860, 20, 40, 40, 8);
            toggleAllButton.fill(this.isGlobalFitMode ? 0x666666 : 0x333333);
            
            for (const controller of this.slotControllers) {
                controller.setFitMode(this.isGlobalFitMode);
            }
        });

        // Mask for sliding
        const mask = new Graphics();
        mask.rect(0, 0, 1920, 400);
        mask.fill(0xffffff);
        this.addChild(mask);

        this.pagesContainer = new Container();
        this.pagesContainer.mask = mask;
        this.addChild(this.pagesContainer);

        const charsPerPage = 16;
        this.totalPages = Math.ceil(allCharacters.length / charsPerPage);

        const slotWidth = 160;
        const slotHeight = 160;
        const paddingX = 60;
        const paddingY = 20;
        
        const totalCols = 8;
        const totalRows = 2;
        const gridWidth = (totalCols * slotWidth) + ((totalCols - 1) * paddingX);
        const gridHeight = (totalRows * slotHeight) + ((totalRows - 1) * paddingY);
        
        const startX = (1920 - gridWidth) / 2;
        const startY = (400 - gridHeight) / 2;

        for (let page = 0; page < this.totalPages; page++) {
            const pageContainer = new Container();
            pageContainer.x = page * 1920;
            this.pagesContainer.addChild(pageContainer);

            for (let row = 0; row < totalRows; row++) {
                for (let col = 0; col < totalCols; col++) {
                    const x = startX + col * (slotWidth + paddingX);
                    const y = startY + row * (slotHeight + paddingY);
                    
                    const menuSlot = new MenuSlot(slotWidth, slotHeight);
                    menuSlot.x = x;
                    menuSlot.y = y;
                    pageContainer.addChild(menuSlot);

                    const charIndex = page * charsPerPage + row * totalCols + col;
                    const characterConfig = allCharacters[charIndex];

                    if (characterConfig) {
                        const char = new Character(characterConfig);
                        
                        const bounds = char.getLocalBounds();
                        // Scale the character to fill most of the slot horizontally (e.g. 140px out of 160px)
                        // but cap the scale so smaller characters don't get absurdly huge.
                        let defaultScale = 140 / bounds.width;
                        if (defaultScale > 0.55) defaultScale = 0.55;
                        
                        const defaultX = slotWidth / 2;
                        const defaultY = 4 - (bounds.y * defaultScale);

                        // Calculate fit scale: maintain aspect ratio, at least 1px padding (so max 158x158)
                        const fitScale = Math.min(158 / bounds.width, 158 / bounds.height);
                        const fitX = slotWidth / 2 - ((bounds.x + bounds.width / 2) * fitScale);
                        const fitY = slotHeight / 2 - ((bounds.y + bounds.height / 2) * fitScale);

                        char.scale.set(defaultScale); 
                        char.x = defaultX;
                        // Align top of character bounds with 4px below the top of the slot
                        char.y = defaultY;

                        const charMask = new Graphics();
                        charMask.roundRect(0, 0, slotWidth, slotHeight, 24);
                        charMask.fill(0xffffff);
                        
                        menuSlot.addChild(charMask);
                        char.mask = charMask;

                        menuSlot.addChild(char);

                        // Fit Mode Toggle Button for specific slot
                        let isFitMode = false;
                        const slotToggleButton = new Graphics();
                        slotToggleButton.roundRect(130, 10, 20, 20, 4);
                        slotToggleButton.fill(0x444444);
                        slotToggleButton.eventMode = 'static';
                        slotToggleButton.cursor = 'pointer';
                        
                        const slotToggleIcon = new Graphics();
                        slotToggleIcon.rect(134, 14, 12, 12);
                        slotToggleIcon.stroke({ width: 1.5, color: 0xffffff });
                        slotToggleButton.addChild(slotToggleIcon);

                        menuSlot.addChild(slotToggleButton);

                        const updateSlotFitMode = (forceState?: boolean) => {
                            isFitMode = forceState !== undefined ? forceState : !isFitMode;
                            slotToggleButton.clear();
                            slotToggleButton.roundRect(130, 10, 20, 20, 4);
                            slotToggleButton.fill(isFitMode ? 0x777777 : 0x444444);
                            
                            if (isFitMode) {
                                char.scale.set(fitScale);
                                char.x = fitX;
                                char.y = fitY;
                            } else {
                                char.scale.set(defaultScale);
                                char.x = defaultX;
                                char.y = defaultY;
                            }
                        };

                        slotToggleButton.on('pointerdown', (e) => {
                            e.stopPropagation();
                            updateSlotFitMode();
                        });

                        this.slotControllers.push({
                            setFitMode: updateSlotFitMode,
                            getFitMode: () => isFitMode
                        });

                        const sound = new Howl({
                            src: [characterConfig.soundPath],
                            loop: true,
                            volume: 0 // initially 0 until syncMarker
                        });
                        
                        const spookySound = characterConfig.spookySoundPath ? new Howl({
                            src: [characterConfig.spookySoundPath],
                            loop: true,
                            volume: 0 // initially 0 until syncMarker
                        }) : null;
                        
                        // Handle global theme change for this slot's placed character
                        window.addEventListener('themeChange', () => {
                            if (placedChar) {
                                const isSpooky = (window as any)._theme === 'spooky_day' || (window as any)._theme === 'spooky_night';
                                sound.volume(isSpooky ? 0 : 1);
                                if (spookySound) spookySound.volume(isSpooky ? 1 : 0);
                            }
                        });

                        // --- Drag and Drop Logic ---
                        let isDragging = false;
                        let dragProxy: Character | null = null;
                        let placedChar: Character | null = null;

                        char.eventMode = 'static';
                        char.cursor = 'pointer';

                        const onDragMove = (e: any) => {
                            if (isDragging && dragProxy) {
                                dragProxy.position.copyFrom(e.global);
                            }
                        };

                        const onDragUp = (e: any) => {
                            if (!isDragging || !dragProxy) return;
                            isDragging = false;

                            dragLayer.eventMode = 'none';
                            dragLayer.off('pointermove', onDragMove);
                            dragLayer.off('pointerup', onDragUp);
                            dragLayer.off('pointerupoutside', onDragUp);

                            let droppedSlot: Container | null = null;
                            for (const slot of characterSlots) {
                                const bounds = slot.getBounds();
                                if (bounds.containsPoint(e.global.x, e.global.y)) {
                                    droppedSlot = slot;
                                    break;
                                }
                            }

                            if (droppedSlot) {
                            // Render full size and place in slot
                            dragProxy.scale.set(1);
                            dragProxy.position.set(0, 0);
                            droppedSlot.addChild(dragProxy);
                            placedChar = dragProxy;

                            // Queue for sync instead of playing immediately
                            pendingItems.push({ char: placedChar, sound: sound, spookySound: spookySound });

                            char.eventMode = 'none'; // Lock the menu item
                            char.cursor = 'default';

                            // --- Removal Logic ---
                            placedChar.eventMode = 'static';
                            placedChar.cursor = 'pointer';

                            placedChar.on('pointerdown', () => {
                                if (sound.playing()) {
                                    sound.stop();
                                }
                                if (spookySound && spookySound.playing()) {
                                    spookySound.stop();
                                }
                                
                                const pendingIdx = pendingItems.findIndex(i => i.char === placedChar);
                                if (pendingIdx > -1) {
                                    pendingItems.splice(pendingIdx, 1);
                                }

                                placedChar?.stopAnimating();
                                placedChar?.destroy();
                                placedChar = null;

                                // Unlock menu item
                                char.eventMode = 'static';
                                char.cursor = 'pointer';
                                char.filters = [];
                            });
                            } else {
                                // Return to menu
                                dragProxy.destroy();
                                char.filters = [];
                            }
                            
                            dragProxy = null;
                        };

                        char.on('pointerdown', (e) => {
                            isDragging = true;
                            char.filters = [new AlphaFilter({ alpha: 0.3 })];

                            dragProxy = new Character(characterConfig);
                            dragProxy.scale.set(0.35);
                            dragProxy.eventMode = 'none';
                            dragProxy.position.copyFrom(e.global);
                            dragLayer.addChild(dragProxy);

                            dragLayer.eventMode = 'static';
                            dragLayer.hitArea = new Rectangle(-10000, -10000, 20000, 20000);
                            dragLayer.on('pointermove', onDragMove);
                            dragLayer.on('pointerup', onDragUp);
                            dragLayer.on('pointerupoutside', onDragUp);
                        });
                    }
                }
            }
        }

        // Navigation Arrows
        this.leftArrow = new Graphics();
        this.leftArrow.poly([40, 200, 80, 160, 80, 240]);
        this.leftArrow.fill(0xffffff);
        this.leftArrow.eventMode = 'static';
        this.leftArrow.cursor = 'pointer';
        this.leftArrow.on('pointerdown', () => this.slide(-1));
        this.addChild(this.leftArrow);

        this.rightArrow = new Graphics();
        this.rightArrow.poly([1880, 200, 1840, 160, 1840, 240]);
        this.rightArrow.fill(0xffffff);
        this.rightArrow.eventMode = 'static';
        this.rightArrow.cursor = 'pointer';
        this.rightArrow.on('pointerdown', () => this.slide(1));
        this.addChild(this.rightArrow);

        this.updateArrows();
    }

    private slide(direction: number) {
        if (this.isAnimating) return;
        
        const newPage = this.currentPage + direction;
        if (newPage < 0 || newPage >= this.totalPages) return;

        this.isAnimating = true;
        const startX = this.pagesContainer.x;
        const targetX = -newPage * 1920;
        const duration = 300;
        let elapsed = 0;

        const tick = (ticker: Ticker) => {
            elapsed += ticker.deltaMS;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out quad
            const ease = 1 - (1 - progress) * (1 - progress);
            this.pagesContainer.x = startX + (targetX - startX) * ease;

            if (progress >= 1) {
                Ticker.shared.remove(tick);
                this.isAnimating = false;
            }
        };

        Ticker.shared.add(tick);
        
        this.currentPage = newPage;
        this.updateArrows();
    }

    private updateArrows() {
        this.leftArrow.alpha = this.currentPage > 0 ? 1 : 0.2;
        this.leftArrow.eventMode = this.currentPage > 0 ? 'static' : 'none';

        this.rightArrow.alpha = this.currentPage < this.totalPages - 1 ? 1 : 0.2;
        this.rightArrow.eventMode = this.currentPage < this.totalPages - 1 ? 'static' : 'none';
    }
}