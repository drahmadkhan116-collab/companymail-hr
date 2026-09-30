#!/bin/bash
# Prepares Claude Code on the web sessions: installs the `geo` CLI used by the
# geo-optimizer skill and the app's npm dependencies.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

# geo CLI (geo-optimizer skill). Skip if already installed.
if ! command -v geo >/dev/null 2>&1; then
  if command -v uv >/dev/null 2>&1; then
    uv tool install --quiet geo-optimizer-skill
  else
    python3 -m pip install --quiet --user geo-optimizer-skill
  fi
fi

# Make user-level tool installs visible to the session.
echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$CLAUDE_ENV_FILE"

# App dependencies (npm install reuses the cached node_modules).
npm install --no-audit --no-fund
