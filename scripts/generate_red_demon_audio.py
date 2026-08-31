import wave
import math
import struct
import os

sample_rate = 44100
duration = 2.0 # 2 seconds = 1 measure at 120 BPM
num_samples = int(sample_rate * duration)

os.makedirs('src/characters/red_demon', exist_ok=True)

with wave.open('src/characters/red_demon/red_demon.wav', 'w') as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sample_rate)

    # Some crunchy distorted or low frequency hit. Let's do a fast bass arpeggio.
    # 8th notes
    freqs = [82.41, 110.00, 98.00, 130.81, 82.41, 110.00, 146.83, 130.81]

    for i in range(num_samples):
        t = float(i) / sample_rate
        beat = int(t * 4) # 8th notes in a 4-beat measure -> 8 segments
        if beat > 7: beat = 7
        freq = freqs[beat]
        
        beat_t = (t * 4) - beat
        env = 1.0
        if beat_t < 0.05:
            env = beat_t / 0.05
        elif beat_t > 0.2:
            env = max(0, 1.0 - (beat_t - 0.2) / 0.05)
            
        val = math.sin(2.0 * math.pi * freq * t)
        val += 0.5 * math.sin(2.0 * math.pi * freq * 2.0 * t) # harmonic
        val += 0.25 * math.sin(2.0 * math.pi * freq * 3.0 * t) # harmonic

        # increased volume multiplier to 0.6 for maximum punch
        value = int(32767.0 * 0.6 * env * val)
        value = max(-32768, min(32767, value))
        data = struct.pack('<h', value)
        wav_file.writeframesraw(data)
