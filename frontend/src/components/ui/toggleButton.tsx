import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { Button } from "./button";

type ToggleButtonProps = {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  showCondition: boolean;
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
            View less <ChevronUpIcon className="ml-2 h-4 w-4" />
          </>
        ) : (
          <>
            View more <ChevronDownIcon className="ml-2 h-4 w-4" />
          </>
        )}
      </Button>
    </div>
  );
}