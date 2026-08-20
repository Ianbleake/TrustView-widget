#!/bin/sh
set -e

BUNDLE="/usr/share/nginx/html/trustview-widget.bundle.js"

if [ -z "$WIDGET_API_URL" ]; then
  echo "WARNING: WIDGET_API_URL env var is not set. Widget will not function."
else
  echo "Injecting WIDGET_API_URL=$WIDGET_API_URL into bundle"
  sed -i "s|__WIDGET_API_BASE_URL__|$WIDGET_API_URL|g" "$BUNDLE"
fi

exec nginx -g "daemon off;"