// src/components/tutorial/TutorialOverlay.tsx
import { createPortal } from "react-dom";
import type { TutorialApi } from "@/hooks/useTutorial";

type Props = { api: TutorialApi };

export default function TutorialOverlay({ api }: Props) {
  const { isActive, step, stepIndex, next, prev, stop } = api;
  if (!isActive || !step) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] bg-black/60 flex items-center justify-center p-4">
      <div className="max-w-md w-full rounded-2xl border border-neutral-700 bg-neutral-900 text-neutral-100 p-4">
        <div className="text-sm">{step.content}</div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-xs text-neutral-400">Passo {stepIndex + 1}</span>
          <div className="flex gap-2">
            <button className="px-2 py-1 text-xs border border-neutral-700 rounded-md" onClick={prev}>Voltar</button>
            <button className="px-3 py-1 text-xs font-semibold bg-white text-neutral-900 rounded-md" onClick={next}>Próximo</button>
            <button className="px-2 py-1 text-xs border border-neutral-700 rounded-md" onClick={stop}>Pular</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
