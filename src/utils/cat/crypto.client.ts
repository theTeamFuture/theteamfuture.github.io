// --- Helpers ---
export function decodeB64(value: string, output?: "arraybuffer"): ArrayBuffer;
export function decodeB64(value: string, output: "blob"): Blob;
export function decodeB64(
  value: string,
  output: "arraybuffer" | "blob" = "arraybuffer",
) {
  const binary = atob(value);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);

  bytes.set(Uint8Array.from(binary, (character) => character.charCodeAt(0)));

  return output === "blob" ? new Blob([buffer]) : buffer;
}

export function sha256(
  value: string,
  output?: "arraybuffer",
): Promise<ArrayBuffer>;
export function sha256(value: string, output: "hex"): Promise<string>;
export async function sha256(
  value: string,
  output: "arraybuffer" | "hex" = "arraybuffer",
): Promise<ArrayBuffer | string> {
  const hash = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value),
  );
  return output === "arraybuffer"
    ? hash
    : Array.from(new Uint8Array(hash), (byte) =>
        byte.toString(16).padStart(2, "0"),
      ).join("");
}
