#!/bin/bash

#------------------------------------------------------------------------------
# Mount build-time required resources
#------------------------------------------------------------------------------

# Mount authors
rm -rf src/content/authors
rm posts-repo/authors/README.md
mv posts-repo/authors src/content/authors

# Mount avatars
rm -rf src/assets/avatars
rm posts-repo/avatars/README.md
mv posts-repo/avatars src/assets/avatars

# Mount images
rm -rf src/assets/images
rm posts-repo/images/README.md
mv posts-repo/images src/assets/images

# Mount posts
rm -rf src/content/posts/*
for FOLDER_DIR in posts-repo/posts/*; do
  if [[ -d "$FOLDER_DIR" ]]; then
    # Get folder name
    FOLDER_NAME=${FOLDER_DIR##*/}

    # Get folder name SHA256
    HASH_NAME=$(echo -n "$FOLDER_NAME" | sha256sum | awk '{print $1}')

    # Move markdown to contents collection
    mv "$FOLDER_DIR/post.md" "src/content/posts/$HASH_NAME.md"

    # Move rest folder to contents collection with ignore
    mv "$FOLDER_DIR" "src/content/posts/_$HASH_NAME"

    # Replace relative path
    sed -i "s#\./#\./_$HASH_NAME/#g" "src/content/posts/$HASH_NAME.md"
  fi
done

# Mount puzzles
rm -rf src/content/puzzles/*
for FOLDER_DIR in posts-repo/puzzles/*; do
  if [[ -d "$FOLDER_DIR" ]]; then
    # Get folder name
    FOLDER_NAME=${FOLDER_DIR##*/}

    # Get folder name SHA256
    HASH_NAME=$(echo -n "$FOLDER_NAME" | sha256sum | awk '{print $1}')

    # Move markdown to contents collection
    mv "$FOLDER_DIR/puzzle.md" "src/content/puzzles/$HASH_NAME.md"

    # Move rest folder to contents collection with ignore
    mv "$FOLDER_DIR" "src/content/puzzles/_$HASH_NAME"

    # Replace relative path
    sed -i "s#\./#\./_$HASH_NAME/#g" "src/content/puzzles/$HASH_NAME.md"
  fi
done

# Mount time capsules
rm -rf public/pool
rm -rf time-capsules-repo/pool/_*
mv time-capsules-repo/pool public/pool
