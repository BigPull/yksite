#!/bin/sh
set -e

echo "==> YKsystems Startup"

# Prisma-CLI direkt ansprechen (kein npx → kein Netzwerk-/Install-Versuch im Container).
PRISMA_BIN="node_modules/prisma/build/index.js"

# Auf die Datenbank warten und Schema synchronisieren (Retry, da PostgreSQL evtl. noch hochfährt).
echo "==> Warte auf Datenbank und synchronisiere Schema ..."
RETRIES=30
until node "$PRISMA_BIN" db push --skip-generate >/tmp/prisma.log 2>&1; do
  RETRIES=$((RETRIES - 1))
  if [ "$RETRIES" -le 0 ]; then
    echo "!! Datenbank nicht erreichbar. Letzte Ausgabe:"
    cat /tmp/prisma.log
    exit 1
  fi
  echo "   ... DB noch nicht bereit, neuer Versuch ($RETRIES) in 2s"
  sleep 2
done
echo "==> Schema synchronisiert (prisma db push)."

# Idempotentes Seeding (Admin + Standard-Systeme), plain JS ohne tsx.
echo "==> Seeding ..."
node prisma/seed.mjs || echo "!! Seeding übersprungen/fehlgeschlagen (siehe Log)."

echo "==> Starte Anwendung ..."
exec "$@"
