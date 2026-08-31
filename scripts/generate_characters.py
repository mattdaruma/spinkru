import os
import wave
import math
import struct

# Colors for 20 characters based on image inspiration
colors = [
    0xffa500, 0xff0000, 0xaaaaaa, 0x555555, 0x00ff00,
    0x888888, 0xd2b48c, 0x222222, 0xffff00, 0xddccaa,
    0x8b4513, 0xffffff, 0x000000, 0xffdd00, 0x006400,
    0x999999, 0x654321, 0xeebbaa, 0xcc0000, 0x0000ff
]

sample_rate = 44100
duration = 2.0
num_samples = int(sample_rate * duration)

os.makedirs('src/characters', exist_ok=True)

for i in range(1, 21):
    char_id = f"char_{i}"
    
    # --- Generate Audio ---
    wav_path = f'src/characters/{char_id}/{char_id}.wav'
    os.makedirs(f'src/characters/{char_id}', exist_ok=True)
    with wave.open(wav_path, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)

        # Generate a unique simple tune per character
        base_freq = 220.0 + (i * 20.0)
        freqs = [base_freq, base_freq * 1.25, base_freq * 1.5, base_freq * 2.0]
        if i % 2 == 0:
            freqs = freqs[::-1] # Reverse some melodies
            
        for s in range(num_samples):
            t = float(s) / sample_rate
            beat = int(t * 2)
            if beat > 3: beat = 3
            freq = freqs[beat]
            
            beat_t = (t * 2) - beat
            env = 1.0
            if beat_t < 0.05:
                env = beat_t / 0.05
            elif beat_t > 0.45:
                env = (0.5 - beat_t) / 0.05
                
            # Mix sine and some harmonics for variety
            val = math.sin(2.0 * math.pi * freq * t)
            if i % 3 == 0:
                val += 0.5 * math.sin(2.0 * math.pi * freq * 2.0 * t) # Add octave
                
            value = int(32767.0 * 0.4 * env * val)
            value = max(-32768, min(32767, value))
            wav_file.writeframesraw(struct.pack('<h', value))

    # --- Generate TS Code ---
    char_dir = f'src/characters/{char_id}'
    os.makedirs(char_dir, exist_ok=True)
    
    color_hex = f"0x{colors[i-1]:06x}"
    # Calculate a darker version of the color
    r = (colors[i-1] >> 16) & 0xFF
    g_c = (colors[i-1] >> 8) & 0xFF
    b = colors[i-1] & 0xFF
    dark_color_hex = f"0x{((r//3)<<16) | ((g_c//3)<<8) | (b//3):06x}"
    
    # Custom visual features based on index
    extra_drawing = ""
    if i == 3: # Cap
        extra_drawing = """
        // Cap
        g.beginPath();
        g.arc(0, -140, 100, Math.PI, 0);
        g.closePath();
        g.fill(isSpooky ? 0x550000 : 0xff0000);
        g.stroke({ width: 4, color: 0x000000 });
        g.rect(0, -140, 120, 20);
        g.fill(isSpooky ? 0x550000 : 0xff0000);
        g.stroke({ width: 4, color: 0x000000 });
        """
    elif i == 4: # Cat ears
        extra_drawing = """
        // Ears
        g.poly([-80, -180, -40, -180, -60, -240]);
        g.fill(isSpooky ? 0x222222 : 0x555555);
        g.stroke({ width: 4, color: 0x000000 });
        g.poly([80, -180, 40, -180, 60, -240]);
        g.fill(isSpooky ? 0x222222 : 0x555555);
        g.stroke({ width: 4, color: 0x000000 });
        """
    elif i == 8: # Sunglasses
        extra_drawing = """
        // Sunglasses
        g.rect(-70, -140, 60, 40);
        g.fill(0x000000);
        g.rect(10, -140, 60, 40);
        g.fill(0x000000);
        g.moveTo(-10, -120);
        g.lineTo(10, -120);
        g.stroke({ width: 4, color: 0x000000 });
        """
    elif i == 12: # Top hat
        extra_drawing = """
        // Top hat
        g.rect(-60, -180, 120, 20);
        g.fill(0x000000);
        g.rect(-40, -260, 80, 80);
        g.fill(0x000000);
        """
    elif i == 19: # Horns
        extra_drawing = """
        // Horns
        g.poly([-60, -180, -40, -180, -80, -250]);
        g.fill(isSpooky ? 0x666666 : 0xffffff);
        g.stroke({ width: 4, color: 0x000000 });
        g.poly([60, -180, 40, -180, 80, -250]);
        g.fill(isSpooky ? 0x666666 : 0xffffff);
        g.stroke({ width: 4, color: 0x000000 });
        """

    # Eyes
    if i in [7, 9]: # Single eye
        eyes_code = """
        // Single Eye
        g.circle(0, -120, 40);
        g.fill(isSpooky ? 0x000000 : 0xffffff);
        g.stroke({ width: 4, color: 0x000000 });
        g.circle(0, -120, 15);
        g.fill(isSpooky ? 0xffffff : 0x000000);
        """
    else:
        eyes_code = """
        // Left eye
        g.circle(-40, -120, 25);
        g.fill(isSpooky ? 0x000000 : 0xffffff);
        g.stroke({ width: 4, color: 0x000000 });
        g.circle(-40, -120, 10);
        g.fill(isSpooky ? 0xffffff : 0x000000);
        
        // Right eye
        g.circle(40, -120, 25);
        g.fill(isSpooky ? 0x000000 : 0xffffff);
        g.stroke({ width: 4, color: 0x000000 });
        g.circle(40, -120, 10);
        g.fill(isSpooky ? 0xffffff : 0x000000);
        """
        
    ts_code = f"""import {{ CharacterConfig }} from '../../types';
import {{ Graphics }} from 'pixi.js';

export const {char_id}: CharacterConfig = {{
    id: '{char_id}',
    soundPath: sound,
    draw: (g: Graphics, isSpooky: boolean = false) => {{
        let color = isSpooky ? {dark_color_hex} : {color_hex};

        // Body
        g.poly([
            -30, -100, 
            30, -100, 
            50, 220, 
            -50, 220
        ]);
        g.fill(color);
        g.stroke({{ width: 4, color: 0x000000 }});

        // Head
        g.circle(0, -100, 100);
        g.fill(color);
        g.stroke({{ width: 4, color: 0x000000 }});

        {eyes_code}
        {extra_drawing}

        // Mouth
        g.moveTo(-20, -60);
        g.lineTo(20, -60);
        g.stroke({{ width: 4, color: 0x000000 }});
    }}
}};
"""
    with open(f'{char_dir}/index.ts', 'w') as f:
        f.write(ts_code)

# --- Generate index.ts ---
index_ts = "import { starterCharacter } from './starter';\n"
for i in range(1, 21):
    index_ts += f"import {{ char_{i} }} from './char_{i}';\n"
    
index_ts += "\nimport { CharacterConfig } from '../types';\n"
index_ts += "\nexport const allCharacters: CharacterConfig[] = [\n    starterCharacter,\n"
for i in range(1, 21):
    index_ts += f"    char_{i}{',' if i < 20 else ''}\n"
index_ts += "];\n"

with open('src/characters/index.ts', 'w') as f:
    f.write(index_ts)

print("Generated 20 characters with theme variations and registered all 20 (+ starter).")

