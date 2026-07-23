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

# 2. Collect untracked files (excluding ignored files like node_modules, dist)
git ls-files --others --exclude-standard >> "$TMP_FILE"

# 3. Sort so directories are grouped and files come in a logical order
sort -t '/' -k1,1 -k2,2 "$TMP_FILE" | while IFS= read -r path; do
  [ -z "$path" ] && continue
  [ -f "$path" ] || continue  # Git cannot track empty directories

  echo "-----------------------------------"
  echo "Adding file: $path"

  # Generate a commit message based on the file type and location
  msg="$path"
  case "$path" in
    .env.example)              msg="Add environment variables template: $path" ;;
    *.jsx)                     msg="Add React component: $path" ;;
    *.js)                      msg="Update JavaScript module: $path" ;;
    *.css)                     msg="Update styles: $path" ;;
    *.md)                      msg="Update documentation: $path" ;;
    package.json)              msg="Update project dependencies: $path" ;;
    package-lock.json)         msg="Update package lockfile: $path" ;;
    .claude/*)                 msg="Update Claude configuration: $path" ;;
    docs/*)                    msg="Update docs: $path" ;;
    src/lib/*)                 msg="Add library integration: $path" ;;
    src/components/auth/*)     msg="Add authentication feature: $path" ;;
    src/components/dashboard/*) msg="Add dashboard feature: $path" ;;
    src/components/layout/*)   msg="Update layout component: $path" ;;
  esac

  git add "$path" && git commit -m "$msg" || echo "Skipped/empty: $path"
done

# 4. Push all commits to the current branch
echo "-----------------------------------"
echo "Pushing branch $BRANCH to origin..."
git push origin "$BRANCH"

echo "Done."
