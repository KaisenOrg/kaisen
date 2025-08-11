import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Map, Users, Hammer } from "lucide-react";
import { markIntroSeen } from "@/lib/introSeen";

type IntroModalProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onStartTutorial?: () => void;
  principal?: string; 
};

export function IntroModal({ open, onOpenChange, onStartTutorial, principal }: IntroModalProps) {
  const handleSkip = () => { markIntroSeen(principal); onOpenChange(false); };
  const handleBegin = () => { markIntroSeen(principal); onStartTutorial?.(); onOpenChange(false); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-neutral-900/95 text-neutral-100 border-neutral-800">
        <DialogHeader><DialogTitle className="text-xl">Welcome to Kaisen!</DialogTitle></DialogHeader>

        <div className="space-y-3 text-sm leading-relaxed text-neutral-300">
          <p>At Kaisen, learning goes beyond the traditional. Here, you learn, develop, and have fun. Count on the support of an engaged community, ready to help and grow alongside you. At the end of your journey, all the knowledge acquired is not just an achievement, but a digital asset: validated and registered with an NFT certificate.</p>
        </div>

        <Separator className="my-2 bg-neutral-800" />

        <div className="space-y-2">
          <div className="flex gap-3 items-start"><Map className="h-5 w-5" />
            <p className="text-sm text-neutral-200"><span className="font-medium">Map:</span> Use AI to structure...</p>
          </div>
          <div className="flex gap-3 items-start"><Users className="h-5 w-5" />
            <p className="text-sm text-neutral-200"><span className="font-medium">Collaborate:</span> Join the community...</p>
          </div>
          <div className="flex gap-3 items-start"><Hammer className="h-5 w-5" />
            <p className="text-sm text-neutral-200"><span className="font-medium">Build:</span> Help create...</p>
          </div>
        </div>

        <div className="mt-4 flex justify-center gap-3">
          <Button variant="secondary" className="bg-neutral-800 hover:bg-neutral-700" onClick={handleSkip}>Skip</Button>
          <Button onClick={handleBegin}>Begin tutorial</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
