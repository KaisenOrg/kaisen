import {
  Squares2X2Icon as OutlineSquares2X2Icon,
  SparklesIcon as OutlineSparklesIcon,
  QuestionMarkCircleIcon as OutlineQuestionMarkCircleIcon,
  ShoppingCartIcon as OutlineShoppingCartIcon,
  Square3Stack3DIcon as OutlineSquare3Stack3DIcon,
  RocketLaunchIcon as OutlineRocketLaunchIcon,
  LanguageIcon as OutlineLanguageIcon,
  Cog6ToothIcon as OutlineCog6ToothIcon,
  UserIcon as OutlineUserIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

import {
  Squares2X2Icon as SolidSquares2X2Icon,
  SparklesIcon as SolidSparklesIcon,
  QuestionMarkCircleIcon as SolidQuestionMarkCircleIcon,
  ShoppingCartIcon as SolidShoppingCartIcon,
  Square3Stack3DIcon as SolidSquare3Stack3DIcon,
  RocketLaunchIcon as SolidRocketLaunchIcon,
  LanguageIcon as SolidLanguageIcon,
  Cog6ToothIcon as SolidCog6ToothIcon,
  UserIcon as SolidUserIcon
} from "@heroicons/react/20/solid";
import { Link, useLocation } from "react-router-dom";
import { useSidebarStore } from "@/stores/useSidebarStore";
import type React from "react";

type NavLinkProps = {
  name: string;
  href: string;
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  SolidIcon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  selected: boolean;
  isFooter?: boolean;
};

const NavLink = ({
  name,
  href,
  Icon,
  SolidIcon,
  selected,
  isFooter = false,
  isCollapsed = false,
  ...rest
}: (NavLinkProps & { isCollapsed?: boolean }) & React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
  return (
    <Link
      to={href}
      {...rest} 
      className={`flex items-center justify-between p-2 rounded-md text-sm hover:bg-[var(--sidebar-accent)] font-medium${selected
        ? " bg-[var(--sidebar-accent)] text-[var(--sidebar-primary-foreground)]"
        : ""
        } ${isCollapsed ? 'justify-center' : ''}`}
    >
      <div className={`flex items-center gap-2 ${isCollapsed ? 'justify-center w-full' : ''}`}>
        {selected ? (
          <SolidIcon className="w-5 h-5 text-[var(--color-primary)]" />
        ) : (
          <Icon className="w-5 h-5" />
        )}
        <span
          className={`transition-all duration-300 ease-in-out origin-left min-w-0 overflow-hidden whitespace-nowrap ml-1
            ${isCollapsed ? 'opacity-0 w-0 absolute' : 'opacity-100 w-auto static'}`}
        >
          {name}
        </span>
      </div>
      {isFooter && !isCollapsed && <ChevronRightIcon className="w-4 h-4 text-[var(--sidebar-foreground)]" />}
    </Link>
  );
};

export default function Sidebar() {
  const pathname = useLocation().pathname;
  const { isCollapsed } = useSidebarStore();

  const mainLinks = [
    { name: "Home", href: "/", Icon: OutlineSquares2X2Icon, SolidIcon: SolidSquares2X2Icon, id: "home-link" },
    { name: "Kai", href: "/kai", Icon: OutlineSparklesIcon, SolidIcon: SolidSparklesIcon, id: "agent-link"},
  ];

  const progressLinks = [
    { name: "Profile", href: "/profile/overview", Icon: OutlineUserIcon, SolidIcon: SolidUserIcon, id: "progress-link" },
    { name: "Kai's Store", href: "/store", Icon: OutlineShoppingCartIcon, SolidIcon: SolidShoppingCartIcon, id: "store-link"},
  ];

  const communityLinks = [
    { name: "Discover", href: "/discover", Icon: OutlineSquare3Stack3DIcon, SolidIcon: SolidSquare3Stack3DIcon, id: "discover-link" },
    { name: "Community", href: "/community", Icon: OutlineRocketLaunchIcon, SolidIcon: SolidRocketLaunchIcon, id: "community-link"},
  ];

  const footerLinks = [
    { name: "Language", href: "/language", Icon: OutlineLanguageIcon, SolidIcon: SolidLanguageIcon },
    { name: "Settings", href: "/settings", Icon: OutlineCog6ToothIcon, SolidIcon: SolidCog6ToothIcon },
    { name: "Help", href: "/help", Icon: OutlineQuestionMarkCircleIcon, SolidIcon: SolidQuestionMarkCircleIcon },
  ];

  const isSelected = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside  className={`h-full border-r-2 border-[var(--sidebar-border)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)] flex flex-col p-3 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-56'}`}>
      <div className="flex-grow" data-tour="sidebar">
        <nav className="space-y-1" data-tour="sidebar-home">
          
          {mainLinks.map((link) => (
            <NavLink key={link.name} {...link} selected={isSelected(link.href)} isCollapsed={isCollapsed} />
          ))}
        </nav>
        {isCollapsed ? (
          <div className="mt-6">
            <div className="border-t border-[var(--sidebar-border)] mx-auto w-8" data-tour="sidebar"/>
            <nav className="mt-2 space-y-1" > 
              {progressLinks.map((link) => (
                <NavLink key={link.name} {...link} selected={isSelected(link.href)} isCollapsed={isCollapsed} />
              ))}
            </nav>
          </div>
        ) : (
          <div className="mt-6">
            <h3
              className={`px-2 text-xs font-semibold uppercase text-[var(--sidebar-foreground)] tracking-wider transition-all duration-300 ease-in-out origin-left ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}
              style={{ display: isCollapsed ? 'inline-block' : undefined }}
            >
              Progress
            </h3>
            <nav className="mt-2 space-y-1">
              {progressLinks.map((link) => (
                <NavLink key={link.name} {...link} selected={isSelected(link.href)} isCollapsed={isCollapsed} />
              ))}
            </nav>
          </div>
        )}
        {isCollapsed ? (
          <div className="mt-6">
            <div className="border-t border-[var(--sidebar-border)] mx-auto w-8" data-tour="sidebar"/>
            <nav className="mt-2 space-y-1" data-tour="sidebar-community">
              {communityLinks.map((link) => (
                <NavLink key={link.name} {...link} selected={isSelected(link.href)} isCollapsed={isCollapsed} />
              ))}
            </nav>
          </div>
        ) : (
          <div className="mt-6" data-tour="sidebar">
            <h3
              className={`px-2 text-xs font-semibold uppercase text-[var(--sidebar-foreground)] tracking-wider transition-all duration-300 ease-in-out origin-left ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'}`}
              style={{ display: isCollapsed ? 'inline-block' : undefined }}
            >
              Community
            </h3>
            <nav className="mt-2 space-y-1" data-tour="sidebar-community">
              {communityLinks.map((link) => (
                <NavLink key={link.name} {...link} selected={isSelected(link.href)} isCollapsed={isCollapsed} />
              ))}
            </nav>
          </div>
        )}
      </div>
      <div>
        <nav className="space-y-1" data-tour="sidebar-settings">
          {footerLinks.map((link) => (
            <NavLink
            
              key={link.name}
              {...link}
              selected={isSelected(link.href)}
              isFooter={true}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}