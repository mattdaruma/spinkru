import wave
import math
import struct
import os

sample_rate = 44100
duration = 2.0
num_samples = int(sample_rate * duration)

os.makedirs('src/characters/flower_tube', exist_ok=True)

def generate_sound(filename, freqs, is_spooky):
    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(1)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)

        for i in range(num_samples):
            t = float(i) / sample_rate
            beat = int(t * 4) # 8th notes in a 4-beat measure -> 8 segments
            if beat > 7: beat = 7
            freq = freqs[beat]
            if is_spooky:
                freq *= 0.5 # lower pitch for spooky
            
            beat_t = (t * 4) - beat
            env = 1.0
            if beat_t < 0.05:
                env = beat_t / 0.05
            elif beat_t > 0.15:
                env = max(0, 1.0 - (beat_t - 0.15) / 0.1)
                
            val = math.sin(2.0 * math.pi * freq * t)
            val += 0.3 * math.sin(2.0 * math.pi * freq * 2.0 * t) 
            if is_spooky:
                val += 0.5 * math.sin(2.0 * math.pi * freq * 1.5 * t) # dissonant harmonic

            value = int(32767.0 * 0.4 * env * val)
            value = max(-32768, min(32767, value))
            data = struct.pack('<h', value)
            wav_file.writeframesraw(data)

# Flute-like melody for flower_tube
freqs = [523.25, 659.25, 783.99, 659.25, 523.25, 440.00, 523.25, 659.25]
generate_sound('src/characters/flower_tube/flower_tube.wav', freqs, False)
generate_sound('src/characters/flower_tube/flower_tube_spooky.wav', freqs, True)
