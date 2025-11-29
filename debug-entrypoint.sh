#!/bin/sh
set -e

echo "=== DEBUG ENTRYPOINT START ==="
echo "Timestamp: $(date)"
echo "User: $(whoami)"
echo "Directory: $(pwd)"

echo "--- Listing files in /app ---"
ls -la

echo "--- Checking Node version ---"
node -v

echo "--- Checking server.js existence ---"
if [ -f server.js ]; then
  echo "server.js found."
else
  echo "ERROR: server.js NOT FOUND!"
  exit 1
fi

echo "--- Starting Next.js (server.js) ---"
# We use exec so that node becomes the PID 1 process
exec node server.js
