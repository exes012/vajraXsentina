#!/usr/bin/env python3
"""
Auto-Sync Watcher for VAJRA x SENTINA
Monitors local folder changes, automatically commits them, and pushes to GitHub.
Render automatically triggers a deployment upon receiving the push.
"""

import subprocess
import time
import sys
from datetime import datetime

CHECK_INTERVAL = 3  # seconds between status checks
DEBOUNCE_WAIT = 2   # seconds to wait after change detection before committing

def run_cmd(cmd, cwd=None):
    res = subprocess.run(cmd, shell=True, cwd=cwd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    return res.returncode, res.stdout.strip(), res.stderr.strip()

def get_git_changes():
    code, stdout, _ = run_cmd("git status --porcelain")
    if code == 0 and stdout:
        lines = [line.strip() for line in stdout.splitlines() if line.strip()]
        return lines
    return []

def main():
    print("=" * 65)
    print("🚀 VAJRA x SENTINA - Continuous Auto-Push to GitHub & Render")
    print("=" * 65)
    print(f"[*] Monitoring repository for changes (polling every {CHECK_INTERVAL}s)...")
    print("[*] Target GitHub: https://github.com/exes012/vajraXsentina")
    print("[*] Press Ctrl+C at any time to stop the watcher.\n")

    while True:
        try:
            changes = get_git_changes()
            if changes:
                now_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                print(f"[{now_str}] 🔍 Detected {len(changes)} modified/new file(s):")
                for ch in changes[:5]:
                    print(f"    -> {ch}")
                if len(changes) > 5:
                    print(f"    -> ... and {len(changes) - 5} more")

                print(f"⏳ Waiting {DEBOUNCE_WAIT}s for edits to settle...")
                time.sleep(DEBOUNCE_WAIT)

                # Stage all changes
                print("📦 Staging changes (git add -A)...")
                code, _, err = run_cmd("git add -A")
                if code != 0:
                    print(f"❌ Error adding files: {err}")
                    time.sleep(CHECK_INTERVAL)
                    continue

                # Check if there are still changes to commit
                changes_after_add = get_git_changes()
                if not changes_after_add:
                    time.sleep(CHECK_INTERVAL)
                    continue

                commit_msg = f"auto-sync: update project files ({now_str})"
                print(f"📝 Committing: '{commit_msg}'...")
                code, out, err = run_cmd(f'git commit -m "{commit_msg}"')
                if code != 0 and "nothing to commit" not in err and "nothing to commit" not in out:
                    print(f"⚠️ Commit warning: {err or out}")

                print("🚀 Pushing to GitHub (origin main)...")
                code, out, err = run_cmd("git push origin main")
                if code == 0:
                    print("✅ [SUCCESS] Pushed to GitHub! Render auto-deploy triggered.")
                    print("-" * 65)
                else:
                    print(f"❌ Push failed:\n{err or out}")
                    if "Permission" in (err + out) or "403" in (err + out):
                        print("🔑 Authentication required: Please verify your GitHub credentials for exes012/vajraXsentina.")
                    print("-" * 65)

            time.sleep(CHECK_INTERVAL)
        except KeyboardInterrupt:
            print("\n👋 Auto-push watcher stopped.")
            sys.exit(0)
        except Exception as e:
            print(f"⚠️ Watcher error: {e}")
            time.sleep(CHECK_INTERVAL)

if __name__ == "__main__":
    main()
