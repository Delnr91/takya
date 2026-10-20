// Respuestas de K8 en lectura fácil: frases cortas, una idea por frase.
// Se usan en las fichas y como respaldo cuando el servicio de IA no responde.

export type K8Answer = {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
};

export const K8_ANSWERS: K8Answer[] = [
  {
    id: "ahora",
    question: "¿Qué hago ahora?",
    answer:
      "Ve a Inicio. Toca el botón verde «Comenzar revisión». Mira el video, lee lo que encontró TAKYA y decide. Tú tienes la última palabra.",
    keywords: ["ahora", "empezar", "comienzo", "inicio", "primero", "hago"],
  },
  {
    id: "revisar",
    question: "¿Cómo reviso un caso?",
    answer:
      "Son tres pasos. Uno: mira los videos. Dos: lee qué vio TAKYA y qué no sabe. Tres: elige Verificar, Derivar o Descartar, y di por qué.",
    keywords: [
      "revisar",
      "reviso",
      "caso",
      "casos",
      "decidir",
      "decido",
      "video",
    ],
  },
  {
    id: "evidencia",
    question: "¿Cómo protejo la evidencia?",
    answer:
      "Después de decidir, toca «Proteger evidencia». TAKYA guarda el original, le pone una huella, lo firma y lo cifra. Así nadie puede cambiarlo sin que se note.",
    keywords: [
      "evidencia",
      "proteger",
      "protejo",
      "cifrar",
      "firma",
      "huella",
      "paquete",
      "entregar",
    ],
  },
  {
    id: "analizar",
    question: "¿Cómo analizo un video?",
    answer:
      "Ve a Analizar. Elige «En vivo» o «Archivo». Elige la cámara. TAKYA revisa el video y te muestra si encontró algo.",
    keywords: [
      "analizar",
      "analizo",
      "camara",
      "cámara",
      "vivo",
      "archivo",
      "grabacion",
      "grabación",
      "senal",
      "señal",
    ],
  },
  {
    id: "lectura",
    question: "¿Cómo leo más cómodo?",
    answer:
      "Arriba, toca «Accesibilidad». Puedes poner texto grande, más contraste o quitar el movimiento. De noche, toca «Modo noche».",
    keywords: [
      "leer",
      "letra",
      "grande",
      "noche",
      "contraste",
      "ver",
      "comodo",
      "cómodo",
      "accesibilidad",
    ],
  },
  {
    id: "takya",
    question: "¿Qué es TAKYA?",
    answer:
      "TAKYA mira las cámaras contigo. Encuentra lo importante, te lo explica y protege la evidencia. La decisión siempre es tuya.",
    keywords: ["takya", "que es", "qué es", "sirve", "para que", "para qué"],
  },
];

const normalize = (text: string) =>
  text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/** Busca la respuesta local más cercana a la pregunta. */
export function localAnswer(question: string): string {
  const text = normalize(question);
  let best: K8Answer | null = null;
  let score = 0;
  for (const entry of K8_ANSWERS) {
    const hits = entry.keywords.filter((word) =>
      text.includes(normalize(word)),
    ).length;
    if (hits > score) {
      best = entry;
      score = hits;
    }
  }
  return (
    best?.answer ??
    "Puedo ayudarte a revisar un caso, analizar un video, proteger la evidencia o leer más cómodo. Toca una de las fichas o pregúntame de nuevo."
  );
}
