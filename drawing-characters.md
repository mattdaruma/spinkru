# Pixi.js Character Drawing Guide (One-Shot Blueprint)

This guide documents the exact strategies, proportions, and coding patterns required to faithfully replicate character reference images using PixiJS primitive graphics.

## 1. The Core Baseline Template

Every character is built on a standard coordinate framework. **DO NOT** deviate from these core bounding boxes unless the reference image explicitly demands a different body shape.

- **Origin `(0,0)`:** Represents the upper chest / neck area.
- **Head:** A perfect circle centered at `(0, -100)` with a radius of `100`.
  ```typescript
  g.circle(0, -100, 100);
  ```
- **Body:** A trapezoid hanging down from the neck. Top width matches the neck `±20` at `y: -100`. Bottom width `±55` at `y: 170`.
  ```typescript
  g.poly([-20, -100, 20, -100, 55, 170, -55, 170]);
  ```
- **Eyes:** Positioned at the horizontal center of the head `y: -100`. X offsets are `±40`. Radius is typically `35` for large, expressive eyes. The background of the eye is usually white or off-white.
  ```typescript
  g.circle(-40, -100, 35); // Left
  g.circle(40, -100, 35);  // Right
  ```
- **Pupils:** Drawn inside the eyes. Default radius is `24` for standard wide pupils, supporting the iconic Sprunki look. They sit centered within the eye or slightly offset to direct the gaze.
  ```typescript
  g.circle(-40, -100, 24); // Left Pupil
  g.circle(40, -100, 24);  // Right Pupil
  ```
- **Eyelids (Half-Lidded):** The default expression uses half-lids to give a relaxed vibe. Drawn by filling an arc over the top half of the eye with the base body/head color. The arc radius must exactly match the eye radius (`35`).
  ```typescript
  // Left Eyelid
  g.beginPath();
  g.arc(-40, -100, 35, Math.PI, 0); // Math.PI to 0 covers the top half
  g.closePath();
  g.fill(bodyColor); // Fills with the character's base color
  ```
- **Eyebrows:** Floating above the eyes (around `y: -145`). Drawn with thick strokes (e.g., `width: 6`) and `cap: 'round'`. Always use `quadraticCurveTo` to give them an arch; never use stiff straight lines.
  ```typescript
  // Left Eyebrow (Relaxed/Slightly arched)
  g.beginPath();
  g.moveTo(-60, -145);
  g.quadraticCurveTo(-40, -155, -20, -140);
  g.stroke({ width: 6, color: 0x000000, cap: 'round' });
  ```
- **Mouth:** Usually placed low on the face, between `y: -45` and `y: -30`. Just like eyebrows, avoid straight lines. Use `quadraticCurveTo` for expressive smiles or frowns, pushing the control point significantly off-axis to guarantee a distinct arc.
  ```typescript
  // Gentle curved smile
  g.beginPath();
  g.moveTo(-20, -45);
  g.quadraticCurveTo(0, -30, 20, -45); // Control point at y: -30 creates the dip down
  g.stroke({ width: 4, color: 0x000000, cap: 'round' });
  ```

## 2. Drawing Techniques for Accuracy

To achieve a 1:1 likeness with the generated image, you must pay attention to layering, visual weight, and specific Pixi paths.

### A. Perfect Outlines on Complex/Overlapping Shapes
When drawing things like messy hair (Flower Tube) or overlapping appendages, simply setting a stroke and filling them will cause internal lines to appear where shapes intersect.
**The Solution:** Draw the shapes twice.
1. Draw the path with a thick **black** stroke (e.g., `width: 32`).
2. Draw the exact same path with a thinner **color** stroke (e.g., `width: 24`).
This creates a seamless, unified outline around the entire compound shape.

### B. Seamless Attachments to the Head
Horns, ears, or hats resting *on* the head must flawlessly trace the contour of the `R=100` head circle.
- Use `g.quadraticCurveTo` at the base of your appendage.
- Example (Red Demon Front Horn):
  ```typescript
  g.beginPath();
  g.moveTo(-15, -185); // Start on the left base
  g.quadraticCurveTo(0, -177, 15, -185); // Curve slightly down to hug the spherical head
  g.lineTo(0, -225); // Tip of the horn
  g.closePath();
  ```

### C. Layering Order (Z-Index)
Draw order defines Z-index in Pixi. Always draw in this order:
1. **Behind the Body/Head:** Back hair strands, background wings, far horns.
2. **Body:** The main trapezoid.
3. **Head:** The main circle.
4. **On-Face Elements:** Shadows, Eyes, Pupils, Eyelids, Eyebrows, Mouth.
5. **Foreground Elements:** Front hair draping over the face, accessories (headphones), foreground arms.

### D. Expressive Facial Lines (Eyebrows & Mouths)
Do not use straight lines (`lineTo`) for eyebrows or smiles, as they look stiff.
Always push the control point of `g.quadraticCurveTo` significantly off-axis to create a noticeable arc.
```typescript
// Gentle curved smile
g.beginPath();
g.moveTo(-20, -45);
g.quadraticCurveTo(0, -30, 20, -45); // Control point at y: -30 creates the dip
g.stroke({ width: 4, color: 0x000000, cap: 'round' });
```

### E. Face Shadows (Blue Hoodie Technique)
If the character has a shadow cast over half the face, use a closed path combining the head's arc and a curved bottom edge.
```typescript
const shadowAngle = 0.38; // Adjust to define how far down the sides the shadow goes
g.beginPath();
// Trace the top of the head
g.arc(0, -100, 100, Math.PI - shadowAngle, 2 * Math.PI + shadowAngle);
// Curve back across the face to close the shadow
g.quadraticCurveTo(0, -60, -100 * Math.cos(shadowAngle), -100 + 100 * Math.sin(shadowAngle));
g.closePath();
g.fill(shadowColor);
```

## 3. Strict Style Rules

- **Standard Outlines:** All core body parts and features must be stroked with:
  ```typescript
  g.stroke({ width: 4, color: 0x000000, join: 'round', cap: 'round' });
  ```
- **Spooky Theme Support:** Every color must dynamically react to `isSpooky`.
  ```typescript
  const bodyColor = isSpooky ? 0x000088 : 0x0000ff; // Desaturated/darker
  const pupilColor = isSpooky ? 0xff0000 : 0x000000; // Demonic eyes
  ```
- **No Alpha Tricks for Overlaps:** Never use `g.alpha = 0.5` on graphics containing overlapping geometries, as the inner overlaps will become visible. If transparency is needed, use `this.filters = [new AlphaFilter({ alpha: 0.5 })]` on the parent container (though typically avoided in base character drawing).

## 4. Using the Character Lab for 1:1 Precision

We have created a custom development tool to guarantee first-try success: **The Character Lab**.
It is located at `http://localhost:5173/character-lab.html` (accessible while Vite is running).

**Workflow for new characters:**
1. Generate the initial Pixi code based on the baseline proportions and reference image.
2. Open `/character-lab.html` in your browser.
3. Select your character from the dropdown.
4. Click **"Overlay Ref"** and upload the original generated reference image.
5. Adjust the **Ref Opacity** slider so you can see both the Pixi canvas and the reference image.
6. Refine your code! Nudge positions, adjust curves, and correct colors until your Pixi graphics perfectly overlap the original reference image.
7. Use the "Download PNG" button if you need a static snapshot for comparison.