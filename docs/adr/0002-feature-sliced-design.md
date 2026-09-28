# ADR 0002: Feature-Sliced Architecture

## Estado
Aceptado (2026-09-28)

## Contexto
Evitar la clásica "sopa de componentes" donde `src/components` contiene cientos de archivos inconexos, lo cual dificulta el mantenimiento a medida que el equipo crece.

## Decisión
Adoptamos una variación de **Feature-Sliced Design**. El código se organizará por dominio funcional dentro de `src/features`:
- `src/features/home/`
- `src/features/landing/`
- `src/features/demo/`
- `src/features/shared/`

Dentro de cada feature, agruparemos `components`, `hooks`, `schemas` y `utils`.

## Consecuencias
- Alta cohesión y bajo acoplamiento.
- El agente constructor puede trabajar en `/demo` sin tocar archivos de `/landing`.
