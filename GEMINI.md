# TOP PRIORITY - ASSISTANT BEHAVIOR - DO NOT REMOVE

## ALLOWED TOOLS WHITELIST
- ReadFile
- WriteFile
- GoogleSearch

## MINIMIZE CHAT TEXT
- MINIMIZE CHAT TEXT
- DO NOT EVER FOR ANY REASON PRINT FILE CONTENTS TO THE CHAT WINDOW
  - THIS INCLUDES READING FILES WITH SHELL COMMANDS
  - ONLY EVER use read_file to read a file's contents
  - NEVER READ FILES WITH TERMINAL COMMANDS

## DO NOT RUN TERMINAL COMMANDS
- DO NOT RUN SHELL COMMANDS
- DO NOT RUN NPM COMMANDS
- DO NOT RUN NODE COMMANDS
- DO NOT RUN TSC COMMANDS
- DO NOT RUN CAT COMMANDS
- DO NOT RUN GREP COMMANDS

## DO NOT BUILD ANYTHING
- DO NOT RUN BUILDS
- The user will run all the builds.
  - If you need to know a build's results, ask the user.

## DO NOT TEST YOUR WORK
- DO NOT TEST YOUR WORK
- The user will verify your work with testing.
  - If you need to know a command's output, ask the user.

# Spinkru Game Project

## Mission Statement
Create a simple 2D browser game inspired by "Sprunki". Players interact with a static background by clicking or dragging and dropping little characters into specific slots. 
Once dropped into a slot, a character plays a looping sound synchronized with other placed characters. Removing a character stops its sound.

## Tech Stack & Architecture
- **Bundler:** Vite
- **Language:** TypeScript
- **2D Graphics / Interaction:** Pixi.js (Handles rendering, drag-and-drop events, and visual state)
- **Audio Management:** Howler.js (Handles precise audio looping and synchronization)

## Conventions
- Use explicit and idiomatic TypeScript features (type guards, object spread).
- Avoid complex inheritance; prefer explicit composition.
- Follow standard Pixi.js v8 initialization and rendering patterns.

## Lessons Learned & Current Architecture (May 2026)
- **Component Splitting:** The game is orchestrated via `src/index.ts` but relies on encapsulated classes in `src/components/`: `Background`, `Character`, `Menu`, `MenuSlot`, and `CharacterSlot`.
- **Drag & Drop Strategy:** 
  - Managed via pointer events (`pointerdown`, `globalpointermove`, `globalpointerup`).
  - Use a top-level `dragLayer: Container` added to the main stage to ensure dragged items render strictly above all UI (menu and background).
  - Create a temporary `dragProxy` character on drag start.
  - **CRITICAL:** Set `eventMode = 'none'` on the drag proxy so it doesn't swallow `globalpointerup` events during dropping.
- **Hit Testing (Pixi v8):** Use `bounds.containsPoint(x, y)` on a container's `getBounds()` result. Do NOT use `.contains()`, which does not exist on Pixi v8 `Bounds`.
- **Masking & Scaling:** The character rendered inside a `MenuSlot` must be scaled down (e.g., `0.35`) and masked with a `Graphics().roundRect(...)` so it never visually bleeds out of the slot boundaries.
- **Transparency:** When applying opacity to `Graphics` objects made of overlapping shapes (like a body trapezoid and head circle), use `this.filters = [new AlphaFilter({ alpha: 0.x })]`. Setting `g.alpha` or `g.fill({ alpha })` will cause overlapping geometries to become visible inside the shape.
- **Audio:** Using `howler`. Sounds loop indefinitely upon dropping a character into a `CharacterSlot` and are `.stop()`ped when the user drags the character back out of the slot (dist > 100px from slot center).
- **Pixi.js Character Drawing (Images to Code - One-Shot Guide):**
  - **Analyze Proportions & Positions carefully:** Map out relative sizes and positions precisely. Ensure eyes are appropriately scaled (often larger than expected) and centered. Pay attention to negative space (e.g., leaving a visible gap between a headband and the top of the head).
  - **Inside vs. Outside Boundaries:** Critically evaluate if elements (like hair, hats, or patterns) sit *inside* the silhouette (overlapping the face/body, pointing downwards onto the forehead) or break the silhouette (pointing outwards/upwards from the edge).
  - **Shape Mapping & True Curves:** Match source shapes exactly. For complex shapes like hair, use continuous paths (`moveTo`, `lineTo`) mimicking exact shapes (e.g., two distinct right-slanted triangles). When using `quadraticCurveTo` for features like eyebrows or smiles, push the control points far enough out to create a *noticeable arc*, avoiding visually flat lines.
  - **Visual Weight & Thickness:** Match the visual weight of appendages. For thicker elements (like antennae stems or limbs), use polygons (`g.poly`) with width rather than relying solely on thick strokes, or ensure the stroke width matches the exact proportions of the image.
  - **Attention to Detail:** Look for distinct connective parts (e.g., a rectangular cushion connecting a headphone band to the ear cup, rather than overlapping shapes). Match eye states perfectly (half-lidded, specific pupil sizes) and precise angles (e.g., antennae slanted significantly outwards).
  - **Color Accuracy:** Do not use generic hex colors. Extract or estimate the exact hex values from the reference (e.g., differentiating between the base color, lighter accent parts, and specific shading).
  - **Baseline Proportions (Orange DJ & Red Demon):** The "Orange DJ" form factor is the preferred, tested baseline template for standard characters. Key structural takeaways include:
    - **Body Shape:** A shorter body height with specific widths for the base and top of the trapezoid (e.g., `[-20,-100, 20,-100, 55,170, -55,170]`).
    - **Head and Eyes:** Specific radii for the head, eye, and pupil circles to support significantly larger eyes (e.g., eye radius `35`, wide pupils `24`).
    - **Facial Features:** The presence of eyebrows, eyelids (e.g., half-lidded semi-circles), and an expressive mouth are crucial for the character's baseline expressiveness.
  - **Seamless Attachments (Horns/Spikes):** For elements resting on the curve of the head (like front-facing horns), use a single continuous path rather than layering a base shape and a point. Use `quadraticCurveTo` at the base to create a convex curve that flawlessly traces the contour of the circular head. Ensure outer elements slant away from the center (`x` offset outward) to match the reference spread.
  - **Expressive Lines (Eyebrows/Mouth):** For curved features, straight lines or shallow curves are insufficient. Use `quadraticCurveTo` with the control point pushed significantly vertically to guarantee a distinct, intended arc (e.g., arched angry eyebrows). Strictly observe the horizontal span to avoid drawing lines too wide across the face.
  - **Micro-Positioning:** Vertical placement dictates likeness. When placing the mouth or features, replicate the exact proportional ratio of the reference (e.g., spacing between the bottom of the eyes, the mouth, and the chin). Shifts of just 2-3 pixels dramatically alter the likeness.
  - **Audio Volume Baseline:** Standardize generated audio volume to punch through the mix. When generating `.wav` files via math/struct packing, use an amplitude multiplier of around `0.6` (e.g., `int(32767.0 * 0.6 * env * val)`) as the tested baseline for standard synth/wave sounds.
  - **Audio Synchronization & Queuing:** To keep all looping samples perfectly aligned, use a global `syncMarker` event triggered precisely at an 8-second interval (tied to a `Ticker` elapsed MS). Instead of playing audio immediately on drop, push `{ char, sound, spookySound }` to a `pendingItems` queue. On the `syncMarker`, call `.play()` simultaneously for all queued tracks and start their animations to guarantee phase coherence.
  - **Spooky Dual-Audio Tracks:** Characters support dynamic switching to alternate themes (e.g., `spooky_day` and `spooky_night`). Rather than destroying and re-creating `Howl` instances when the theme changes, instantiate *both* tracks (standard and spooky) immediately on drop. Both tracks play concurrently from the `syncMarker` to stay phase-aligned, but use `volume(0)` or `volume(1)` dynamically based on the current theme to crossfade seamlessly.