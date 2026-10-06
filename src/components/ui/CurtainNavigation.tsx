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

/** A local wipe built with Motion's free primitives. Standard links keep native new-tab behavior. */
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
        <div className="takya-curtain" aria-hidden="true">
          {Array.from({ length: 6 }, (_, index) => (
            <motion.div
              key={index}
              className="takya-curtain-panel"
              initial={{ y: "100%" }}
              animate={{ y: reveal ? "-100%" : "0%" }}
              transition={{
                duration: 0.4,
                delay: index * 0.035,
                ease: [0.76, 0, 0.24, 1],
              }}
              onAnimationComplete={
                index === 5
                  ? () => {
                      if (reveal) {
                        busy.current = false;
                        setTransition(null);
                      } else if (!transition.covered) {
                        setTransition({ ...transition, covered: true });
                        router.push(transition.target);
                      }
                    }
                  : undefined
              }
            />
          ))}
        </div>
      ) : null}
      <span className="sr-only" role="status">
        {transition ? "Abriendo la siguiente pantalla" : ""}
      </span>
    </CurtainContext.Provider>
  );
}
