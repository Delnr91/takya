// Protección de evidencia en el navegador (Web Crypto), sin servidor:
//   1. Huella SHA-256 de cada clip.
//   2. Manifiesto con el caso, la decisión y las huellas, firmado con Ed25519
//      (o ECDSA P-256 si el navegador aún no soporta Ed25519).
//   3. Contenido cifrado con AES-256-GCM y ligado al manifiesto: si alguien
//      cambia un solo byte del video o del manifiesto, no se puede abrir.
// La clave de descifrado viaja aparte del paquete, como en una entrega real.

export type SealStep = "huella" | "firma" | "cifrado" | "listo";

export type SealInput = {
  caseId: string;
  title: string;
  operator: string;
  decision: { outcome: string; reason: string };
  clips: { name: string; src: string }[];
};

type Manifest = {
  caso: string;
  titulo: string;
  operador: string;
  decision: { resultado: string; motivo: string };
  emitido: string;
  herramienta: string;
  clips: { archivo: string; bytes: number; sha256: string }[];
};

export type EvidencePackage = {
  formato: "takya-evidencia/1";
  manifiesto: Manifest;
  firma: {
    algoritmo: "Ed25519" | "ECDSA P-256";
    clavePublica: string;
    valor: string;
  };
  cifrado: {
    algoritmo: "AES-256-GCM";
    iv: string;
    largos: number[];
    datos: string;
  };
};

export type SealResult = {
  pkg: EvidencePackage;
  /** Clave AES en base64: se entrega por un canal distinto al paquete. */
  key: string;
  fingerprint: string;
  bytes: number;
};

export type VerifyCheck = { label: string; ok: boolean };
export type VerifyResult = { ok: boolean; checks: VerifyCheck[] };

const encoder = new TextEncoder();

function toBase64(data: ArrayBuffer | Uint8Array) {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  let text = "";
  for (let index = 0; index < bytes.length; index += 0x8000)
    text += String.fromCharCode(...bytes.subarray(index, index + 0x8000));
  return btoa(text);
}
function fromBase64(text: string) {
  return Uint8Array.from(atob(text), (char) => char.charCodeAt(0));
}
function toHex(data: ArrayBuffer) {
  return [...new Uint8Array(data)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
function signatureParams(algorithm: EvidencePackage["firma"]["algoritmo"]) {
  return algorithm === "Ed25519"
    ? { generate: { name: "Ed25519" }, use: { name: "Ed25519" } }
    : {
        generate: { name: "ECDSA", namedCurve: "P-256" },
        use: { name: "ECDSA", hash: "SHA-256" },
      };
}

async function signingKeys() {
  for (const algorithm of ["Ed25519", "ECDSA P-256"] as const) {
    try {
      const params = signatureParams(algorithm);
      const keys = (await crypto.subtle.generateKey(params.generate, true, [
        "sign",
        "verify",
      ])) as CryptoKeyPair;
      return { keys, algorithm };
    } catch {
      /* Navegador sin Ed25519: se usa ECDSA P-256. */
    }
  }
  throw new Error("Este navegador no permite firmar evidencia.");
}

export async function sealEvidence(
  input: SealInput,
  onStep?: (step: SealStep) => void,
): Promise<SealResult> {
  if (!globalThis.crypto?.subtle)
    throw new Error("Abre la demo con https para proteger la evidencia.");
  onStep?.("huella");
  const files = await Promise.all(
    input.clips.map(async (clip) => {
      const response = await fetch(clip.src);
      if (!response.ok) throw new Error(`No se pudo leer ${clip.name}.`);
      const data = new Uint8Array(await response.arrayBuffer());
      const digest = toHex(await crypto.subtle.digest("SHA-256", data));
      return { name: clip.name, data, digest };
    }),
  );
  const manifest: Manifest = {
    caso: input.caseId,
    titulo: input.title,
    operador: input.operator,
    decision: {
      resultado: input.decision.outcome,
      motivo: input.decision.reason,
    },
    emitido: new Date().toISOString(),
    herramienta: "TAKYA · consola de práctica",
    clips: files.map((file) => ({
      archivo: file.name,
      bytes: file.data.byteLength,
      sha256: file.digest,
    })),
  };
  const manifestBytes = encoder.encode(JSON.stringify(manifest));
  const fingerprint = toHex(
    await crypto.subtle.digest("SHA-256", manifestBytes),
  );

  onStep?.("firma");
  const { keys, algorithm } = await signingKeys();
  const signature = await crypto.subtle.sign(
    signatureParams(algorithm).use,
    keys.privateKey,
    manifestBytes,
  );
  const publicKey = await crypto.subtle.exportKey("spki", keys.publicKey);

  onStep?.("cifrado");
  const aes = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"],
  );
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const total = files.reduce((sum, file) => sum + file.data.byteLength, 0);
  const joined = new Uint8Array(total);
  let offset = 0;
  for (const file of files) {
    joined.set(file.data, offset);
    offset += file.data.byteLength;
  }
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv, additionalData: manifestBytes },
    aes,
    joined,
  );
  const rawKey = await crypto.subtle.exportKey("raw", aes);
  onStep?.("listo");
  return {
    pkg: {
      formato: "takya-evidencia/1",
      manifiesto: manifest,
      firma: {
        algoritmo: algorithm,
        clavePublica: toBase64(publicKey),
        valor: toBase64(signature),
      },
      cifrado: {
        algoritmo: "AES-256-GCM",
        iv: toBase64(iv),
        largos: files.map((file) => file.data.byteLength),
        datos: toBase64(encrypted),
      },
    },
    key: toBase64(rawKey),
    fingerprint,
    bytes: total,
  };
}

/** Comprueba firma, descifrado y huellas: lo que haría quien recibe el paquete. */
export async function verifyEvidence(
  pkg: EvidencePackage,
  key: string,
): Promise<VerifyResult> {
  const checks: VerifyCheck[] = [];
  const manifestBytes = encoder.encode(JSON.stringify(pkg.manifiesto));
  const params = signatureParams(pkg.firma.algoritmo);
  let signatureOk = false;
  try {
    const publicKey = await crypto.subtle.importKey(
      "spki",
      fromBase64(pkg.firma.clavePublica),
      params.generate,
      false,
      ["verify"],
    );
    signatureOk = await crypto.subtle.verify(
      params.use,
      publicKey,
      fromBase64(pkg.firma.valor),
      manifestBytes,
    );
  } catch {
    signatureOk = false;
  }
  checks.push({ label: "Firma del manifiesto", ok: signatureOk });

  let plain: Uint8Array | null = null;
  try {
    const aes = await crypto.subtle.importKey(
      "raw",
      fromBase64(key),
      { name: "AES-GCM" },
      false,
      ["decrypt"],
    );
    plain = new Uint8Array(
      await crypto.subtle.decrypt(
        {
          name: "AES-GCM",
          iv: fromBase64(pkg.cifrado.iv),
          additionalData: manifestBytes,
        },
        aes,
        fromBase64(pkg.cifrado.datos),
      ),
    );
  } catch {
    plain = null;
  }
  checks.push({ label: "Contenido sin alteraciones", ok: plain !== null });

  let hashesOk = false;
  if (plain) {
    let offset = 0;
    const digests = await Promise.all(
      pkg.cifrado.largos.map((length) => {
        const part = new Uint8Array(plain.subarray(offset, offset + length));
        offset += length;
        return crypto.subtle.digest("SHA-256", part).then(toHex);
      }),
    );
    hashesOk =
      digests.length === pkg.manifiesto.clips.length &&
      digests.every(
        (digest, index) => digest === pkg.manifiesto.clips[index]?.sha256,
      );
  }
  checks.push({ label: "Huellas de los videos", ok: hashesOk });
  return { ok: checks.every((check) => check.ok), checks };
}

/** Copia del paquete con un solo byte cambiado en el video cifrado. */
export function tamperEvidence(pkg: EvidencePackage): EvidencePackage {
  const data = fromBase64(pkg.cifrado.datos);
  const index = Math.floor(data.length / 2);
  data[index] = (data[index] ?? 0) ^ 0x01;
  return { ...pkg, cifrado: { ...pkg.cifrado, datos: toBase64(data) } };
}

function download(name: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadPackage(result: SealResult) {
  download(
    `${result.pkg.manifiesto.caso}-evidencia-takya.json`,
    JSON.stringify(result.pkg, null, 2),
    "application/json",
  );
}

export function downloadKey(result: SealResult) {
  download(
    `${result.pkg.manifiesto.caso}-clave-takya.txt`,
    [
      "Clave de descifrado del paquete TAKYA (AES-256-GCM, base64).",
      "Entrégala por un canal distinto al paquete.",
      "",
      result.key,
      "",
      `Huella del manifiesto: ${result.fingerprint}`,
    ].join("\n"),
    "text/plain",
  );
}
