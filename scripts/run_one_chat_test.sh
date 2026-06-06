#!/usr/bin/env bash
set -euo pipefail

# Load local env if exists (won't print values)
if [ -f .dev.vars ]; then
  set -a
  # shellcheck disable=SC1091
  source .dev.vars
  set +a
fi

npm run dev > /tmp/sep_web_dev.log 2>&1 &
echo $! > /tmp/sep_web_dev.pid
sleep 5

echo "-- tail of dev log --"
tail -n 200 /tmp/sep_web_dev.log || true

echo "\nWriting payload to /tmp/payload.json"
cat > /tmp/payload.json <<'JSON'
{"messages":[{"role":"user","content":"Test connectivity"}]}
JSON

echo "\nMaking single test request..."
curl -s -N -X POST http://localhost:8080/api/chat -H "Content-Type: application/json" -d @/tmp/payload.json || true

echo "\n-- server log entries (recent) --"
tail -n 200 /tmp/sep_web_dev.log || true

echo "Stopping server..."
kill "$(cat /tmp/sep_web_dev.pid)" || true
rm -f /tmp/sep_web_dev.pid

echo "Done."
