import os
import shutil
from pathlib import Path

root = Path(__file__).resolve().parent
src_fe = root / 'SENTINAL' / 'frontend' / 'src'
dst_fe = root / 'vajra Finl' / 'indigo 2' / 'indigo' / 'new' / 'INDIGO' / 'frontend' / 'src' / 'sentina'

# 1. Sync Frontend
print("Syncing Frontend...")
for dirpath, dirnames, filenames in os.walk(src_fe):
    rel = Path(dirpath).relative_to(src_fe)
    target_dir = dst_fe / rel
    target_dir.mkdir(parents=True, exist_ok=True)
    for f in filenames:
        sf = Path(dirpath) / f
        df = target_dir / f
        
        if f.endswith(('.jsx', '.tsx', '.js')):
            try:
                content = sf.read_text(encoding='utf-8')
            except Exception:
                try:
                    content = sf.read_text(encoding='utf-16')
                except Exception:
                    shutil.copy2(sf, df)
                    print(f"Synced (binary fallback) FE: {rel / f}")
                    continue
            
            clean = content.lstrip()
            if not clean.startswith("'use client'") and not clean.startswith('"use client"'):
                content = "'use client';\n" + content
                
            df.write_text(content, encoding='utf-8')
            print(f"Synced FE: {rel / f}")
        else:
            shutil.copy2(sf, df)
            print(f"Copied Asset FE: {rel / f}")

# Ensure index.css is also copied to destination
shutil.copy2(src_fe / 'index.css', dst_fe / 'index.css')
print(f"Copied index.css to {dst_fe / 'index.css'}")

# 2. Sync Backend
print("\nSyncing Backend...")
src_be = root / 'SENTINAL' / 'backend' / 'app'
dst_be = root / 'vajra Finl' / 'indigo 2' / 'indigo' / 'new' / 'INDIGO' / 'backend' / 'app'

for dirpath, dirnames, filenames in os.walk(src_be):
    if '__pycache__' in dirpath: continue
    rel = Path(dirpath).relative_to(src_be)
    target_dir = dst_be / rel
    target_dir.mkdir(parents=True, exist_ok=True)
    for f in filenames:
        if f.endswith('.pyc'): continue
        sf = Path(dirpath) / f
        df = target_dir / f
        shutil.copy2(sf, df)
        print(f"Synced BE: {rel / f}")

print("\nAll Sentina files synced to INDIGO successfully.")
