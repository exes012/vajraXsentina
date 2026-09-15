#!/usr/bin/env bash
# Continuous Auto-Push to GitHub and Render
cd "$(dirname "$0")"
chmod +x auto_push.py
python3 auto_push.py
