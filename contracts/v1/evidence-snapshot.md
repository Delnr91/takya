# Interfaz Astra ↔ Opus: `EvidenceSnapshot` (directorio, sin dependencias de lenguaje)

El coordinador (código de Astra) congela UNA revisión coherente del caso en un directorio privado y llama a la función pura de Opus. Opus no importa nada de `api/`, `application/` ni `runtime/`.

```text
snapshot/                       (0700, solo lectura para build_package)
  meta.json                     { package_id, incident_id, incident_revision, source_id, created_at, level_requested: "E1"|"E2" }
  sources/source.mp4            bytes recibidos, intactos
  derivatives/clip.mp4          opcional (si mapping_proven)
  derivatives/still-*.png       opcional, hasta 3 limpias; overlays como still-*-overlay.png
  analysis.json                 observaciones + incidente (schemas observation / analysis-incident)
  decision.json                 opcional; schema decision-record. Ausente ⇒ review_status SOURCE_RECEIVED_NO_HUMAN_REVIEW
  session-log.jsonl             acciones del ejercicio
  transformations.json          lista según schema evidence-manifest.transformations
```

```python
# backend/takya/evidence/api.py  (propiedad de Opus)
def build_package(snapshot_dir: Path, out_dir: Path, *, signer: Signer, key_provider: KeyProvider | None) -> PackageResult: ...
def verify_package(package_path: Path, *, trusted_public_key: bytes, recovery_key: bytes | None) -> VerificationReport: ...
```

- Escribe en un directorio de trabajo privado; verifica; publica de forma atómica (renombre). Nunca deja `.part` ni parciales como «listo».
- `verify_package` y el verificador CLI offline comparten solo el formato, no código de generación.
- Las claves jamás se imprimen, loguean, ni van dentro del paquete ni a `localStorage`.
- Alterar cualquier byte, faltantes, extras, traversal, symlinks, clave/tag/AAD/ciphertext incorrectos, o clave pública reemplazada ⇒ el verificador falla.
