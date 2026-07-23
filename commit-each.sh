#!/usr/bin/env bash

REMOTE_URL="https://github.com/rahmanashis/supabase-appwrite.git"
BRANCH=$(git branch --show-current 2>/dev/null || echo "development")

# Add remote only if it doesn't already exist
git remote get-url origin >/dev/null 2>&1 || git remote add origin "$REMOTE_URL"

echo "Branch: $BRANCH"
echo "Remote: $(git remote get-url origin)"

# 1. Commit directories first
for d in $(find . -maxdepth 2 -type d -not -path '*/.git*' -not -path '.' | sort); do
  rel="${d#./}"
  echo "-----------------------------------"
  echo "Adding directory: $rel"
  git add "$rel" && git commit -m "$rel" || echo "Skipped/empty: $rel"
done

# 2. Commit files one by one
for f in $(find . -maxdepth 2 -type f -not -path '*/.git/*' | sort); do
  rel="${f#./}"
  echo "-----------------------------------"
  echo "Adding file: $rel"
  git add "$rel" && git commit -m "$rel" || echo "Skipped/empty: $rel"
done

# 3. Push
echo "-----------------------------------"
echo "Pushing branch $BRANCH to origin..."
git push origin "$BRANCH"

echo "Done."
