#!/bin/bash
set -e

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [ -n "$1" ]; then
  CONN="$1"
elif [ -f "$ROOT/.env" ]; then
  CONN="$(grep '^DATABASE_URL=' "$ROOT/.env" | cut -d '=' -f2- | tr -d '"')"
else
  echo "Usage: ./scripts/db-setup.sh '<connection-string>'"
  echo "       or create a .env file with DATABASE_URL set (see .env.example)"
  exit 1
fi

echo "Running schema setup..."

docker run --rm postgres:alpine psql "$CONN" -c "
  CREATE TABLE IF NOT EXISTS notes (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    title       TEXT        NOT NULL,
    content     TEXT        NOT NULL DEFAULT '',
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
"

echo "Done."
