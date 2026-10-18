# TAKYA · Marco de decisión del CTO

Inspirado en módulos profundos de John Ousterhout, razonamiento sobre datos de Martin Kleppmann y simplicidad del monolito defendida por DHH. Aplicación propia a TAKYA. El rigor de ciberseguridad se define por controles y pruebas, sin atribuir certificaciones o prácticas internas de organismos de inteligencia.

[Índice](00_INDICE_Y_ESTADO.md) · [Stack y arquitectura](02_BACKEND_DATOS_ARQUITECTURA.md) · [Skill CTO](../skills/takya-cto/SKILL.md).

## 1. Mandato

Que cada garantía del producto tenga un mecanismo concreto, un responsable y una prueba que pueda fallar. Mantener sencilla la superficie de los módulos, explícitas las costuras entre datos y realista el costo de operar en este equipo.

## 2. Ousterhout: módulos profundos

Ocultar la complejidad de PTS, GOP, formatos y subprocesos en un módulo de video con pocas operaciones: inspeccionar fuente, muestrear con referencias temporales y crear derivado documentado. La UI no debería conocer flags de FFmpeg ni reconstruir timestamps.

El módulo de evidencia recibe inventario y decisión, prepara un paquete y devuelve estado verificable. No exporta sus claves ni obliga al componente React a calcular la seguridad. Un módulo no es profundo por tener muchas líneas: ofrece una interfaz simple que encapsula decisiones difíciles.

Prueba de diseño: si tres consumidores necesitan saber cómo alinear cuadros o validar hashes, la abstracción está filtrando complejidad. No remediarlo con nombres genéricos como `Manager` sin aclarar responsabilidad. [Ousterhout, página del libro](https://web.stanford.edu/~ouster/cgi-bin/book.php).

## 3. Kleppmann: las costuras de los datos

Para cada transición, definir quién es autoridad, qué versión se usa, cuándo se confirma y qué puede perderse ante caída. En el demo sin BD, la respuesta correcta ante reinicio es reconocer pérdida de sesión; no simular recuperación durable.

| Costura | Invariante | Fallo que debe ensayarse |
| --- | --- | --- |
| Bytes → fuente aceptada | Hash definitivo tras carga completa y validación | Carga interrumpida o fuente sustituida |
| Fuente → observaciones | Tiempo y configuración referencian fuente exacta | PTS reajustados, GOP largo, regla cambiada |
| Observaciones → caso | Agrupación no mezcla sujetos/eventos diferentes sin soporte | Pistas perdidas y dos personas consecutivas |
| Caso → decisión | Una revisión esperada y actor autorizado | Doble clic, conflicto y replay |
| Decisión → paquete | Mismo caso/revisión, inventario completo | Escritura parcial y decisión cambiada durante exportación |
| Paquete → receptor | Descarga y acuse son estados distintos | Red interrumpida y receptor no autenticado |

No llamar “exactly once” a una operación porque usa UUID. La idempotencia en memoria caduca con el proceso. El historial append-only de una práctica no es event sourcing durable ni auditoría inviolable. [DDIA, sitio de los autores](https://dataintensive.net/).

## 4. DHH: un monolito modular con un worker aislado

Mantener el producto en un checkout y contratos coherentes. Separar el proceso que consume CPU/RAM de la API web es una necesidad concreta; dividir reglas, paquetes y prioridad en servicios de red independientes no lo es en esta etapa.

No introducir Kubernetes, Kafka, Redis, una base vectorial o un framework multiagente por anticipación. Cada componente exige operación, permisos, fallos y soporte. Revisar la separación cuando exista una necesidad medida de carga, recuperación o equipos independientes.

La simplicidad no justifica correr FFmpeg dentro del request web ni usar archivos públicos para evitar autorización. El objetivo es menos complejidad total conservando los invariantes.

## 5. Rigor de seguridad y datos

Tratar archivo, navegador, modelo, corpus y red como límites distintos. Identidad por recurso, permisos mínimos, proceso de video sin red, validación estricta y cuotas. K8 no obtiene herramientas de decisión, exportación o eliminación.

El diseño puede adoptar principios de Zero Trust; el prototipo no debe anunciar “arquitectura Zero Trust certificada”. Un algoritmo de 256 bits no define la seguridad de un sistema. Usar [NIST SP 800-207](https://csrc.nist.gov/pubs/sp/800/207/final) y [preservación de evidencia NIST](https://nvlpubs.nist.gov/nistpubs/ir/2022/NIST.IR.8387.pdf) como referencias públicas, con controles y alcance explícitos.

## 6. ADR mínimo por decisión

```text
Decisión / fecha / responsable:
Problema y restricción:
Opciones consideradas:
Elección y por qué:
Datos y pruebas que la respaldan:
Riesgo, recuperación y límite de garantía:
Condición que exige revisarla:
```

ADRs iniciales por escribir al implementar: estado efímero sin BD, límite BFF–worker, contrato de una sola fuente compatible con práctica, elección de detector/pesos/FPS y nivel E1/E2 del paquete. Un ADR no marca un control como implementado.

## 7. Revisión del CTO antes de integrar

- ¿Funciona con un archivo nuevo y un caso negativo, o solo con fixtures?
- ¿Puede el verificador rechazar un paquete alterado sin confiar en una referencia sustituible?
- ¿Está claro qué sobrevive al cierre del navegador y qué se pierde al reiniciar?
- ¿La API autoriza el recurso además de validar forma y Origin?
- ¿El frontend puede presentar una sola fuente sin inventar otra cámara?
- ¿Se contaron decodificación, espera, preparación y RAM, además de inferencia?
- ¿Qué ocurre sin proveedor LLM, sin disco y al cancelar?
- ¿El cambio pequeño preserva sesiones y tests existentes?

## 8. Plan de acción

Primero aprobar contratos y pruebas de fallo del flujo mínimo. Después construir fuente/verificador y un trabajo cancelable, integrar detector pequeño y adaptar UI. Ejecutar pruebas y comparación en el equipo de demo antes de comprar o recomendar hardware. Solo después evaluar K8 contextual, cámara en vivo y persistencia durable.

Una decisión técnica madura puede ser retirar una promesa o posponer una capacidad. El CTO entrega al CEO una tabla de **implementado / probado / limitado / pendiente**, no una lista de tecnologías como sustituto de resultados.
