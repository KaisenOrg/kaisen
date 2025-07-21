"use client";

import { Button } from "@/components/ui/button";
import ContinueCard from "@/components/ui/continue-card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

type ToggleButtonProps = {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  showCondition: boolean; // condição para exibir o botão (ex: cards.length > 3)
};

export default function ToggleButton({
  isExpanded,
  setIsExpanded,
  showCondition,
}: ToggleButtonProps) {
  if (!showCondition) return null;

  return (
    <div className="mb-5 flex justify-center">
      <Button
        className="bg-transparent text-zinc-500 transition-colors duration-200 hover:text-white hover:bg-transparent"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? (
          <>
            View less <ChevronUp className="ml-2 h-4 w-4" />
          </>
        ) : (
          <>
            View more <ChevronDown className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}

export const ActivitiesSection = () => {
  const quantity = 4;
  const cardsInProgress = Array.from({ length: quantity }, (_, i) => i);
  const cardsCompleted = Array.from({ length: quantity }, (_, i) => i);

  const [showAllInProgress, setShowAllInProgress] = useState(false);
  const visibleInProgress = showAllInProgress
    ? cardsInProgress
    : cardsInProgress.slice(0, 3);
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const visibleCompleted = showAllCompleted
    ? cardsCompleted
    : cardsCompleted.slice(0, 3);

  return (
    <section id="activities" className="w-full bg-[#1A1A1E] border border-[#27272A] rounded-xl p-5 flex flex-col">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold">In Progress</h1>
        <div className="mt-6 grid grid-cols-3 w-full gap-x-3 gap-y-3 transition-all duration-400 mb-5">
          {visibleInProgress.map((index) => (
            <ContinueCard
              key={index}
              cardClassName="pt-4"
              descriptionClassName="text-xs pb-1"
            />
          ))}
        </div>
        <ToggleButton
          isExpanded={showAllInProgress}
          setIsExpanded={setShowAllInProgress}
          showCondition={cardsInProgress.length > 3}
        />
      </div>

      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold">Completed</h1>
        <div className="mt-6 grid grid-cols-1 w-full gap-y-3 transition-all duration-400 mb-5">
          {visibleCompleted.map((index) => (
            <ContinueCard
              key={index}
              cardClassName="max-w-full "
              descriptionClassName="text-xs"
              progress={100}
              showView={true}
            />
          ))}
        </div>
        <ToggleButton
          isExpanded={showAllCompleted}
          setIsExpanded={setShowAllCompleted}
          showCondition={cardsCompleted.length > 3}
        />
      </div>
    </section>
  );
};
