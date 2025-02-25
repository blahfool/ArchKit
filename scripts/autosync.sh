#!/bin/bash

# Log file for sync operations
LOG_FILE="git-sync.log"

# Function to log messages
log_message() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Ensure we're in the repository root
cd "$(dirname "$0")/.." || exit 1

# Configure git locally (without --global flag)
if [ -z "$(git config user.email)" ]; then
  git config user.email "${REPL_OWNER}@users.noreply.github.com"
  git config user.name "${REPL_OWNER}"
  log_message "Configured local git user settings"
fi

# Main sync function
sync_changes() {
  log_message "Starting sync process..."

  # Check if there are changes to commit
  if git status --porcelain | grep -q '^'; then
    git add --all
    git commit -m "Auto-sync: Changes from Replit [skip ci]"

    if git push origin main; then
      log_message "Successfully pushed changes to GitHub"
    else
      log_message "Error: Failed to push changes to GitHub"
      return 1
    fi
  else
    log_message "No changes to sync"
  fi
}

# Run sync process
sync_changes