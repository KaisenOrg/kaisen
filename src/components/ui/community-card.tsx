import React from "react";
import { BookmarkIcon, ClockIcon, UserGroupIcon, RocketLaunchIcon } from "@heroicons/react/24/solid";
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

    // --- Final Class Definitions ---

    // The root wrapper is now a flex container to allow its child to grow.
    const wrapperClass = `relative flex ${
        variant === "large" ? "flex-1 md:max-w-2xl min-w-xs" : "flex-1 min-w-xs lg:max-w-xs w-full"
    }`;

    // The card itself now has `flex-grow` to fill the wrapper's height.
    const containerClass = "relative w-full flex flex-grow rounded-lg border-2 border-zinc-800 bg-card cursor-pointer hover:bg-zinc-600/25 transition-colors overflow-hidden p-6";

    const imgClass = `absolute pointer-events-none select-none z-0 ${
        gridPosition === "bottom-left"
            ? "left-0 bottom-0 w-32 h-24"
            : "right-[-36px] top-[-36px] w-40 h-34"
    }`;

    // The content container distributes its children (top/bottom groups).
    const contentClass = "flex flex-col justify-between text-left text-white z-10 relative w-full overflow-hidden";

    return (
        <div className={wrapperClass}>
            <div className={containerClass}>
                {/* Background grid effect */}
                <div className={imgClass}>
                    <Image
                        src="/geometric-bg.svg"
                        alt=""
                        aria-hidden="true"
                        fill
                        sizes="160px"
                        draggable={false}
                    />
                </div>

                {/* Card Content */}
                <div className={contentClass}>
                    {/* Top Content Group */}
                    <div>
                        <div className="flex items-start">
                            <BookmarkIcon className="h-6 w-6 text-purple-400 mr-2 flex-shrink-0" />
                            <h2 className="text-base font-medium text-white pb-2">{title}</h2>
                        </div>
                        <p className="text-sm text-zinc-400 pb-2">{description}</p>
                        <p className="text-xs text-zinc-400 pb-4">
                            Created by <span className="text-orange-500">@{creator}</span>
                        </p>
                    </div>

                    {/* Bottom Content Group */}
                    <div>
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
                        <div className="flex justify-end items-center gap-4 text-zinc-400 text-sm font-medium">
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
            </div>

            {/* Mascot */}
            {showMascot && (
                <div className="absolute -top-8 -right-4 w-20 h-20 z-20 pointer-events-none select-none">
                    <Image
                        src="/kai-sleeping.svg"
                        alt="Kai mascot"
                        fill
                        sizes="80px"
                        style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.25))" }}
                        draggable={false}
                    />
                </div>
            )}
        </div>
    );
}