import {
  Squares2X2Icon as OutlineSquares2X2Icon,
  SparklesIcon as OutlineSparklesIcon,
  CheckCircleIcon as OutlineCheckCircleIcon,
  ShoppingCartIcon as OutlineShoppingCartIcon,
  Square3Stack3DIcon as OutlineSquare3Stack3DIcon,
  RocketLaunchIcon as OutlineRocketLaunchIcon,
  LanguageIcon as OutlineLanguageIcon,
  Cog6ToothIcon as OutlineCog6ToothIcon,
  QuestionMarkCircleIcon as OutlineQuestionMarkCircleIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

import {
  Squares2X2Icon as SolidSquares2X2Icon,
  SparklesIcon as SolidSparklesIcon,
  CheckCircleIcon as SolidCheckCircleIcon,
  ShoppingCartIcon as SolidShoppingCartIcon,
  Square3Stack3DIcon as SolidSquare3Stack3DIcon,
  RocketLaunchIcon as SolidRocketLaunchIcon,
  LanguageIcon as SolidLanguageIcon,
  Cog6ToothIcon as SolidCog6ToothIcon,
  QuestionMarkCircleIcon as SolidQuestionMarkCircleIcon,
} from "@heroicons/react/20/solid";
import { Link, useLocation } from "react-router-dom";
import { useSidebarStore } from "@/stores/useSidebarStore";

// A single component to handle the link rendering logic
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
}: NavLinkProps & { isCollapsed?: boolean }) => {
  return (
    <Link
      to={href}
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

  // Map your links to real routes
  const mainLinks = [
    { name: "Home", href: "/", Icon: OutlineSquares2X2Icon, SolidIcon: SolidSquares2X2Icon },
    { name: "Kai", href: "/kai", Icon: OutlineSparklesIcon, SolidIcon: SolidSparklesIcon },
  ];

  const progressLinks = [
    { name: "Proof of Learning", href: "/proof", Icon: OutlineCheckCircleIcon, SolidIcon: SolidCheckCircleIcon },
    { name: "Kai's Store", href: "/store", Icon: OutlineShoppingCartIcon, SolidIcon: SolidShoppingCartIcon },
  ];

  const communityLinks = [
    { name: "Discover", href: "/discover", Icon: OutlineSquare3Stack3DIcon, SolidIcon: SolidSquare3Stack3DIcon },
    { name: "Community", href: "/community", Icon: OutlineRocketLaunchIcon, SolidIcon: SolidRocketLaunchIcon },
  ];

  const footerLinks = [
    { name: "Language", href: "/language", Icon: OutlineLanguageIcon, SolidIcon: SolidLanguageIcon },
    { name: "Settings", href: "/settings", Icon: OutlineCog6ToothIcon, SolidIcon: SolidCog6ToothIcon },
    { name: "Help", href: "/help", Icon: OutlineQuestionMarkCircleIcon, SolidIcon: SolidQuestionMarkCircleIcon },
  ];

  // Helper to check if the current route matches the link
  const isSelected = (href: string) => {
    // Exact match or startsWith for subroutes
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <aside className={`h-full border-r-2 border-[var(--sidebar-border)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)] flex flex-col p-3 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-56'}`}>
      <div className="flex-grow">
        {/* Top-level navigation */}
        <nav className="space-y-1">
          {mainLinks.map((link) => (
            <NavLink key={link.name} {...link} selected={isSelected(link.href)} isCollapsed={isCollapsed} />
          ))}
        </nav>
        {/* Progress Section */}
        {isCollapsed ? (
          <div className="mt-6">
            <div className="border-t border-[var(--sidebar-border)] mx-auto w-8" />
            <nav className="mt-2 space-y-1">
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
        {/* Community Section */}
        {isCollapsed ? (
          <div className="mt-6">
            <div className="border-t border-[var(--sidebar-border)] mx-auto w-8" />
            <nav className="mt-2 space-y-1">
              {communityLinks.map((link) => (
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
              Community
            </h3>
            <nav className="mt-2 space-y-1">
              {communityLinks.map((link) => (
                <NavLink key={link.name} {...link} selected={isSelected(link.href)} isCollapsed={isCollapsed} />
              ))}
            </nav>
          </div>
        )}
      </div>
      {/* Footer Section */}
      <div>
        <nav className="space-y-1">
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