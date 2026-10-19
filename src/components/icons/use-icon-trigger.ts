"use client";

import { useReducedMotion } from "framer-motion";
import type { LucideProps } from "lucide-react";
import {
  type ForwardedRef,
  type RefObject,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export type AnimatedIconProps = Omit<LucideProps, "ref">;

interface AnimationHandle {
  startAnimation: () => unknown;
  stopAnimation: () => unknown;
}

// El icono se anima cuando el control que lo contiene recibe puntero o foco,
// no solo cuando el puntero toca el trazo de 24 px.
const TRIGGER = 'a[href], button, [role="button"], summary, label';

export function useIconTrigger(
  forwarded: ForwardedRef<SVGSVGElement>,
  handle: RefObject<AnimationHandle | null>,
) {
  const node = useRef<SVGSVGElement | null>(null);
  const reduceMotion = useReducedMotion();

  // El ref reenviado apunta al <svg>, igual que en lucide-react.
  useImperativeHandle(forwarded, () => node.current as SVGSVGElement, []);

  useEffect(() => {
    const element = node.current;
    if (!element || reduceMotion) return;
    const target = element.closest(TRIGGER) ?? element;
    const start = () => void handle.current?.startAnimation();
    const stop = () => void handle.current?.stopAnimation();
    target.addEventListener("pointerenter", start);
    target.addEventListener("pointerleave", stop);
    target.addEventListener("focusin", start);
    target.addEventListener("focusout", stop);
    return () => {
      target.removeEventListener("pointerenter", start);
      target.removeEventListener("pointerleave", stop);
      target.removeEventListener("focusin", start);
      target.removeEventListener("focusout", stop);
    };
  }, [handle, reduceMotion]);

  return node;
}
