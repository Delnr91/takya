"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

type Destination = "/landing" | "/login";
const CurtainContext = createContext<((target: Destination) => void) | null>(
  null,
);
export function useCurtainNavigation() {
  const navigate = useContext(CurtainContext);
  if (!navigate) throw new Error("Curtain navigation provider missing");
  return navigate;
}

/** Transición de vidrio líquido hecha con Motion. Los enlaces normales mantienen el abrir en pestaña nueva. */
export function CurtainNavigation({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const busy = useRef(false);
  const [transition, setTransition] = useState<{
    target: Destination;
    covered: boolean;
  } | null>(null);
  const [notice, setNotice] = useState("");
  const reveal = Boolean(transition && pathname === transition.target);
  useEffect(() => {
    if (!transition) return;
    const timer = window.setTimeout(() => {
      busy.current = false;
      setTransition(null);
      setNotice(
        "La navegación tardó más de lo esperado. Puedes volver a pulsar el enlace.",
      );
    }, 12000);
    return () => window.clearTimeout(timer);
  }, [transition]);
  function navigate(target: Destination) {
    if (busy.current) return;
    if (reduced) {
      router.push(target);
      return;
    }
    busy.current = true;
    setNotice("");
    setTransition({ target, covered: false });
  }
  return (
    <CurtainContext.Provider value={navigate}>
      {children}
      {notice ? (
        <p role="status" className="takya-navigation-notice">
          {notice}
        </p>
      ) : null}
      {transition ? (
        // Gota de vidrio líquido: se expande desde el centro con reflejos de
        // la marca, cubre la pantalla y se disuelve al llegar a la siguiente.
        <motion.div
          className="takya-liquid-curtain"
          aria-hidden="true"
          initial={{ clipPath: "circle(0% at 50% 62%)", opacity: 1 }}
          animate={
            reveal
              ? {
                  clipPath: "circle(150% at 50% 62%)",
                  opacity: 0,
                  scale: 1.06,
                }
              : { clipPath: "circle(150% at 50% 62%)", opacity: 1, scale: 1 }
          }
          transition={{
            duration: reveal ? 0.55 : 0.75,
            ease: [0.76, 0, 0.24, 1],
          }}
          onAnimationComplete={() => {
            if (reveal) {
              busy.current = false;
              setTransition(null);
            } else if (!transition.covered) {
              setTransition({ ...transition, covered: true });
              router.push(transition.target);
            }
          }}
        >
          <span className="takya-liquid-orb is-a" />
          <span className="takya-liquid-orb is-b" />
          <span className="takya-liquid-orb is-c" />
          <span className="takya-liquid-sheen" />
        </motion.div>
      ) : null}
      <span className="sr-only" role="status">
        {transition ? "Abriendo la siguiente pantalla" : ""}
      </span>
    </CurtainContext.Provider>
  );
}
