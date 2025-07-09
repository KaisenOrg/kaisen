import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bars3BottomLeftIcon, BellIcon } from "@heroicons/react/24/outline";

export default function Header() {
  return (
    <header className="flex items-center h-1/11 px-4 border-b bg-background">
      {/* Left side: Menu and Logo */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <Bars3BottomLeftIcon/>
        </Button>
        <div className="flex items-center">
          <Image
            src="/logo-text.svg"
            alt="Kaizen Logo"
            width={100}
            height={40}
            className="h-auto"
          />
        </div>
      </div>

      {/* Spacer to push right content to the edge */}
      <div className="flex-1"></div>

      {/* Right side: Notifications and User Avatar */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="w-10 h-10">
          <BellIcon/>
          <span className="sr-only">Notifications</span>
        </Button>
        <Avatar className="w-10 h-10">
          {/* In a real app, the src would be dynamic */}
          <AvatarImage src="https://github.com/shadcn.pngs" alt="@cn" />
          <AvatarFallback className="bg-orange-500">
            CN
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
