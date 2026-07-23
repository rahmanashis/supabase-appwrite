#!/usr/bin/env bash

REMOTE_URL="https://github.com/rahmanashis/supabase-appwrite.git"
BRANCH=$(git branch --show-current 2>/dev/null || echo "development")

# Add remote only if it doesn't already exist
git remote get-url origin >/dev/null 2>&1 || git remote add origin "$REMOTE_URL"

echo "Branch: $BRANCH"
echo "Remote: $(git remote get-url origin)"

# Temporary file to collect all changed paths
TMP_FILE=$(mktemp)
trap 'rm -f "$TMP_FILE"' EXIT

# 1. Collect modified files
git diff --name-only >> "$TMP_FILE"

# 2. Collect untracked files (excluding ignored files like node_modules and dist)
git ls-files --others --exclude-standard >> "$TMP_FILE"

# 3. Sort paths so directories come before their contents
sort -t '/' -k1,1 -k2,2 "$TMP_FILE" | while IFS= read -r path; do
  [ -z "$path" ] && continue
  [ -f "$path" ] || continue  # Git does not track empty directories

  echo "-----------------------------------"
  echo "Adding file: $path"

  # Generate a commit message based on the file type
  msg="$path"
  case "$path" in
    *.jsx)        msg="Add React component: $path" ;;
    *.js)         msg="Add JavaScript module: $path" ;;
    *.css)        msg="Add styles: $path" ;;
    *.json)       msg="Update config: $path" ;;
    *.md)         msg="Update docs: $path" ;;
    *.sh)         msg="Add script: $path" ;;
    *.html)       msg="Update HTML: $path" ;;
    .claude/*)    msg="Update Claude config: $path" ;;
  esac

  git add "$path" && git commit -m "$msg" || echo "Skipped/empty: $path"
done

# 4. Push all commits to the current branch
echo "-----------------------------------"
echo "Pushing branch $BRANCH to origin..."
git push origin "$BRANCH"

echo "Done."
