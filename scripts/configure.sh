#!/bin/bash
#
# configure.sh - Updates command frontmatter with model preferences
#
# Usage:
#   ./configure.sh <plan-model> <document-model> <review-model>
#
# Models: inherit, haiku, sonnet, opus
# "inherit" removes the model line (uses conversation model)
#
# Example:
#   ./configure.sh inherit sonnet opus
#

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
COMMANDS_DIR="$SCRIPT_DIR/../commands"

MODEL_PLAN="${1:-inherit}"
MODEL_DOCUMENT="${2:-inherit}"
MODEL_REVIEW="${3:-inherit}"

# Validate model values
validate_model() {
  local model="$1"
  local name="$2"
  case "$model" in
    inherit|haiku|sonnet|opus) ;;
    *)
      echo "Error: Invalid model '$model' for $name. Use: inherit, haiku, sonnet, opus"
      exit 1
      ;;
  esac
}

validate_model "$MODEL_PLAN" "plan"
validate_model "$MODEL_DOCUMENT" "document"
validate_model "$MODEL_REVIEW" "review"

# Update model in frontmatter
# Args: file, model
update_model() {
  local file="$1"
  local model="$2"

  if [[ ! -f "$file" ]]; then
    echo "Warning: File not found: $file"
    return
  fi

  # Read file content
  local content
  content=$(cat "$file")

  if [[ "$model" == "inherit" ]]; then
    # Remove model line if exists
    echo "$content" | grep -v '^model:' > "$file"
    echo "  $(basename "$file"): model removed (inherit)"
  else
    if echo "$content" | grep -q '^model:'; then
      # Update existing model line
      echo "$content" | sed "s/^model:.*/model: $model/" > "$file"
      echo "  $(basename "$file"): model updated to $model"
    else
      # Add model line after allowed-tools (or after description if no allowed-tools)
      # Using awk for reliable multi-line handling
      awk -v model="$model" '
        /^allowed-tools:/ && !added {
          print
          print "model: " model
          added = 1
          next
        }
        /^description:/ && !has_allowed {
          print
          # Check if next line is allowed-tools
          if (getline nextline > 0) {
            if (nextline ~ /^allowed-tools:/) {
              print nextline
              print "model: " model
              added = 1
              has_allowed = 1
            } else {
              if (!added) {
                print "model: " model
                added = 1
              }
              print nextline
            }
          }
          next
        }
        { print }
      ' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
      echo "  $(basename "$file"): model added as $model"
    fi
  fi
}

echo "Updating command models..."
echo ""

update_model "$COMMANDS_DIR/plan.md" "$MODEL_PLAN"
update_model "$COMMANDS_DIR/document.md" "$MODEL_DOCUMENT"
update_model "$COMMANDS_DIR/review.md" "$MODEL_REVIEW"

echo ""
echo "Configuration complete."
echo ""
echo "Current settings:"
echo "  plan:     $MODEL_PLAN"
echo "  document: $MODEL_DOCUMENT"
echo "  review:   $MODEL_REVIEW"

# Create marker file to indicate plugin has been configured
touch "$SCRIPT_DIR/../.configured"
