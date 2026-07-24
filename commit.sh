#!/usr/bin/env bash

set -Eeuo pipefail

REMOTE_URL="https://github.com/rahmanashis/supabase-appwrite.git"
EXPECTED_BRANCH="development"
BRANCH="$(git branch --show-current)"

if [ "$BRANCH" != "$EXPECTED_BRANCH" ]; then
  echo "Error: expected branch '$EXPECTED_BRANCH', but current branch is '$BRANCH'."
  exit 1
fi

# Configure origin only when it does not exist.
if ! git remote get-url origin >/dev/null 2>&1; then
  git remote add origin "$REMOTE_URL"
fi

ACTUAL_REMOTE="$(git remote get-url origin)"

if [ "$ACTUAL_REMOTE" != "$REMOTE_URL" ]; then
  echo "Error: origin points to an unexpected repository."
  echo "Expected: $REMOTE_URL"
  echo "Actual:   $ACTUAL_REMOTE"
  exit 1
fi

echo "Branch: $BRANCH"
echo "Remote: $ACTUAL_REMOTE"
echo

TMP_FILE="$(mktemp)"
trap 'rm -f "$TMP_FILE"' EXIT

# Capture all tracked changes relative to HEAD:
# - modified
# - staged
# - unstaged
# - deleted
git diff --name-only -z HEAD >> "$TMP_FILE"

# Capture new untracked files while respecting .gitignore.
git ls-files --others --exclude-standard -z >> "$TMP_FILE"

# Sort and remove duplicate paths.
mapfile -d '' CHANGED_FILES < <(sort -zu "$TMP_FILE")

if [ "${#CHANGED_FILES[@]}" -eq 0 ]; then
  echo "No modified, deleted, staged, or untracked files found."
  exit 0
fi

echo "Files that will receive individual commits:"
printf '  - %s\n' "${CHANGED_FILES[@]}"
echo

for path in "${CHANGED_FILES[@]}"; do
  [ -z "$path" ] && continue

  directory="$(dirname "$path")"
  filename="$(basename "$path")"

  echo "--------------------------------------------------"
  echo "Directory: $directory"
  echo "Processing: $path"

  # Determine the change type before staging.
  if [ ! -e "$path" ] && git ls-files --error-unmatch -- "$path" >/dev/null 2>&1; then
    action="Remove"
  elif git ls-files --error-unmatch -- "$path" >/dev/null 2>&1; then
    action="Update"
  else
    action="Add"
  fi

  # Create a descriptive message from location and filename.
  case "$path" in
    package.json)
      message="$action project dependencies: $filename"
      ;;
    package-lock.json)
      message="$action package lockfile: $filename"
      ;;
    .gitignore)
      message="$action Git ignore rules: $filename"
      ;;
    README.md)
      message="$action project documentation: $filename"
      ;;
    docs/diagrams/*.mmd)
      message="$action architecture diagram: $filename"
      ;;
    docs/*.md)
      message="$action documentation: $filename"
      ;;
    src/components/auth/*.jsx)
      message="$action authentication component: $filename"
      ;;
    src/components/auth/*.js)
      message="$action authentication module: $filename"
      ;;
    src/components/dashboard/*.jsx)
      message="$action dashboard component: $filename"
      ;;
    src/components/dashboard/*.js)
      message="$action dashboard data module: $filename"
      ;;
    src/components/layout/*.jsx)
      message="$action layout component: $filename"
      ;;
    src/components/services/*.jsx)
      message="$action service component: $filename"
      ;;
    src/components/services/*.css)
      message="$action service styles: $filename"
      ;;
    src/components/ui/*.jsx)
      message="$action reusable UI component: $filename"
      ;;
    src/hooks/*.js)
      message="$action React hook: $filename"
      ;;
    src/constants/*.js)
      message="$action application constants: $filename"
      ;;
    src/lib/*.js)
      message="$action library integration: $filename"
      ;;
    src/utils/*.js)
      message="$action utility module: $filename"
      ;;
    *.jsx)
      message="$action React component: $filename"
      ;;
    *.js)
      message="$action JavaScript module: $filename"
      ;;
    *.css)
      message="$action styles: $filename"
      ;;
    *.json)
      message="$action configuration: $filename"
      ;;
    *.md)
      message="$action documentation: $filename"
      ;;
    *.mmd)
      message="$action Mermaid diagram: $filename"
      ;;
    *.sh)
      message="$action shell script: $filename"
      ;;
    *)
      message="$action file: $filename"
      ;;
  esac

  # -A is required so deleted files are staged correctly.
  git add -A -- "$path"

  # Skip only if this particular path produced no staged change.
  if git diff --cached --quiet -- "$path"; then
    echo "Skipped because there is no staged change: $path"
    continue
  fi

  git commit \
    -m "$message" \
    -m "Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"

  echo "Committed: $message"
done

echo
echo "--------------------------------------------------"

# Refuse to push if any changes remain.
if [ -n "$(git status --porcelain)" ]; then
  echo "Error: some working-tree changes remain after processing."
  git status --short
  echo "Nothing was pushed. Review the remaining changes first."
  exit 1
fi

echo "Pushing all commits to origin/$BRANCH..."
git push origin "$BRANCH"

echo
echo "Done. Every current changed file received its own commit."
