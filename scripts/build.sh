#!/bin/bash
set -e

ROOT="$(cd "$(dirname "$(readlink -f "${BASH_SOURCE[0]}")")/.." && pwd)"

cleanup() {
  echo -e "\nStopping..."
  docker compose -f "$ROOT/compose.yaml" down --rmi local
  docker image prune -f 2>/dev/null || true
  echo "Clean."
}

trap cleanup SIGINT SIGTERM

PORT=$(python3 -c "import socket; s=socket.socket(); s.bind(('', 0)); p=s.getsockname()[1]; s.close(); print(p)")
export PORT

docker compose -f "$ROOT/compose.yaml" up --build -d

echo ""
echo "notebook → http://localhost:$PORT — press Ctrl+C to stop."
echo ""

until curl -sf "http://localhost:$PORT" &>/dev/null; do
  sleep 0.2
done

if command -v xdg-open &>/dev/null; then
  xdg-open "http://localhost:$PORT"
elif command -v open &>/dev/null; then
  open "http://localhost:$PORT"
else
  echo "Open in browser: http://localhost:$PORT"
fi

docker compose -f "$ROOT/compose.yaml" logs -f || true

cleanup
