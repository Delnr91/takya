// Geometría de la zona (coordenadas normalizadas 0–1). Misma semántica que
// contracts/v1: 3–32 vértices, sin duplicados, polígono simple y área positiva.
// El servidor vuelve a validar; esto solo da respuesta inmediata al operador.

export type Point = [number, number];

const MIN_AREA = 1e-4;

function cross(o: Point, a: Point, b: Point) {
  return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
}

function onSegment(p: Point, a: Point, b: Point) {
  return (
    Math.min(a[0], b[0]) <= p[0] &&
    p[0] <= Math.max(a[0], b[0]) &&
    Math.min(a[1], b[1]) <= p[1] &&
    p[1] <= Math.max(a[1], b[1])
  );
}

function segmentsTouch(a: Point, b: Point, c: Point, d: Point) {
  const o1 = cross(a, b, c);
  const o2 = cross(a, b, d);
  const o3 = cross(c, d, a);
  const o4 = cross(c, d, b);
  if (Math.sign(o1) * Math.sign(o2) < 0 && Math.sign(o3) * Math.sign(o4) < 0)
    return true;
  return (
    (o1 === 0 && onSegment(c, a, b)) ||
    (o2 === 0 && onSegment(d, a, b)) ||
    (o3 === 0 && onSegment(a, c, d)) ||
    (o4 === 0 && onSegment(b, c, d))
  );
}

export function polygonArea(points: Point[]) {
  let sum = 0;
  points.forEach((p, i) => {
    const q = points[(i + 1) % points.length]!;
    sum += p[0] * q[1] - q[0] * p[1];
  });
  return Math.abs(sum) / 2;
}

/** Devuelve un motivo en español si la zona no es válida, o null. */
export function polygonProblem(points: Point[]): string | null {
  if (points.length < 3) return "Marca al menos 3 esquinas.";
  if (points.length > 32) return "La zona admite como máximo 32 esquinas.";
  if (
    points.some((p) =>
      p.some(
        (v) => typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 1,
      ),
    )
  )
    return "Todas las esquinas deben quedar dentro de la imagen.";
  const keys = new Set(points.map((p) => `${p[0]},${p[1]}`));
  if (keys.size !== points.length) return "Hay dos esquinas en el mismo punto.";
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const a = points[i]!;
    const b = points[(i + 1) % n]!;
    for (let j = i + 1; j < n; j++) {
      const adjacent = j === i + 1 || (i === 0 && j === n - 1);
      if (adjacent) {
        // Aristas vecinas: solo pueden compartir su vértice común.
        const [shared, p, q] =
          j === i + 1 ? [b, a, points[(j + 1) % n]!] : [a, b, points[j]!];
        const dot =
          (p[0] - shared[0]) * (q[0] - shared[0]) +
          (p[1] - shared[1]) * (q[1] - shared[1]);
        if (cross(shared, p, q) === 0 && dot > 0)
          return "Los bordes de la zona no pueden cruzarse.";
        continue;
      }
      if (segmentsTouch(a, b, points[j]!, points[(j + 1) % n]!))
        return "Los bordes de la zona no pueden cruzarse.";
    }
  }
  if (polygonArea(points) < MIN_AREA) return "La zona es demasiado pequeña.";
  return null;
}

export function rectangle(
  left: number,
  top: number,
  right: number,
  bottom: number,
): Point[] {
  return [
    [left, top],
    [right, top],
    [right, bottom],
    [left, bottom],
  ];
}
