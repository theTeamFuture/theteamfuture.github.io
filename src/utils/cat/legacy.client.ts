import { decodeB64, sha256 } from "./crypto.client";

// --- Helpers ---
export const queryLegacy = async (id: string, pass: string) => {
  // --- Get asset ID ---
  const assetId = await sha256(
    (await sha256(id, "hex")) + (await sha256(pass, "hex")),
    "hex",
  );

  // --- Fetch ---
  const resp = await fetch(`/cat/legacy/${assetId}.dat`, {
    method: "GET",
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
  if (!resp.ok) throw "Not Found";

  // --- File decrypt ---
  let data = await resp.text();
  data = await decrypt(data, pass);

  // --- Get file name ---
  const name = data.split("\n", 1)[0] ?? null;
  if (name === null) {
    throw "File Corrupted";
  }
  data = data.slice(name.length + 1);

  // --- Get file mime ---
  const mime = data.split("\n", 1)[0] ?? null;
  if (mime === null) {
    throw "File Corrupted";
  }
  data = data.slice(mime.length + 1);

  // --- Check mime ---
  if (mime.startsWith("text")) {
    return { type: "text", name, data };
  } else if (mime.startsWith("image")) {
    return { type: "image", name, data };
  } else if (mime.startsWith("audio")) {
    const audio = new Blob([decodeB64(data, "blob")], { type: mime });
    return {
      type: "audio",
      name,
      data: URL.createObjectURL(audio),
    };
  } else {
    return {
      type: "blob",
      name,
      data: new Blob([decodeB64(data, "blob")], { type: mime }),
    };
  }
};

const decrypt = async (raw: string, pass: string) => {
  // --- Get raw parts ---
  const parts = raw.split("\n");
  if (parts.length !== 2) {
    throw "File Corrupted";
  }

  // --- Get raw data ---
  const iv = decodeB64(parts[0]);
  const data = decodeB64(parts[1]);

  // --- Get key ---
  const rawKey = await sha256(pass);
  const key = await crypto.subtle.importKey(
    "raw",
    rawKey,
    { name: "AES-GCM" },
    false,
    ["decrypt"],
  );

  // --- Decrypt ---
  const binData = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    data,
  );
  const utf8Data = new TextDecoder().decode(binData);
  if (utf8Data.split("\n").length < 3) {
    throw "Wrong password";
  }

  return utf8Data;
};
