#!/usr/bin/env python3
"""
VAJRA x SENTINA - Clean Project Zip Creator
===========================================
Creates a complete zip archive of the project while optionally skipping heavy,
regenerable directories like node_modules, .next, and __pycache__ if desired,
or creating a full verbatim backup.
"""

import os
import sys
import zipfile
from pathlib import Path
import time

WORKSPACE_ROOT = Path(__file__).resolve().parent
DEFAULT_ZIP_NAME = WORKSPACE_ROOT.parent / f"VAJRAxSENTINA_export_{time.strftime('%Y%m%d_%H%M%S')}.zip"

EXCLUDE_DIRS = {
    "node_modules",
    ".next",
    "__pycache__",
    ".pytest_cache",
    ".git",
    ".DS_Store"
}

def create_zip(output_path=DEFAULT_ZIP_NAME, exclude_heavy=False):
    print("=" * 65)
    print("  VAJRA x SENTINA - Clean Zip Archive Creator")
    print("=" * 65)
    print(f"Target Zip: {output_path}")
    print(f"Source:     {WORKSPACE_ROOT}")
    print()

    total_files = 0
    total_bytes = 0

    with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(WORKSPACE_ROOT):
            rel_root = Path(root).relative_to(WORKSPACE_ROOT)
            
            # Skip excluded dirs if exclude_heavy is True
            if exclude_heavy:
                dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

            for file in files:
                if exclude_heavy and file in [".DS_Store", "Thumbs.db"]:
                    continue
                file_path = Path(root) / file
                arcname = file_path.relative_to(WORKSPACE_ROOT)
                try:
                    zipf.write(file_path, arcname)
                    total_files += 1
                    total_bytes += file_path.stat().st_size
                    if total_files % 100 == 0:
                        print(f"  Archived {total_files} files...", end="\r")
                except Exception as e:
                    print(f"\n  [!] Warning on {arcname}: {e}")

    zip_size = Path(output_path).stat().st_size
    print(f"\n[OK] Archived {total_files:,} files ({total_bytes / (1024*1024):.2f} MB uncompressed)")
    print(f"[OK] Created Zip: {output_path} ({zip_size / (1024*1024):.2f} MB)")
    print("=" * 65)
    return output_path

if __name__ == "__main__":
    exclude = "--full" not in sys.argv
    create_zip(exclude_heavy=exclude)
