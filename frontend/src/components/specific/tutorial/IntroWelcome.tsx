import { DialogContent } from "@/components/ui/dialog";
import { Rocket } from "lucide-react";

export function IntroWelcome({
  onStart,
  onSkip,
}: {
  onStart: () => void;
  onSkip: () => void;
}) {
  return (
    <DialogContent
      className="
        relative p-6 border-2 border-neutral-800 text-neutral-100
        sm:max-w-xl md:max-w-2xl
        bg-[url('/geometric-bg-2.svg')] bg-[length:250px_auto] bg-no-repeat bg-right-top
      "
    >
      <Rocket className="w-10 h-10 text-orange-400 mb-4" />
      <h2 className="text-2xl font-bold">Welcome to Kaisen</h2>
      <p className="text-neutral-300 mt-2">
        Learn, create, and validate knowledge with AI and blockchain.
      </p>

      <div className="mt-6 flex justify-between">
        <button
          onClick={onSkip}
          className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600"
        >
          Skip
        </button>
        <button
          onClick={onStart}
          className="px-4 py-2 rounded-md bg-orange-500 hover:bg-orange-400 text-white"
        >
          Start tutorial
        </button>
      </div>
    </DialogContent>
  );
}
