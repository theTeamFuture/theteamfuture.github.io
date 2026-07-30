set -euo pipefail

read -r TAG_TIME ISO_TIME <<< "$(date -u +'%Y%m%d%H%M%S %Y-%m-%dT%H:%M:%SZ')"
TAG_NAME="v-$TAG_TIME"

git tag -a "$TAG_NAME" -m "release: $ISO_TIME"
echo "Created tag $TAG_NAME"
