import { useState, useCallback, useRef, useMemo } from "react";
import { IntroModal } from "@/components/specific/tutorial/IntroModal";
import { hasSeenIntro } from "@/lib/introSeen";

type UseIntroOptions = {
  principal?: string;            
  onStartTutorial?: () => void;  
};

export function useIntro({ principal, onStartTutorial }: UseIntroOptions = {}) {
  const [open, setOpen] = useState(false);
  const firedRef = useRef(false); 

  const openIfNeeded = useCallback(() => {
    if (firedRef.current) return;
    if (!hasSeenIntro(principal)) {
      firedRef.current = true;
      setOpen(true);
    }
  }, [principal]);

  const modal = useMemo(() => (
    <IntroModal
      open={open}
      onOpenChange={setOpen}
      onStartTutorial={onStartTutorial}
      principal={principal}
    />
  ), [open, onStartTutorial, principal]);

  return { open, setOpen, openIfNeeded, modal };
}
