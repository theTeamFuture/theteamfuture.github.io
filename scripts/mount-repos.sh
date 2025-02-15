#!/bin/bash

#------------------------------------------------------------------------------
# Mount build-time required resources
#------------------------------------------------------------------------------

# Skip local
if [[ "$GITHUB_ACTIONS" != "true" ]]; then
  echo "[mount-repos] Skip mounting on local build"
  exit 0
fi

# Mount authors
rm -rf contents/authors
rm posts-repo/authors/README.md
mv posts-repo/authors contents/authors
echo "[mount-repos] Authors mounted"

# Mount avatars
rm -rf src/assets/avatars
rm posts-repo/avatars/README.md
mv posts-repo/avatars src/assets/avatars
echo "[mount-repos] Avatars mounted"

# Mount images
rm -rf src/assets/images
rm posts-repo/images/README.md
mv posts-repo/images src/assets/images
echo "[mount-repos] Images mounted"

# Mount posts
rm -rf contents/posts/*
for FOLDER_DIR in posts-repo/posts/*; do
  if [[ -d "$FOLDER_DIR" ]]; then
    # Get folder name
    FOLDER_NAME=${FOLDER_DIR##*/}

    # Get folder name SHA256
    HASH_NAME=$(echo -n "$FOLDER_NAME" | sha256sum | awk '{print $1}')

    # Move markdown to contents collection
    mv "$FOLDER_DIR/post.md" "contents/posts/$HASH_NAME.md"

    # Move rest folder to contents collection with ignore
    mv "$FOLDER_DIR" "contents/posts/_$HASH_NAME"

    # Replace relative path
    sed -i "s#\./#\./_$HASH_NAME/#g" "contents/posts/$HASH_NAME.md"
  fi
done
echo "[mount-repos] Posts mounted"

# Mount puzzles
rm -rf contents/puzzles/*
for FOLDER_DIR in posts-repo/puzzles/*; do
  if [[ -d "$FOLDER_DIR" ]]; then
    # Get folder name
    FOLDER_NAME=${FOLDER_DIR##*/}

    # Get folder name SHA256
    HASH_NAME=$(echo -n "$FOLDER_NAME" | sha256sum | awk '{print $1}')

    # Move markdown to contents collection
    mv "$FOLDER_DIR/puzzle.md" "contents/puzzles/$HASH_NAME.md"

    # Move rest folder to contents collection with ignore
    mv "$FOLDER_DIR" "contents/puzzles/_$HASH_NAME"

    # Replace relative path
    sed -i "s#\./#\./_$HASH_NAME/#g" "contents/puzzles/$HASH_NAME.md"
  fi
done
echo "[mount-repos] Puzzles mounted"

# Mount time capsules
rm -rf public/pool
rm -rf time-capsules-repo/pool/_*
mv time-capsules-repo/pool public/pool
echo "[mount-repos] Time capsules mounted"
