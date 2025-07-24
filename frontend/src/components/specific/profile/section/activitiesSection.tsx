import ContinueCard from "@/components/ui/continue-card";
import ToggleButton from "@/components/ui/toggleButton";
import { useState } from "react";

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
