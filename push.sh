#!/usr/bin/env bash
# One-click commit and push to GitHub
cd "$(dirname "$0")"

echo "========================================="
echo "📦 VAJRA x SENTINA - Sync to GitHub & Render"
echo "========================================="

MSG="${1:-update: sync project changes $(date +'%Y-%m-%d %H:%M:%S')}"

git add -A
git commit -m "$MSG" || echo "No new changes to commit."
echo "🚀 Pushing to GitHub (origin main)..."
git push origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ [SUCCESS] Changes pushed to GitHub: https://github.com/exes012/vajraXsentina"
    echo "⚡ Render will automatically start deploying the new build!"
else
    echo ""
    echo "❌ Push encountered an error. Check authentication/permissions."
fi
