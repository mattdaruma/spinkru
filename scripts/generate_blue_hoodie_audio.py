import wave
import math
import struct
import os

sample_rate = 44100
duration = 2.0 # 2 seconds = 1 measure at 120 BPM
num_samples = int(sample_rate * duration)

os.makedirs('src/characters/blue_hoodie', exist_ok=True)

with wave.open('src/characters/blue_hoodie/blue_hoodie.wav', 'w') as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sample_rate)

    # Some cool synth pad or plucks for blue hoodie
    freqs = [220.00, 261.63, 329.63, 392.00, 329.63, 261.63, 220.00, 196.00]

    for i in range(num_samples):
        t = float(i) / sample_rate
        beat = int(t * 4) # 8th notes in a 4-beat measure -> 8 segments
        if beat > 7: beat = 7
        freq = freqs[beat]
        
        beat_t = (t * 4) - beat
        # smooth envelope for a hoodie vibe
        env = 1.0
        if beat_t < 0.05:
            env = beat_t / 0.05
        elif beat_t > 0.15:
            env = max(0, 1.0 - (beat_t - 0.15) / 0.1)
            
        val = math.sin(2.0 * math.pi * freq * t)
        val += 0.3 * math.sin(2.0 * math.pi * freq * 2.0 * t) 
        val += 0.1 * math.sin(2.0 * math.pi * freq * 3.0 * t) 

        value = int(32767.0 * 0.4 * env * val)
        value = max(-32768, min(32767, value))
        data = struct.pack('<h', value)
        wav_file.writeframesraw(data)
