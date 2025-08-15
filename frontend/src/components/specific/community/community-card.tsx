import React from "react";
import {
  BookmarkIcon,
  ClockIcon,
  UserGroupIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/solid";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type CommunityCardProps = {
  variant?: "default" | "large" | "profile";
  title: string;
  description: string;
  creator: string;
  members: string;
  time: string;
  showMascot?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  id: string;
};

export default function CommunityCard({
  variant = "default",
  id,
  title,
  description,
  creator,
  members,
  time,
  showMascot = false,
  showEdit = false,
  showDelete = false
}: CommunityCardProps) {
  const gridPosition = React.useMemo(
    () => (Math.random() > 0.5 ? "bottom-left" : "top-right"),
    []
  );

  const imgClass =
    variant === "profile"
      ? "absolute left-0 bottom-0 w-32 h-24 pointer-events-none select-none z-0 overflow-hidden max-w-full max-h-full"
      : gridPosition === "bottom-left"
        ? "absolute left-0 bottom-0 w-32 h-24 pointer-events-none select-none z-0 overflow-hidden"
        : "absolute right-[-36] top-[-36] w-40 h-34 pointer-events-none select-none z-0 overflow-hidden";

  const containerClass =
    variant === "large"
      ? "relative flex-2/5 basis-xl flex rounded-lg border-2 border-zinc-800 bg-card p-6 cursor-pointer hover:bg-zinc-600/25 transition-colors"
      : variant === "profile"
        ? "relative w-full flex rounded-lg border-2 border-zinc-800 bg-card p-6 pb-2 cursor-pointer hover:bg-zinc-600/25 transition-colors"
        : "relative flex-1/5 basis-2xs rounded-lg border-2 border-zinc-800 bg-card pt-6 pb-4 cursor-pointer hover:bg-zinc-600/25 transition-colors";

  const contentClass =
    variant === "large" || variant === "profile"
      ? "flex flex-col justify-between text-left text-white relative w-full overflow-hidden z-[1]"
      : "flex flex-col text-left text-white px-6 relative w-full overflow-hidden z-[1]";

  const occupation =
    variant === "large" || variant === "profile"
      ? "col-span-2"
      : "col-span-1";

  return (
    <Link to={`/tracks/${id}`} className={occupation}>
      <div className={containerClass} >
        {showMascot && (
          <img
            src="/kai-sleeping.svg"
            alt="Kai mascot"
            width={80}
            height={80}
            className="absolute -top-8 -right-4 w-20 h-20 z-20 pointer-events-none select-none overflow-visible"
            style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.25))" }}
            draggable={false}
          />
        )}

        {showEdit && (
          <Button className="p-6 absolute z-50 top-0 right-0 border border-[#27272A] rounded-tr-lg rounded-bl-xl bg-[#1A1A1E]">
            <PencilIcon className="!w-6 !h-auto text-zinc-50" />
          </Button>
        )}

        {showDelete && (
          <Button className="p-6 absolute z-50 top-0 right-0 border border-[#27272A] rounded-tr-lg rounded-bl-xl bg-[#1A1A1E]">
            <TrashIcon className="!w-6 !h-auto text-zinc-50" />
          </Button>
        )}

        <img
          src="/geometric-bg.svg"
          alt=""
          width={80}
          height={80}
          aria-hidden="true"
          className={imgClass}
          draggable={false}
        />

        <div className={contentClass} >
          <div className="flex" >
            <BookmarkIcon className="h-6 w-6 text-purple-400 mr-2" />
            <h2 className="text-base font-medium text-white pb-2">{title}</h2>
          </div>
          <p className="text-sm text-zinc-400 pb-2">{description}</p>
          <p className="text-xs text-zinc-400 pb-4">
            Created by <span className="text-orange-500">@{creator}</span>
          </p>
          {variant === "large" && (
            <div className="h-7 flex items-center gap-2 ml-2 pb-2">
              <RocketLaunchIcon className="h-5 w-5 text-orange-500" />
              <span className="uppercase text-sm font-semibold text-orange-500 tracking-widest">
                TOP ACCESSED
              </span>
            </div>
          )}
          {variant !== "profile" ? (
            <div className="flex justify-end items-center gap-4 text-zinc-400 text-sm font-medium pb-2">
              <div className="flex items-center gap-1">
                <UserGroupIcon className="h-5 w-5 text-orange-500" />
                <span>{members}</span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="h-5 w-5 text-orange-500" />
                <span>{time}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
