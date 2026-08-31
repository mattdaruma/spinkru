import { Container, Graphics, AlphaFilter } from 'pixi.js';

export class CharacterSlot extends Container {
    constructor() {
        super();
        
        // --- Architecture Note ---
        // The shadow is isolated in its own Container with an AlphaFilter.
        // This ensures the overlapping shapes (head and body) are rendered as a 
        // single solid black silhouette BEFORE the transparency is applied. 
        // This prevents the body trapezoid from being visible through the head circle.
        // Any dropped characters are added as siblings to this shadowLayer (i.e. to 
        // CharacterSlot itself), so they are not affected by this AlphaFilter and remain 100% opaque.
        
        const shadowLayer = new Container();
        const g = new Graphics();
        
        // Body
        g.poly([
            -30, -100, 
            30, -100, 
            50, 220, 
            -50, 220
        ]);
        
        // Head
        g.circle(0, -100, 100);
        
        g.fill(0x000000);
        
        shadowLayer.addChild(g);
        shadowLayer.filters = [new AlphaFilter({ alpha: 0.4 })];
        
        this.addChild(shadowLayer);
    }
}
