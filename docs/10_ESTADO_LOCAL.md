# TAKYA: diagnóstico y puesta en marcha local

Fecha: 18 de octubre de 2026. Alcance: esta descarga en `/home/dani/proyectos/takya-main`.

## Resultado

La base ya contiene un prototipo de práctica funcional. No es necesario rehacer la interfaz para comenzar la lógica: existe un modelo de dominio separado de React, validación de datos y un recorrido completo sobre videos grabados.

Se instalaron las dependencias del `package-lock.json` sin actualizar sus versiones. Entorno comprobado: Node.js 22.23.3 y npm 10.9.9. Next.js 16.3.6 requiere Node.js 20.9 como mínimo. `.nvmrc` propone Node.js 22 y `package.json` declara el mínimo compatible.

Esta carpeta es una descarga sin `.git`: no tiene ramas, historial ni remoto configurado. No se inicializó ni publicó un repositorio. Antes de recuperar el control de versiones, conservar esta copia y comparar con el repositorio de origen.

## Arranque

```bash
cd /home/dani/proyectos/takya-main
npm ci
npm run dev
```

Las dependencias ya están instaladas; normalmente basta con `npm run dev`. Si usas nvm, `nvm use` selecciona la versión declarada siempre que esté instalada. No se instalaron paquetes globales ni se modificaron servicios del sistema.

- Entrada: <http://127.0.0.1:3000/> → `/home`.
- Presentación: <http://127.0.0.1:3000/landing>.
- Acceso de práctica: <http://127.0.0.1:3000/login>.
- Consola: `/demo`, después de entrar a la práctica.

Desarrollo escucha solo en `127.0.0.1` y actualiza los cambios automáticamente. Detener con `Ctrl+C`. Si el puerto 3000 está ocupado, usar `npm run dev -- --port 3001`; no terminar otros procesos para liberar el puerto.

Para ejecutar la versión compilada, detener desarrollo y usar:

```bash
npm run build
npm run start:local
```

La instalación y la primera compilación necesitan conexión: las fuentes actuales usan `next/font/google`. Los videos se sirven desde esta carpeta.

## Qué existe y qué falta

| Área | Estado comprobado en el código | Límite actual |
| --- | --- | --- |
| Interfaz | Next.js App Router, React, TypeScript, Tailwind, Motion y mascota Three.js | Conservar la separación por feature al ampliar |
| Casos | Modelo puro con comandos, transiciones y validación Zod | Casos de práctica; no hay API de casos ni base de datos |
| Evidencia | Seis clips H.264 con posters y momentos preparados | No hay cámaras conectadas ni análisis automático del video |
| Decisiones | Observar fuentes → comprender → verificar, escalar o descartar con motivo | Acciones locales; no despachan recursos |
| Supervisión | Puede recibir una derivación dentro de la misma práctica | Cambiar rol es navegación simulada, sin permisos reales |
| Persistencia | Casos, preferencias e historial en `localStorage`; acceso/perfil en `sessionStorage` | No hay sincronización entre dispositivos ni auditoría protegida en servidor |
| K8 sin clave | Guías de la consola y botón Guíame con respuestas curadas | No es una respuesta generada por IA |
| K8 con Groq | Ruta de servidor con validación, control de origen, límites y guías recuperadas | Necesita `GROQ_API_KEY`; no se configuró ni verificó una llamada real al proveedor |

Para habilitar Groq, copiar `.env.example` a `.env.local`, completar la clave privada y reiniciar el servidor. La plantilla está vacía y `.env.local` permanece ignorado por Git. Sin clave, las consultas libres muestran indisponibilidad y conservan el texto para reintentar; el resto de la consola funciona.

## Mapa para construir la lógica

| Punto de entrada | Responsabilidad |
| --- | --- |
| `src/features/demo/schemas/simulation.ts` | Contratos de casos, perfiles, decisiones e historial |
| `src/features/demo/model/simulation.ts` | Transiciones, invariantes, restauración y métricas |
| `src/features/demo/model/cognitive.ts` | Evaluación estructurada y referencias a evidencia |
| `src/features/demo/hooks/useDemoSession.ts` | Adaptación de React al modelo y almacenamiento local |
| `src/features/demo/components/ReviewWorkspace.tsx` | Recorrido visual de revisión |
| `src/features/demo/data/scenarios.ts` y `media.ts` | Escenarios y evidencia preparada |
| `src/app/api/k8/chat/route.ts` | Frontera HTTP del chat |
| `src/features/demo/server/` | Corpus documental y llamada privada a Groq |

Siguiente incremento recomendado: construir persistencia y API de casos alrededor del modelo actual. Mantener la validación en servidor, introducir identidad y permisos de servidor, y registrar cada transición junto con su autor. Criterio de aceptación: dos sesiones autorizadas deben compartir el mismo caso, impedir decisiones incompatibles y conservar su historial tras reiniciar el servidor. Después conectar ingestión de eventos y evidencia real; incorporar inferencia cuando exista evidencia evaluable. No se eligió una base de datos ni se añadió infraestructura sin definir ese alcance.

## Correcciones de esta puesta en marcha

1. Desarrollo y arranque compilado local con escucha en loopback; versión de Node y entorno opcional documentados.
2. El chat comparaba Origin con una URL que Next.js normaliza a `localhost`. El navegador en `127.0.0.1` recibía 403 incluso enviando desde el mismo sitio. Ahora compara el protocolo y el Host de la solicitud, sin confiar en `x-forwarded-host`; otros dominios, puertos y protocolos siguen rechazados. Se añadieron pruebas de regresión.
3. El cargador del servidor omitía la sexta guía, sobre Historial, Cámaras y navegación. Servidor y pruebas comparten ahora un manifiesto del corpus y una prueba detecta futuras omisiones.
4. README actualizado para reflejar la redirección real a `/home`, los requisitos y los límites de configuración local.

## Verificación

- `npm run typecheck`: correcto.
- `npm run lint`: correcto.
- `npm run test:demo`: correcto; ejecución individual adicional confirma 31 pruebas: 16 del dominio y 15 del chat.
- `npm run build`: compilación de producción verificada; rutas públicas y API del chat generadas.
- `ffprobe`: video de portada y seis clips de incidentes legibles; duraciones y dimensiones coinciden con el manifiesto.
- Navegador Brave headless con perfil temporal: acceso sin sesión redirige a Login; entrada como Operador; reproducción de los seis clips; bloqueo de Comprender hasta revisar todas las fuentes; motivos obligatorios; decisiones Verificar, Escalar y Descartar; recepción por Supervisión; historial y recuperación tras recargar; volver a observar sin cambiar la decisión. Recorrido completo correcto, sin excepciones JavaScript ni recursos con errores HTTP inesperados.
- Inicio comprobado a 320, 390 y 768 px sin desborde horizontal. Guíame funciona sin llamadas al proveedor; una consulta sin clave conserva su texto y muestra el aviso esperado.
- API real local: cuerpo inválido → 400; tema ajeno → respuesta curada 200; consulta sin proveedor → 503; origen externo → 403. El mismo origen funciona tanto con `localhost` como con `127.0.0.1`.
- `npm run format:check`: cinco archivos preexistentes con observaciones; no se reformatearon componentes ajenos a esta tarea. Los archivos de código modificados se verificaron con Prettier.

Capturas locales en `.qa/local-dashboard.png`, `.qa/local-history.png` y `.qa/local-mobile.png` (esta última, de 768 px). `.qa` está ignorada por Git. El recorrido automatizado local usa el navegador y herramientas disponibles en esta máquina; no se añadió una dependencia permanente de automatización al proyecto.

Las pruebas locales no certifican uso operativo. Siguen pendientes autenticación, permisos, persistencia de servidor, integración CCTV e inferencia. El enlace comercial de WhatsApp conserva un número de ejemplo. La documentación anterior de ENGRAM y README describe comprobaciones de otras entregas; no se toma como evidencia de esta máquina.
