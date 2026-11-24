#!/bin/bash
# Kassani Chrome'da ochadi: cheklar chop etish oynasisiz, to'g'ridan-to'g'ri
# asosiy (default) printerga chiqadi (--kiosk-printing).
cd "$(dirname "$0")"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ ! -x "$CHROME" ]; then
  echo "Google Chrome topilmadi. Uni o'rnating yoki ./start.sh dan foydalaning."
  exit 1
fi

# Server ishlamayotgan bo'lsa — ishga tushiramiz
SERVER_PID=""
if ! curl -s -o /dev/null http://localhost:3000/; then
  node server.js &
  SERVER_PID=$!
  sleep 1
fi

# Alohida profil — shunda --kiosk-printing har doim ishlaydi
"$CHROME" --kiosk-printing --app=http://localhost:3000 \
  --user-data-dir="$HOME/.kafe-pos-chrome" --no-first-run >/dev/null 2>&1 &

if [ -n "$SERVER_PID" ]; then
  echo "Kassa ishlayapti: http://localhost:3000  (to'xtatish: Ctrl+C)"
  wait "$SERVER_PID"
fi
