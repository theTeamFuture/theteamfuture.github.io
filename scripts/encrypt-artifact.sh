set -euo pipefail
set +x
umask 077

export ARTIFACT_PASSWORD="$(openssl rand -hex 32)"
export ARTIFACT_NAME="$(date +%Y%M%dT%H%M%S)-$GITHUB_RUN_ID.tar.gz.dat"

tar \
  --dereference \
  --hard-dereference \
  --force-local \
  -C dist \
  -czf - . | \
    openssl enc \
      -aes-256-cbc \
      -salt \
      -pbkdf2 \
      -iter 600000 \
      -md sha256 \
      -pass env:ARTIFACT_PASSWORD \
      -out "$ARTIFACT_NAME"

python3 <<PYTHON
import os
import smtplib
import ssl
from email.message import EmailMessage

repository = os.environ["GITHUB_REPOSITORY"]
run_id = os.environ["GITHUB_RUN_ID"]
server_url = os.environ["GITHUB_SERVER_URL"]

message = EmailMessage()
message["Subject"] = f"GitHub Pages artifact ready: {repository} ({run_id})"
message["From"] = os.environ["SMTP_FROM"]
message["To"] = os.environ["SMTP_TO"]

message.set_content(
f"""A GitHub Pages artifact was generated.

Repository: {repository}
Run ID: {run_id}
Run URL: {server_url}/{repository}/actions/runs/{run_id}
Commit: {os.environ["GITHUB_SHA"]}
Artifact: {os.environ["ARTIFACT_NAME"]}

Decryption password:
{os.environ["ARTIFACT_PASSWORD"]}

Preview command:
pnpm run preview:artifact {run_id} {os.environ["ARTIFACT_PASSWORD"]}
"""
)

with smtplib.SMTP_SSL(os.environ["SMTP_HOST"], timeout=30) as smtp:
    smtp.login(
        os.environ["SMTP_USERNAME"],
        os.environ["SMTP_PASSWORD"],
    )
    smtp.send_message(message)
PYTHON

echo "name=$ARTIFACT_NAME" >> "$GITHUB_OUTPUT"
unset ARTIFACT_PASSWORD
unset ARTIFACT_NAME
