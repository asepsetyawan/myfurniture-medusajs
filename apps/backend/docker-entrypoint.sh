#!/bin/sh
set -e

if [ "$MEDUSA_WORKER_MODE" = "server" ]; then
  npm run predeploy
fi

exec npm run start
