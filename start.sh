#!/bin/bash
# Kafe Pro — Mac / Linux uchun ishga tushirish (server + brauzer)
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js o'rnatilmagan. https://nodejs.org dan LTS versiyani o'rnating."
  exit 1
fi

(sleep 2 && open "http://localhost:3000" 2>/dev/null || xdg-open "http://localhost:3000" 2>/dev/null) &
node server.js
