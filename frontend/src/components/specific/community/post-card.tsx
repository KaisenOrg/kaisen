import * as React from "react";
import {
  ChatBubbleLeftIcon,
  ArrowPathRoundedSquareIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

type PostCardProps = {
  avatarInitials: string;
  username: string;
  handle: string;
  content: string;
  comments: number;
  retweets: number;
  likes: number;
  className?: string;
};

export function PostCard({
  avatarInitials,
  username,
  handle,
  content,
  comments,
  retweets,
  likes,
  className,
}: PostCardProps) {
  const [liked, setLiked] = React.useState(false);

  return (
    <div
      className={cn(
        "w-full rounded-md bg-muted/10 p-4 shadow-sm  border-b border-border",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white font-bold text-sm">
          {avatarInitials}
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-foreground">
            {username}{" "}
            <span className="text-muted-foreground font-normal">@{handle}</span>
          </div>
          <div className="mt-1 whitespace-pre-line text-sm text-foreground">
            {content}
          </div>
          <div className="mt-3 flex items-center gap-6 text-muted-foreground text-sm">
            <div className="flex items-center gap-1">
              <ChatBubbleLeftIcon className="h-4 w-4" />
              {comments}
            </div>
            <div className="flex items-center gap-1">
              <ArrowPathRoundedSquareIcon className="h-4 w-4" />
              {retweets}
            </div>
            <button
              onClick={() => setLiked(!liked)}
              className={cn(
                "flex items-center gap-1 transition-colors",
                liked && "text-orange-500"
              )}
            >
              <HeartIcon className="h-4 w-4" />
              {liked ? likes + 1 : likes}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
