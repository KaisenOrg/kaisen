import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
  const handleBegin = () => { markIntroSeen(principal); onStartTutorial?.(); onOpenChange(false); console.log("Tutorial started"); };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>

      <DialogContent className="sm:max-w-xl md:max-w-xl lg:max-w-2xl text-zinc-100 border-2 border-zinc-800 p-8 z-50
       bg-[url('/geometric-bg-3.svg')]  bg-[length:280px_auto] bg-right-top bg-no-repeat
 before:absolute 
      ">
       <img
    src="/kai-sitting-off.svg"
    alt="" aria-hidden="true"
    className="scale-x-[-1] absolute -top-16 right-3 w-20 h-20 pointer-events-none select-none z-60 "
  />
        <DialogHeader><DialogTitle className="text-xl">Welcome to Kaisen!</DialogTitle></DialogHeader>

        <div className="space-y-3 text-sm leading-relaxed text-zinc-300">
          <p>At Kaisen, learning goes beyond the traditional. Here, you learn, develop, and have fun. Count on the support of an engaged community, ready to help and grow alongside you. At the end of your journey, all the knowledge acquired is not just an achievement, but a digital asset: validated and registered with an NFT certificate.</p>
        </div>

        <p className="text-sm text-zinc-200 font-semibold">Here you have the power to:</p>

        <div className="space-y-2">
          <div className="flex gap-3 items-start"><Map className="w-6 h-6 text-orange-500" />
            <p className="text-sm text-zinc-200"><span className="font-medium">Map:</span> Use AI to structure...</p>
          </div>
          <div className="flex gap-3 items-start"><Users className="w-6 h-6 text-orange-500" />
            <p className="text-sm text-zinc-200"><span className="font-medium">Collaborate:</span> Join the community...</p>
          </div>
          <div className="flex gap-3 items-start"> <Hammer className="w-6 h-6 text-orange-500" />
            <p className="text-sm text-zinc-200"><span className="font-medium">Build:</span> Help create...</p>
          </div>
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button variant="outline" className="bg-zinc-800 hover:bg-zinc-700" onClick={handleSkip}>Skip</Button>
          <Button  onClick={handleBegin} id="button-finish">Begin tutorial</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
