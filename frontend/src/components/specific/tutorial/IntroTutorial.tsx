import { useState, useEffect } from "react";
import { Map, Users, Hammer, Rocket } from "lucide-react";
import { DialogContent } from "@/components/ui/dialog";

const tutorialSteps = [
  {
    title: "Welcome to Kaisen",
    description: "Learn, create, and validate knowledge with blockchain and AI.",
    icon: Map
  },
  {
    title: "Explore Maps",
    description: "Use AI to structure any topic you want to master.",
    icon: Map
  },
  {
    title: "Join the Community",
    description: "Collaborate and validate the best learning paths together.",
    icon: Users
  },
  {
    title: "Build & Contribute",
    description: "Help shape the future of learning by creating new paths.",
    icon: Hammer
  },
  {
    title: "Let's Go!",
    description: "Start your journey now and unlock your potential.",
    icon: Rocket
  }
];

export function IntroTutorial({ onFinish }: { onFinish: () => void }) {
  const [step, setStep] = useState(0);
  const totalSteps = tutorialSteps.length;

  useEffect(() => {
    const seen = localStorage.getItem("kaisen:intro_seen");
    if (seen) {
      onFinish();
    }
  }, [onFinish]);

  const nextStep = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      finishTutorial();
    }
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const skipTutorial = () => finishTutorial();

  const finishTutorial = () => {
    localStorage.setItem("kaisen:intro_seen", "1");
    onFinish();
  };

  const { title, description, icon: Icon } = tutorialSteps[step];

  return (
    <DialogContent
      className="
        relative border-2 border-neutral-800 sm:max-w-lg
        bg-[url('/geometric-bg-2.svg')] bg-[length:250px_auto] bg-no-repeat bg-right-top
        text-neutral-100 p-6
      "
    >
      <div className="w-full bg-neutral-800 h-2 rounded mb-4 overflow-hidden">
        <div
          className="bg-orange-500 h-2 transition-all duration-300"
          style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
        />
      </div>

      <Icon className="w-10 h-10 text-orange-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-neutral-300 mb-6">{description}</p>

      <div className="flex justify-between">
        {step > 0 ? (
          <button
            onClick={prevStep}
            className="px-4 py-2 bg-neutral-700 rounded hover:bg-neutral-600"
          >
            Back
          </button>
        ) : (
          <button
            onClick={skipTutorial}
            className="px-4 py-2 bg-neutral-700 rounded hover:bg-neutral-600"
          >
            Skip
          </button>
        )}

        {step < totalSteps - 1 ? (
          <button
            onClick={nextStep}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-400"
          >
            Next
          </button>
        ) : (
          <button
            onClick={finishTutorial}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-400"
          >
            Finish
          </button>
        )}
      </div>
    </DialogContent>
  );
}
