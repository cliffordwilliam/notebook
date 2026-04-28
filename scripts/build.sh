#!/bin/bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cleanup() {
  echo -e "\nStopping..."
  docker compose -f "$ROOT/compose.yaml" down --rmi local
  docker image prune -f 2>/dev/null || true
  echo "Clean."
}

trap cleanup SIGINT SIGTERM

docker compose -f "$ROOT/compose.yaml" up --build -d

echo ""
echo "Serving on http://localhost:8080 — press Ctrl+C to stop."
echo ""

if command -v xdg-open &>/dev/null; then
  xdg-open "http://localhost:8080"
elif command -v open &>/dev/null; then
  open "http://localhost:8080"
else
  echo "Open in browser: http://localhost:8080"
fi

docker compose -f "$ROOT/compose.yaml" logs -f || true

cleanup
