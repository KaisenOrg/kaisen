// src/hooks/useTutorial.tsx
import { useCallback, useMemo, useState } from "react";

export type TutorialStep = {
  id: string;
  content: React.ReactNode; // aceita string/JSX
};

export type TutorialApi = {
  start: (steps: TutorialStep[]) => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  isActive: boolean;
  stepIndex: number;
  step?: TutorialStep;
};

export function useTutorial(): TutorialApi {
  const [isActive, setIsActive] = useState(false);
  const [steps, setSteps] = useState<TutorialStep[]>([]);
  const [stepIndex, setStepIndex] = useState(0);

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
  }, []);

  const next = useCallback(() => {
    setStepIndex((i) => {
      const last = steps.length - 1;
      if (i >= last) { setIsActive(false); return i; }
      return i + 1;
    });
  }, [steps.length]);

  const prev = useCallback(() => setStepIndex((i) => Math.max(0, i - 1)), []);

  const step = steps[stepIndex];

  return useMemo(() => ({ start, stop, next, prev, isActive, stepIndex, step }),
    [start, stop, next, prev, isActive, stepIndex, step]);
}
