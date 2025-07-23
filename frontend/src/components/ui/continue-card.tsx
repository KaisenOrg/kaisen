import { BookmarkIcon } from "@heroicons/react/20/solid";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Card } from "./card";

const COURSE_TITLE = "Principles of Python";
const COURSE_DESCRIPTION = "Master Python step by step with personalized, interactive content";
const PROGRESS_VALUE = 75;

interface ContinueCardProps {
  cardClassName?: string,
  descriptionClassName?: string,
  progress?:number,
  showView?: boolean
}

export default function ContinueCard( { cardClassName, descriptionClassName, progress, showView } : ContinueCardProps ) {
  const isCompleted = (progress === 100);

  return (
    <Card className={cn("relative max-w-xs rounded-lg border-2 border-zinc-800 bg-card pt-6 pb-4 cursor-pointer hover:bg-zinc-600/25 transition-colors", cardClassName)}>
      <div className="flex justify-between">
        <div className="flex flex-col text-left text-white px-6">
          <div className="flex">
            <BookmarkIcon className="h-6 w-6 text-orange-500 mr-2" strokeWidth={2}/>
              <h2 className="text-base font-medium text-white pb-2">{COURSE_TITLE}</h2>
          </div>
          <p className={cn("text-sm text-zinc-400 pb-6", descriptionClassName)}>{COURSE_DESCRIPTION}</p>
        </div>
        { showView && (
          <Button variant="outline" className="mx-auto max-w-[120px] w-full border border-zinc-800">View</Button>
        )
        }
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-zinc-800 rounded-b-lg">
        <Progress value={progress ? progress : PROGRESS_VALUE} indicatorClassName={`bg-green-400 ${isCompleted && 'bg-orange-500'}`} className="rounded-t-lg" />
      </div>
    </Card>
  );
}