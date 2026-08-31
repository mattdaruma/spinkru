import wave
import math
import struct
import os

sample_rate = 44100
duration = 2.0 # 2 seconds = 1 measure at 120 BPM
num_samples = int(sample_rate * duration)

os.makedirs('src/characters/starter', exist_ok=True)

with wave.open('src/characters/starter/melody.wav', 'w') as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sample_rate)

    # 4 beats, 120 bpm = 2 seconds.
    # C4, E4, G4, C5 (half second each)
    freqs = [261.63, 329.63, 392.00, 523.25]
    for i in range(num_samples):
        t = float(i) / sample_rate
        beat = int(t * 2) # 0, 1, 2, 3
        if beat > 3: beat = 3
        freq = freqs[beat]
        
        # Envelope to prevent clicking
        beat_t = (t * 2) - beat
        env = 1.0
        if beat_t < 0.05:
            env = beat_t / 0.05
        elif beat_t > 0.45:
            env = (0.5 - beat_t) / 0.05
            
        value = int(32767.0 * 0.5 * env * math.sin(2.0 * math.pi * freq * t))
        value = max(-32768, min(32767, value))
        data = struct.pack('<h', value)
        wav_file.writeframesraw(data)
