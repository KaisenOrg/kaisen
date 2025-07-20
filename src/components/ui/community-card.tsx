import React from "react";
import {
  BookmarkIcon,
  ClockIcon,
  UserGroupIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";

type CommunityCardProps = {
  variant?: "default" | "large";
  title: string;
  description: string;
  creator: string;
  members: string;
  time: string;
  showMascot?: boolean;
};

export default function CommunityCard({
  variant = "default",
  title,
  description,
  creator,
  members,
  time,
  showMascot = false,
}: CommunityCardProps) {
  const gridPosition = React.useMemo(
    () => (Math.random() > 0.5 ? "bottom-left" : "top-right"),
    []
  );

  const imgClass =
    gridPosition === "bottom-left"
      ? "absolute left-0 bottom-0 w-32 h-24 pointer-events-none select-none z-0 overflow-hidden"
      : "absolute right-[-36] top-[-36] w-40 h-34 pointer-events-none select-none z-0 overflow-hidden";

  const containerClass =
    variant === "large"
      ? "relative flex max-w-2xl w-full rounded-lg border-2 border-zinc-800 bg-card p-6 cursor-pointer hover:bg-zinc-600/25 transition-colors"
      : "relative max-w-xs rounded-lg border-2 border-zinc-800 bg-card pt-6 pb-4 cursor-pointer hover:bg-zinc-600/25 transition-colors";

  const contentClass =
    variant === "large"
      ? "flex flex-col justify-between text-left text-white relative w-full overflow-hidden z-[1]"
      : "flex flex-col text-left text-white px-6 relative w-full overflow-hidden z-[1]";

  return (
    // The outer div is no longer necessary if its only purpose was to wrap the card and mascot.
    // We'll use the containerClass div as the relative parent.
    <div className={containerClass}>
      {showMascot && (
        <Image
          src="/kai-sleeping.svg"
          alt="Kai mascot"
          width={80}
          height={80}
          // Positioned relative to the card container
          className="absolute -top-8 -right-4 w-20 h-20 z-20 pointer-events-none select-none overflow-visible"
          style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.25))" }}
          draggable={false}
        />
      )}

      {/* Background grid effect */}
      <Image
        src="/geometric-bg.svg"
        alt=""
        width={80}
        height={80}
        aria-hidden="true"
        className={imgClass}
        draggable={false}
      />

      <div className={contentClass}>
        <div className="flex">
          <BookmarkIcon className="h-6 w-6 text-purple-400 mr-2" />
          <h2 className="text-base font-medium text-white pb-2">{title}</h2>
        </div>
        <p className="text-sm text-zinc-400 pb-2">{description}</p>
        <p className="text-xs text-zinc-400 pb-4">
          Created by <span className="text-orange-500">@{creator}</span>
        </p>
        <div className="h-7 flex items-center gap-2 ml-2 pb-2">
          {variant === "large" && (
            <>
              <RocketLaunchIcon className="h-5 w-5 text-orange-500" />
              <span className="uppercase text-sm font-semibold text-orange-500 tracking-widest">
                TOP ACCESSED
              </span>
            </>
          )}
        </div>
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
      </div>
    </div>
  );
}
