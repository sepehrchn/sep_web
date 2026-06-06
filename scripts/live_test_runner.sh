#!/usr/bin/env bash
set -euo pipefail
rm -f /tmp/sep_web_dev.pid
#!/usr/bin/env bash
set -euo pipefail

# Load local env if exists (won't print values)
if [ -f .dev.vars ]; then
  set -a
  # shellcheck disable=SC1091
  source .dev.vars
  set +a
fi

# Default server URL (Vite shows port 8080 in this project)
SERVER_URL=${SERVER_URL:-http://localhost:8080}

echo "Starting dev server in background..."
npm run dev > /tmp/sep_web_dev.log 2>&1 &
echo $! > /tmp/sep_web_dev.pid

# Wait for server to start (simple sleep)
sleep 6

echo "--- Dev server log tail ---"
tail -n 200 /tmp/sep_web_dev.log || true

# Function to issue a POST and show first 200 chars
post_stream() {
  local payload=$1
  echo "\nRequest payload: ${payload}"
  echo "Response (first 200 chars):"
  curl -s -N -X POST "${SERVER_URL}/api/chat" -H 'Content-Type: application/json' -d "${payload}" | head -c 200 || true
  echo "\n---"
}

# 1) General greeting
post_stream '{"messages":[{"role":"user","content":"Hi there"}]}'

# 2) Website inquiry
post_stream '{"messages":[{"role":"user","content":"I need a new website for my agency, about 2 months timeline, budget $20k"}]}'

# 3) AI project inquiry
post_stream '{"messages":[{"role":"user","content":"We want to add an AI chatbot to our docs to automate support. Is that possible?"}]}'

# 4) Pricing question
post_stream '{"messages":[{"role":"user","content":"How much do you charge for a full redesign?"}]}'

# 5) Long conversation
post_stream '{"messages":[{"role":"user","content":"We have an old monolith and need a new frontend."},{"role":"user","content":"Timeline is around 8 weeks."},{"role":"user","content":"Budget around $35k"},{"role":"user","content":"My name is Alex and company is BrightApps"}]}'

# 6) Invalid request
echo "\nInvalid request test (expect 400):"
curl -s -X POST "${SERVER_URL}/api/chat" -H 'Content-Type: application/json' -d '{}' || true

echo "\nStopping dev server..."
kill "$(cat /tmp/sep_web_dev.pid)" || true
rm -f /tmp/sep_web_dev.pid

echo "Done."
