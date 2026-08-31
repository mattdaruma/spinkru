import os
import wave
import struct

directory = 'src/characters'

for root, _, files in os.walk(directory):
    for filename in files:
        if filename.endswith(".wav") and filename != "orange_dj.wav":
            filepath = os.path.join(root, filename)
            
            with wave.open(filepath, 'r') as wav_in:
                nchannels = wav_in.getnchannels()
                sampwidth = wav_in.getsampwidth()
                framerate = wav_in.getframerate()
                nframes = wav_in.getnframes()
                
                data = wav_in.readframes(nframes)
            
            # Unpack the data
            # 'h' is for 2-byte signed integers
            fmt = f"<{nframes * nchannels}h"
            samples = list(struct.unpack(fmt, data))
            
            # Scale the volume down (e.g., to 20% of original)
            scaled_samples = [int(sample * 0.2) for sample in samples]
            
            # Pack the data back
            packed_data = struct.pack(fmt, *scaled_samples)
            
            with wave.open(filepath, 'w') as wav_out:
                wav_out.setnchannels(nchannels)
                wav_out.setsampwidth(sampwidth)
                wav_out.setframerate(framerate)
                wav_out.writeframes(packed_data)
            
            print(f"Lowered volume of {filename}")
