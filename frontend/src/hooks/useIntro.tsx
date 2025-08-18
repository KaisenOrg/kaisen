import { useCallback, useMemo, useState } from "react";
import { hasSeenIntro, markIntroSeen } from "@/lib/introSeen";
import { IntroModal } from "@/components/specific/tutorial/IntroModal";

type Options = { principal?: string; onStartTutorial?: () => void; };

export function useIntro({ principal, onStartTutorial }: Options) {
  const [open, setOpen] = useState(false);

  const openIfNeeded = useCallback(() => {
    if (!hasSeenIntro(principal)) setOpen(true);
  }, [principal]);

  const modal = useMemo(() => (
    <IntroModal
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) markIntroSeen(principal);
      }}
      onStartTutorial={() => {
        onStartTutorial?.();
        setOpen(false);
        markIntroSeen(principal);
      }}
      principal={principal}
    />
  ), [open, principal, onStartTutorial]);

  return { openIfNeeded, modal };
}
