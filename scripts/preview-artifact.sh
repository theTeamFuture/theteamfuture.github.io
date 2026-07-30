set -euo pipefail

# Constants
REPO=theTeamFuture/theteamfuture.github.io

# Check arguments
if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <run-id> <decrypt-password>" >&2
  exit 1
fi

# Arguments
RUN_ID="$1"
export ARTIFACT_PASSWORD="$2"

# Create a temporary working directory and ensure it is removed on exit
WORK_DIR="$(mktemp -d -t preview-artifact-XXXXXX)"
cleanup() {
  echo
  echo "Cleaning up temporary files..."
  rm -rf "$WORK_DIR"
  unset ARTIFACT_PASSWORD
}
trap cleanup EXIT

DOWNLOAD_DIR="$WORK_DIR/download"
WWW_DIR="$WORK_DIR/www"
mkdir -p "$DOWNLOAD_DIR" "$WWW_DIR"

echo "Repository: $REPO"
echo "Run ID:     $RUN_ID"
echo "Work dir:   $WORK_DIR"

# List artifacts of the run via the REST API and download the (single) one
echo "Fetching artifact list..."
ARTIFACT_JSON="$(gh api -H "Accept: application/vnd.github+json" "/repos/$REPO/actions/runs/$RUN_ID/artifacts")"

# Extract the first artifact's id and name via jq
ARTIFACT_ID="$(printf '%s' "$ARTIFACT_JSON" | jq -r '.artifacts[0].id')"
ARTIFACT_NAME="$(printf '%s' "$ARTIFACT_JSON" | jq -r '.artifacts[0].name')"
if [[ -z "$ARTIFACT_ID" || "$ARTIFACT_ID" == "null" ]]; then
  echo "Error: no artifact found for run $RUN_ID in $REPO." >&2
  exit 1
fi
echo "Artifact:  $ARTIFACT_NAME (id: $ARTIFACT_ID)"

ARTIFACT_PATH="$DOWNLOAD_DIR/$ARTIFACT_NAME"
echo "Downloading artifact..."
gh api \
  -H "Accept: application/vnd.github+json" \
  "/repos/$REPO/actions/artifacts/$ARTIFACT_ID/zip" \
  > "$ARTIFACT_PATH"

# Decrypt and extract the tar.gz archive.
echo "Decrypting and extracting..."
openssl enc \
  -d \
  -aes-256-cbc \
  -salt \
  -pbkdf2 \
  -iter 600000 \
  -md sha256 \
  -pass env:ARTIFACT_PASSWORD \
  -in "$ARTIFACT_PATH" | \
    tar -C "$WWW_DIR" -xzf -

unset ARTIFACT_PASSWORD

# Serve the extracted site. `-c-1` disables caching so fresh builds are shown.
PORT="${PREVIEW_PORT:-8080}"
echo
echo "Preview server running at http://localhost:${PORT}"
echo "Press Ctrl+C to stop."
exec npx -y http-server "$WWW_DIR" -p "$PORT" -c-1
