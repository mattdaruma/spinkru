import wave
import math
import struct
import os

sample_rate = 44100
duration = 2.0 # 2 seconds = 1 measure at 120 BPM
num_samples = int(sample_rate * duration)

os.makedirs('src/characters/orange_dj', exist_ok=True)

with wave.open('src/characters/orange_dj/orange_dj.wav', 'w') as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sample_rate)

    # 4 beats, 120 bpm = 2 seconds. Each beat is 0.5s.
    # Syncopated rhythm pattern (times in seconds):
    # 0.0 (Kick), 0.375 (Snare syncopated), 0.75 (Kick), 1.25 (Snare syncopated), 1.5 (Kick)
    # Let's make a synth chord or bass hit on syncopated 16th notes:
    # 1/16 note = 0.125s
    # Pattern: 1 . . 4 . . 7 . . 10 . 12 . 14 . 16
    # Hits at 16th note indices: 0, 3, 6, 9, 12, 14
    # Times: 0.0, 0.375, 0.75, 1.125, 1.5, 1.75
    
    hits = [0.0, 0.375, 0.75, 1.125, 1.5, 1.75]
    
    def get_hit_amp(t):
        amp = 0.0
        for hit_time in hits:
            if t >= hit_time and t < hit_time + 0.2:
                # Decay envelope
                decay = 1.0 - ((t - hit_time) / 0.2)
                amp += decay
        return amp

    for i in range(num_samples):
        t = float(i) / sample_rate
        
        amp = get_hit_amp(t)
        
        # Synth frequency (e.g., bass note at C2 = 65.41 Hz or C3 = 130.81 Hz)
        freq = 130.81
        
        # Add some FM synthesis for a DJ sound
        mod = math.sin(2.0 * math.pi * (freq * 2) * t)
        val = math.sin(2.0 * math.pi * freq * t + mod * 2.0)
        
        value = int(32767.0 * 0.5 * amp * val)
        value = max(-32768, min(32767, value))
        data = struct.pack('<h', value)
        wav_file.writeframesraw(data)
