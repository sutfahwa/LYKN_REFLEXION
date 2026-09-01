#!/bin/bash
# Runs the site locally for testing before pushing to GitHub/Netlify.
# Usage: ./test-local.sh
cd "$(dirname "$0")"
PORT=8010
echo "Serving LYKN Reflexion Concert at http://localhost:$PORT"
echo "Press Ctrl+C to stop."
open "http://localhost:$PORT" 2>/dev/null
python3 -m http.server "$PORT"
