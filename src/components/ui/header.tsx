import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bars3BottomLeftIcon, BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Header() {
  return (
    <header className="flex items-center h-1/11 px-4 border-b bg-background">
      {/* Left side: Menu and Logo */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <Bars3BottomLeftIcon style={{ width: 24, height: 24 }} />
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

      {/* Center: Search Input */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search anything"
              className="peer w-full rounded-md border border-input bg-background px-4 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <MagnifyingGlassIcon className="h-5 w-5 text-muted-foreground" />
            </span>
          </div>
        </div>
      </div>

      {/* Right side: Notifications and User Avatar */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="w-10 h-10">
          <BellIcon style={{ width: 24, height: 24 }} />
          <span className="sr-only">Notifications</span>
        </Button>
        <Avatar className="w-10 h-10">
          {/* In a real app, the src would be dynamic */}
          <AvatarImage src="https://github.com/shadcn.pngs" alt="@cn" />
          <AvatarFallback>
            CN
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}