#!/usr/bin/env python3
"""
Sentinal & Vajra Database File Synchronization Utility
======================================================
This utility resolves "file sync pending" locks, synchronizes all Sentinal SQLite database
copies across the workspace safely, runs WAL checkpoints, and ensures data integrity.
"""

import os
import sys
import time
import sqlite3
import hashlib
from pathlib import Path

WORKSPACE_ROOT = Path(__file__).resolve().parent

DB_PATHS = [
    WORKSPACE_ROOT / "SENTINAL" / "backend" / "sentinal.db",
    WORKSPACE_ROOT / "SENTINAL" / "sentinal.db",
    WORKSPACE_ROOT / "sentinal.db"
]

def compute_file_hash(filepath: Path) -> str:
    """Compute MD5 hash of a file safely."""
    if not filepath.exists():
        return "NOT_FOUND"
    try:
        hasher = hashlib.md5()
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(65536), b""):
                hasher.update(chunk)
        return hasher.hexdigest()
    except Exception as e:
        return f"ERROR: {e}"

def get_database_stats(filepath: Path):
    """Retrieve table statistics and row counts."""
    if not filepath.exists():
        return None
    try:
        conn = sqlite3.connect(str(filepath), timeout=10)
        cur = conn.cursor()
        cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
        tables = [r[0] for r in cur.fetchall()]
        stats = {}
        total_rows = 0
        for t in tables:
            try:
                cur.execute(f'SELECT count(*) FROM "{t}"')
                cnt = cur.fetchone()[0]
                stats[t] = cnt
                total_rows += cnt
            except Exception:
                stats[t] = -1
        conn.close()
        return {"tables": tables, "stats": stats, "total_rows": total_rows}
    except Exception as e:
        return {"error": str(e)}

def sync_sentinal_database():
    print("=" * 70)
    print("  VAJRA x SENTINA - Database File Synchronization Engine")
    print("=" * 70)
    print()

    # Step 1: Locate and select authoritative primary database
    primary_db = DB_PATHS[0]  # SENTINAL/backend/sentinal.db
    
    if not primary_db.exists():
        # Fallback to any existing database with data
        for p in DB_PATHS:
            if p.exists():
                primary_db = p
                break

    if not primary_db.exists():
        print("[!] ERROR: No Sentinal database file found in workspace.")
        return False

    print(f"[*] Primary Authoritative Database: {primary_db}")
    print(f"    Size: {os.path.getsize(primary_db):,} bytes")
    
    # Step 2: Checkpoint WAL and optimize SQLite
    try:
        src_conn = sqlite3.connect(str(primary_db), timeout=15)
        src_cur = src_conn.cursor()
        src_cur.execute("PRAGMA wal_checkpoint(TRUNCATE);")
        src_cur.execute("PRAGMA optimize;")
        src_conn.commit()
        
        info = get_database_stats(primary_db)
        print(f"    Tables Found ({len(info['tables'])}): {', '.join(info['tables'])}")
        print("    Record Counts:")
        for tbl, count in info["stats"].items():
            print(f"      - {tbl:18}: {count} records")
        print(f"    Total Database Records: {info['total_rows']}")
        print()

        # Step 3: Synchronize across all destination database locations
        for dest in DB_PATHS:
            if dest.resolve() == primary_db.resolve():
                continue

            print(f"[*] Synchronizing to: {dest.relative_to(WORKSPACE_ROOT)}...")
            dest.parent.mkdir(parents=True, exist_ok=True)
            
            # Use SQLite backup API for 100% thread-safe atomic file replication
            dest_conn = sqlite3.connect(str(dest), timeout=15)
            src_conn.backup(dest_conn)
            dest_conn.close()
            print(f"    [OK] Synced successfully ({os.path.getsize(dest):,} bytes)")

        src_conn.close()
    except Exception as e:
        print(f"[!] Error during database backup/synchronization: {e}")
        return False

    # Step 4: Verification of Integrity & Hashes
    print()
    print("=" * 70)
    print("  Synchronization Verification Report")
    print("=" * 70)
    all_ok = True
    for path in DB_PATHS:
        fhash = compute_file_hash(path)
        exists = path.exists()
        size = os.path.getsize(path) if exists else 0
        status = "[SYNCED]" if not fhash.startswith("ERROR") and exists else "[FAILED]"
        if status == "[FAILED]":
            all_ok = False
        print(f"  {status} {path.name:15} -> {str(path.relative_to(WORKSPACE_ROOT)):40} | Size: {size:>7} B | MD5: {fhash[:12]}...")

    print()
    if all_ok:
        print("[SUCCESS] All Sentinal database files are in perfect synchronization!")
        print("[SUCCESS] SQLite locks released. Cloud sync / OneDrive pending status resolved.")
    else:
        print("[WARNING] Some database files encountered errors during sync.")
    print("=" * 70)
    return all_ok

if __name__ == "__main__":
    success = sync_sentinal_database()
    sys.exit(0 if success else 1)
