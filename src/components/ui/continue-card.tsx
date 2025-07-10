import React from "react";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { Progress } from "@/components/ui/progress";

const COURSE_TITLE = "Principles of Python";
const COURSE_DESCRIPTION = "Master Python step by step with personalized, interactive content";
const PROGRESS_VALUE = 75;

export default function ContinueCard() {
  return (
    <div className="relative max-w-xs rounded-lg border-2 border-zinc-800 bg-card pt-6 pb-4 cursor-pointer hover:bg-zinc-600/25 transition-colors">
      <div className="flex flex-col text-left text-white px-6">
        <div className="flex">
          <BookmarkIcon className="h-6 w-6 text-orange-500 mr-2" strokeWidth={2}/>
            <h2 className="text-base font-medium text-white pb-2">{COURSE_TITLE}</h2>
        </div>
        <p className="text-sm text-zinc-400 pb-6">{COURSE_DESCRIPTION}</p>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-zinc-800 rounded-b-lg">
        <Progress value={PROGRESS_VALUE} className="rounded-t-lg" />
      </div>
    </div>
  );
}