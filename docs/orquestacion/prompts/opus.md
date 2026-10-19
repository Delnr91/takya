# Opus 5.5 — evidencia, verificador y seguridad (H5 núcleo + pruebas adversariales + revisión)

Worktree: /home/dani/proyectos/takya-wt/opus · rama: agent/opus/h5-evidence. Pega primero 00_comun.md.

Eres dueño de: backend/takya/evidence/**, verifier/**, backend/tests/evidence/**, backend/tests/security/**. No tocas runtime, api, worker ni UI.

TAREA 1 · Paquete E1/E2 y verificador offline
- Implementa según contracts/v1/evidence-snapshot.md: `build_package(snapshot_dir, out_dir, signer, key_provider)` y `verify_package(...)` como funciones puras e independientes de api/application/runtime. Sin importar nada de ellos.
- Formato: contenedor con sources/, derivatives/, manifest.json (schema evidence-manifest, serialización determinista, bytes exactos firmados), analysis.json, decision.json, session-log.jsonl, manifest.signature (Ed25519), verification.txt. Inventario: tamaño+hash de cada archivo; rechaza faltantes, extras, duplicados, traversal, symlinks, rutas absolutas; ni manifiesto ni firma se hashean a sí mismos.
- E1: firma con `cryptography`; verificación contra clave pública confiable PROVISTA POR OTRO CANAL (nunca confiar solo en la clave incluida en el paquete).
- E2: AES-256-GCM, clave aleatoria, nonce nuevo de 96 bits por cifrado, metadatos sensibles DENTRO del cifrado, AAD solo para lo visible. Presupuesto: paquete en claro ≤64 MiB; si excede, rechaza con motivo (no inventes cifrado por bloques). Mide RAM pico.
- Claves: utilidad local que escribe la clave de recuperación en archivo 0600 por operación explícita, fuera del paquete y del árbol público; jamás impresa, logueada ni a localStorage.
- Publicación atómica: generar en zona privada → verificar → renombrar. Nunca un `.part`/parcial como listo.
- Verificador CLI separado (`verifier/`), solo stdlib + `cryptography`, que opera sobre los BYTES descargados y no confía en ningún mapa del generador.
- Dependencias: `cryptography` y pytest las fija Astra en backend/requirements.lock; mientras tanto usa tu propio .venv y avisa a `astra` por el bus si necesitas algo.

TAREA 2 · Pruebas adversariales (backend/tests/evidence y security)
Original/derivado alterado; manifiesto sustituido; clave pública reemplazada; faltantes/extras/duplicados; `../`, rutas absolutas, symlinks; clave/nonce/AAD/tag/ciphertext incorrectos ⇒ ningún contenido «verificado»; paquete válido restaura bytes idénticos; disco lleno y escritura interrumpida sin parciales publicados; exportación sin decisión rotulada SOURCE_RECEIVED_NO_HUMAN_REVIEW. Para código de otros: solo escribe pruebas/informes; no edites.

TAREA 3 · Revisor de seguridad
Cuando el orquestador te lo pida, revisa la rama de Astra (ingesta, sesión, aislamiento, cancelación): informe en el bus con hallazgos ligados a una prueba que falla o invariante violada. Máximo una ronda.
