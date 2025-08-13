// src/hooks/useTutorial.tsx
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type TutorialStep = {
  id: string;
  content: React.ReactNode;
  /** Alvo a destacar (ex.: '#discover-link' ou '[data-tour="sidebar"]') */
  selector?: string;
  /** Posição do tooltip em relação ao alvo (ou "center") */
  placement?: "top" | "bottom" | "left" | "right" | "center";
  /** (opcional) Rota que precisa estar ativa antes de mostrar o passo */
  route?: string;
};

export type TutorialApi = {
  start: (steps: TutorialStep[]) => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  isActive: boolean;
  stepIndex: number;
  step?: TutorialStep;
  targetEl?: HTMLElement | null;
};

export function useTutorial(): TutorialApi {
  const [isActive, setIsActive] = useState(false);
  const [steps, setSteps] = useState<TutorialStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [targetEl, setTargetEl] = useState<HTMLElement | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const step = steps[stepIndex];

  const start = useCallback((s: TutorialStep[]) => {
    if (!s?.length) return;
    setSteps(s);
    setStepIndex(0);
    setIsActive(true);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
    setSteps([]);
    setStepIndex(0);
    setTargetEl(null);
  }, []);

  /** muda de passo garantindo rota correta antes */
  const goToStep = useCallback(
    (idx: number) => {
      const next = steps[idx];
      if (!next) return;

      // se o passo pede uma rota diferente da atual, navega
      if (next.route && next.route !== location.pathname) {
        navigate(next.route);
      }
      setStepIndex(idx);
    },
    [steps, location.pathname, navigate]
  );

  const next = useCallback(() => {
    const last = steps.length - 1;
    if (stepIndex >= last) return stop();
    goToStep(stepIndex + 1);
  }, [stepIndex, steps.length, goToStep, stop]);

  const prev = useCallback(() => {
    if (stepIndex <= 0) return;
    goToStep(stepIndex - 1);
  }, [stepIndex, goToStep]);

  // encontra o alvo sempre que passo OU rota mudarem
  useEffect(() => {
    if (!isActive || !step) return;
    const id = requestAnimationFrame(() => {
      if (!step.selector) { setTargetEl(null); return; }
      const el = document.querySelector(step.selector) as HTMLElement | null;
      setTargetEl(el || null);
      if (el) el.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
    });
    return () => cancelAnimationFrame(id);
  }, [isActive, step, location.pathname]);

  // recalc em resize/scroll
  useEffect(() => {
    if (!isActive) return;
    const recalc = () => {
      if (!step?.selector) { setTargetEl(null); return; }
      setTargetEl(document.querySelector(step.selector) as HTMLElement | null);
    };
    window.addEventListener("resize", recalc);
    window.addEventListener("scroll", recalc, true);
    return () => {
      window.removeEventListener("resize", recalc);
      window.removeEventListener("scroll", recalc, true);
    };
  }, [isActive, step?.selector]);

  return useMemo(() => ({
    start, stop, next, prev, isActive, stepIndex, step, targetEl
  }), [start, stop, next, prev, isActive, stepIndex, step, targetEl]);
}
