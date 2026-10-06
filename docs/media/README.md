# Evidencia audiovisual de la demo

| ID                | Original          | Tramo       | Selección                                             |
| ----------------- | ----------------- | ----------- | ----------------------------------------------------- |
| residuos-descarga | basura.mp4        | 00:00–00:06 | Zona de carga y material, sin transición a entrevista |
| residuos-salida   | basura.mp4        | 00:16–00:27 | Salida del vehículo y material restante               |
| fuego-foco        | sacarclips.mp4    | 09:00–09:09 | Llamas en material acumulado                          |
| fuego-respuesta   | sacarclips.mp4    | 09:50–10:08 | Trabajo de personal de respuesta                      |
| fuego-humo        | sacarclips.mp4    | 10:25–10:53 | Humo y focos restantes                                |
| camino-camion     | videoplayback.mp4 | 00:06–00:28 | Encuadre vertical del camino; descarga no visible     |

`videocamaras.mp4` se conserva como original pero no se integra: es principalmente reunión/entrevistas, no evidencia de un incidente.

Se recortó el encuadre para excluir presentadores, logos y rótulos de televisión. Se eliminó el audio; no hay narración periodística. No se sintetizaron hechos ni se interpolaron detalles. Los cambios de plano del reportaje no prueban continuidad temporal. La grabación móvil tiene resolución y movimiento de origen: aumentar tamaño no recupera detalle.

## Formato y reproducción

MP4, H.264, yuv420p, 24 fps, sin audio, inicio rápido (`faststart`), duración de 6 a 28 segundos. Se carga portada y metadatos; se reproduce por acción del operador. Solo se monta el clip activo. El conjunto pesa aproximadamente 8 MB.

Con originales locales en `.media-source/`, Python y FFmpeg instalados:

```powershell
python scripts/prepare-demo-media.py
# Actualizar solo dos extractos:
python scripts/prepare-demo-media.py residuos-descarga residuos-salida
```

[Plan](demo-media-plan.json): tiempos y encuadres. [Manifiesto](demo-media-manifest.json): mismo plan, tamaño y SHA-256 del original. Los originales no se modifican. `.media-source/` está excluida de Git y no se sirve públicamente.

## Procedencia y límites

El material fue aportado desde publicaciones periodísticas. La demo conserva procedencia en «Sobre esta evidencia». Quitar el logo del encuadre no cambia la autoría. No se aportó una licencia de reutilización ni se comprobó autorización del titular; el equipo debe revisar ese punto antes de difusión pública. No se garantiza anonimización completa: mantener revisión de rostros/matrículas y evitar atribuciones personales.

Zonas, señales y sugerencias están curadas y sincronizadas por tiempo. No hay un modelo que detecte objetos, reconozca personas o determine culpabilidad. El camión sin descarga visible permite practicar una abstención fundada.
