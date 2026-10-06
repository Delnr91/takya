# Revisión de seguridad de la consola de práctica

Fecha: 2026-09-29. Alcance: código local de `/login` y `/demo`, sin backend ni cámaras reales. Esta revisión es de arquitectura y código; no equivale a una prueba de penetración.

## Hallazgos y medidas aplicadas

| Riesgo | Estado actual y medida |
| --- | --- |
| Confundir la pantalla de acceso con autenticación | La entrada usa un marcador de `sessionStorage` solo para guiar la navegación. `/demo` vuelve a `/login` si no existe. La interfaz identifica el modo como práctica. **El marcador y el rol se pueden alterar desde el navegador; no son seguridad real.** |
| Datos locales después de salir | «Cerrar sesión» pide confirmación, ofrece descargar el historial, elimina perfil y marcador de sesión y borra casos e historial de `localStorage`. La navegación completa descarta el estado en memoria. |
| Datos de entrada o sesión malformados | Zod valida nombre, decisiones, casos y sesión guardada. Los roles y pasos se comprueban en la máquina de estados. La respuesta de un futuro servicio cognitivo tiene contrato y valida que cite avisos del caso. |
| Inyección de HTML desde nombres o notas | React muestra texto escapado y no se usa `dangerouslySetInnerHTML`. Las notas tienen límite de 240 caracteres; los nombres, de 32. Aun así, una vulnerabilidad XSS en otra parte de la página podría leer `localStorage`. |
| Superficie del navegador | Las respuestas incluyen `nosniff`, protección contra iframe, política de referencia, prohibición de cámara/micrófono/geolocalización del navegador y directivas CSP para marcos, objetos y base URL. También se omite `X-Powered-By`. Se debe probar una CSP de scripts más estricta cuando el despliegue y sus integraciones estén definidos. |
| Registro de auditoría | Es una lista local que la interfaz agrega sin reescribir entradas. **No es un registro inmutable de valor probatorio**: cualquiera con acceso al navegador puede modificar o borrar `localStorage`. |

## Límites que bloquean uso operativo

**Actualización del 6 de octubre de 2026 — voz de K8:** la prohibición general de cámara, micrófono y geolocalización se mantiene en las rutas públicas. `/demo` permite `microphone=(self)` para el dictado activado por el botón Hablar, sujeto al permiso del usuario. Cámara y geolocalización siguen bloqueadas. Web Speech puede utilizar un servicio externo del navegador; no se afirma transcripción local. TAKYA no guarda ni envía audio, y el texto se revisa antes de enviar a Groq. No hay escucha automática; se corta al cerrar K8 y cada intento tiene un límite de 20 segundos. La revisión anterior de cabeceras describe el estado de septiembre.

1. **Identidad y permisos:** implementar autenticación institucional con MFA y sesión de servidor mediante cookie `HttpOnly`, `Secure` y `SameSite`. Verificar rol, municipio y recurso en cada lectura y acción del backend. El selector de rol de práctica debe desaparecer del entorno operativo.
2. **Datos y privacidad:** decidir dónde se procesan videos, quién puede verlos, cuánto tiempo se guardan y cómo se ocultan datos personales. Cifrar transporte y almacenamiento. No enviar fotogramas a proveedores externos sin base jurídica y acuerdo explícito.
3. **Auditoría:** almacenar eventos firmes y anexados en servidor con identidad verificada, tiempos consistentes, identificador de caso, versión de modelo y referencias a evidencia. Separar acción humana de recomendación de IA.
4. **IA:** guardar claves solo en servidor; validar tamaño, formato y origen de entradas; limitar solicitudes; tratar textos y metadatos de cámaras como datos no confiables; impedir que la salida de un modelo ejecute herramientas o cierre casos sin aprobación humana.
5. **Operación:** añadir límites de tasa, monitoreo, copias de seguridad, respuesta a incidentes y pruebas de seguridad antes de integrar cámaras o municipalidades.

No introducir usuarios reales, contraseñas, claves, grabaciones ni datos sensibles en esta demo local. La exportación JSON puede contener nombres y notas de práctica; compartirla solo cuando corresponda.
