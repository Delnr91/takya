# ADR 0001: Next.js 14 App Router como Framework Base

## Estado
Aceptado (2026-09-28)

## Contexto
Requerimos construir 3 rutas diferenciadas (`/home`, `/landing`, `/demo`) para TAKYA. `/landing` necesita excelente SEO y performance inicial, mientras que `/demo` es una aplicación de cliente pesada altamente interactiva.

## Decisión
Usaremos **Next.js 14+ con el App Router**. 
- Usaremos Server Components por defecto en `/home` y `/landing` para máxima velocidad.
- Usaremos Client Components (`"use client"`) explícitamente en la ruta `/demo` para manejar la máquina de estados, el simulador de incidentes y Framer Motion.

## Consecuencias
- Estandarización de enrutamiento basado en sistema de archivos (`src/app`).
- Excelente desempeño out-of-the-box para el landing público.
- Cumple directamente con las directrices del Protocolo del Agente Constructor.
