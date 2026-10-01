<p align="center">
  <img src="public/brand/02_png_transparentes/takya-a-principal-bosque-2048.png" alt="Logotipo de TAKYA" width="250" />
</p>

# TAKYA · Comprender antes de actuar

**V2 estable de demostración · `v2.0.2`.** K8 es un perro robot 3D interactivo con ojos expresivos, parpadeo y respiración suave: haz clic para consultar, arrastra para girarlo o usa las flechas y Enter con teclado. El panel de consulta presenta un organismo luminoso sin rostro, centrado y formado por membranas fluidas que reaccionan al puntero. En Ajustes puedes activar texto grande, alto contraste, paneles sólidos y «Sin movimiento». La V2 se verificó en escritorio, móvil de 320 px y tablet de 768 px; la nueva presencia visual se revisó en escritorio y móvil.

Vitrina digital de TAKYA, una propuesta de apoyo a operadores de televigilancia mediante contexto y prioridades explicables. Proyecto desarrollado para el Programa Nómada UCN en Antofagasta.

> **Versión de demostración:** la experiencia comienza en `/landing`; `/home` también conduce al acceso de práctica. `/login` permite elegir Operador o Supervisión y `/demo` muestra la consola. Todo funciona en el navegador; no hay backend ni conexión a cámaras reales.

## Navegación rápida

[Ver la landing](#ver-la-v1) · [Probar la consola](#probar-la-consola) · [Iniciar en local](#iniciar-en-local) · [Entender el proyecto](#qué-muestra-la-landing) · [Mapa técnico](#mapa-técnico) · [Antes de compartir](#antes-de-compartir) · [Documentación](#documentación-del-equipo)

## Ver la V1

- **Entrada pública:** `/` redirige a `/landing`.
- **Contenido:** problema de la fatiga cognitiva, propuesta de TAKYA y criterio humano en la decisión.
- **Repositorio:** [Delnr91/takya](https://github.com/Delnr91/takya).

| Ruta               | Estado en esta entrega | Para qué sirve                                                                |
| ------------------ | ---------------------- | ----------------------------------------------------------------------------- |
| `/`                | Pública                | Abre la landing.                                                              |
| `/landing`         | Pública · V1           | Presentación institucional.                                                   |
| `/home`            | Disponible             | Entrada audiovisual con enlace a `/login`.                                    |
| `/login`           | Demo                    | Selección simulada de Operador o Supervisión.                                 |
| `/demo`            | Demo                    | Consola interactiva de práctica.                                              |

## Qué muestra la landing

```mermaid
flowchart LR
  A[Escala de televigilancia] --> B[Fatiga y alertas dispersas]
  B --> C[TAKYA reúne contexto]
  C --> D[Explica la prioridad]
  D --> E[El operador decide]
```

El relato usa las cifras de contexto de la documentación interna: **130 cámaras** en el sistema municipal de Antofagasta, **1.245 cámaras** como proyección regional y **50 %** como referencia citada sobre eventos no detectados por fatiga visual. La proyección no describe una red operativa actual y ninguna cifra representa un resultado medido por TAKYA.

<details>
<summary><strong>Recorrido sugerido para presentar la V1</strong></summary>

1. Abre `/landing` y explica la idea: **comprender antes de actuar**.
2. Baja a **El problema** para hablar de escala y carga de atención.
3. Muestra **La propuesta**: detectar, agrupar, explicar, verificar y registrar.
4. Cierra con **Nuestro criterio**: la tecnología orienta y la persona decide.

</details>

## Probar la consola

Desde `/landing`, pulsa **Ver demo** en móvil o **Explorar demo** en escritorio. Desde `/home`, pulsa **Consola Interactiva**. Ambos caminos llevan a `/login`: elige un rol de práctica y entra con el botón o la tecla Enter. Si intentas abrir `/demo` sin iniciar la práctica, volverás a la pantalla de acceso. Este paso es solo navegación simulada, no autenticación real.

<details>
<summary><strong>Recorrido de cinco minutos</strong></summary>

1. En **Inicio**, compara los avisos recibidos con los casos agrupados.
2. Abre un caso, observa las **dos vistas disponibles** y marca cada una. La vista aérea se presenta sin conexión.
3. En **Comprender**, distingue las señales visibles de lo que aún requiere confirmación.
4. En **Decidir**, verifica, escala o descarta e indica el motivo. Si escalas, cambia a **Supervisión** y marca la derivación recibida.
5. Pulsa **K8 IA**, o el perrito 3D de la esquina, y pregunta cómo funciona la práctica. K8 muestra respuestas y fuentes de documentos curados; no usa un modelo externo.
6. En **Historial**, revisa la secuencia de acciones y descarga el registro si quieres conservarlo. En **Ajustes**, cambia lectura y ritmo, edita el nombre o cierra la práctica.

La llegada automática comienza pausada. Puedes generar un caso manualmente, elegir el ritmo, cambiar el tamaño del texto o reiniciar la práctica. El progreso reconoce las tres revisiones iniciales sin puntuar rapidez ni favorecer una decisión.

</details>

Esta es una **simulación en el navegador**: escenas ilustradas, avisos, prioridades y explicaciones de ejemplo. La sesión se guarda en este navegador. Ninguna acción envía alertas ni recursos reales. K8 es un personaje 3D interactivo en WebGL; mueve una pata al acercar el cursor y periódicamente, con respaldo visual si WebGL no está disponible. Las opciones de accesibilidad permiten apagar movimiento y fondo, reforzar contraste, ampliar texto y usar paneles sólidos. Consulta el [recorrido funcional](docs/06_DEMO_OPERATOR_FLOW.md), la [base documental de K8](docs/09_K8_CONOCIMIENTO_Y_ACCESIBILIDAD.md) y la [decisión de arquitectura](docs/adr/0004-demo-guided-practice.md).

Para la siguiente etapa, consulta las [opciones de arquitectura IA-first](docs/07_ARQUITECTURA_IA_FIRST.md) y la [revisión de seguridad](docs/08_REVISION_SEGURIDAD.md). El camino recomendado es un sistema híbrido: detectar eventos cerca de la fuente, reunirlos en casos y producir explicaciones verificables desde un servicio protegido.

## Iniciar en local

Requisitos: Node.js y npm. Desde la raíz del repositorio:

```bash
npm ci
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000). La redirección te llevará a `/landing`.

<details>
<summary><strong>Comandos de verificación</strong></summary>

```bash
npm run typecheck
npm run lint
npm run test:demo
npm run format:check
npm run build
```

`npm run build` genera la misma compilación de producción que utiliza Vercel. Si alguna comprobación falla, revisa el resultado antes de publicar nuevos cambios.

En esta entrega, TypeScript, lint y build pasan. `format:check` aún detecta formato heredado en archivos anteriores; el detalle está en [ENGRAM.md](ENGRAM.md).

</details>

## Mapa técnico

| Lugar                                            | Contenido                                                        |
| ------------------------------------------------ | ---------------------------------------------------------------- |
| [`src/app/`](src/app/)                           | Rutas, layout, fuentes y estilos globales de Next.js App Router. |
| [`src/features/landing/`](src/features/landing/) | Componentes y movimiento de la página pública.                   |
| [`src/features/home/`](src/features/home/)       | Entrada audiovisual existente.                                   |
| [`src/features/demo/`](src/features/demo/)       | Motor local, práctica guiada, roles e historial de la consola.   |
| [`public/brand/`](public/brand/)                 | Logotipos, iconos y poster de marca.                             |
| [`public/referencias/`](public/referencias/)     | Referencias visuales del equipo.                                 |
| [`docs/`](docs/)                                 | Producto, arquitectura, diseño y plan maestro.                   |

**Stack:** Next.js App Router, React, TypeScript estricto, Tailwind CSS y Framer Motion. La landing no requiere variables de entorno ni servicios externos para funcionar.

<details>
<summary><strong>Despliegue manual en Vercel</strong></summary>

1. En Vercel, crea un proyecto e importa [Delnr91/takya](https://github.com/Delnr91/takya).
2. Selecciona la rama `main` y deja la **raíz del proyecto** en `/`.
3. Comprueba que Vercel detecte **Next.js** y use `npm run build`.
4. Esta landing no necesita variables de entorno.
5. Despliega y revisa `/`, `/landing`, `/home`, `/login` y `/demo` en escritorio y móvil. La raíz debe abrir la landing; el acceso a la consola empieza en `/login`.

Si intentaste desplegar antes de recibir el nuevo commit en `main`, vuelve a ejecutar el despliegue desde ese commit y mira el final de **Build Logs** si Vercel informa otro error.

Si conectas GitHub al proyecto de Vercel, los cambios posteriores en `main` podrán generar nuevos despliegues automáticamente.

</details>

## Antes de compartir

- Presenta la web como **prototipo de propuesta**, no como sistema conectado a CCTV.
- Las cifras de contexto provienen de documentos del proyecto; evita describirlas como resultados de TAKYA.
- El botón de WhatsApp de la versión actual usa un **número de ejemplo**. El equipo debe reemplazarlo por un canal real antes de utilizarlo como contacto comercial.
- La landing conserva la presentación V1. La consola es una práctica visual y sus roles no representan cuentas o permisos reales.

## Documentación del equipo

- [PRD: alcance y rutas](docs/01_PRD_TAKYA.md)
- [Arquitectura y reglas técnicas](docs/02_ARCHITECTURE_TRD.md)
- [Sistema de diseño](docs/03_DESIGN_SYSTEM.md)
- [Identidad visual](docs/05_IDENTIDAD_VISUAL_PPT_A.md)
- [Plan maestro](docs/maestros/PLAN_MAESTRO_CONSTRUCCION_TAKYA.md)
- [Recorrido de la consola](docs/06_DEMO_OPERATOR_FLOW.md)
- [Arquitectura IA-first](docs/07_ARQUITECTURA_IA_FIRST.md)
- [Revisión de seguridad](docs/08_REVISION_SEGURIDAD.md)
- [ENGRAM: estado de construcción](ENGRAM.md)

---

**Criterio de trabajo:** cambios pequeños, TypeScript sin `any`, componentes por feature y decisiones documentadas en `ENGRAM.md`.
