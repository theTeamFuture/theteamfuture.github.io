ARTIFACT_PATH=$1
export ARTIFACT_PASSWORD=$2

mkdir www
openssl enc \
  -d \
  -aes-256-cbc \
  -salt \
  -pbkdf2 \
  -iter 600000 \
  -md sha256 \
  -pass env:ARTIFACT_PASSWORD \
  -in $ARTIFACT_PATH |
    tar -C www -xzf -

unset ARTIFACT_PASSWORD
