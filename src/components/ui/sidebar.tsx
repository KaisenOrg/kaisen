"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Squares2X2Icon as OutlineSquares2X2Icon,
  SparklesIcon as OutlineSparklesIcon,
  AcademicCapIcon as OutlineAcademicCapIcon,
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
  AcademicCapIcon as SolidAcademicCapIcon,
  CheckCircleIcon as SolidCheckCircleIcon,
  ShoppingCartIcon as SolidShoppingCartIcon,
  Square3Stack3DIcon as SolidSquare3Stack3DIcon,
  RocketLaunchIcon as SolidRocketLaunchIcon,
  LanguageIcon as SolidLanguageIcon,
  Cog6ToothIcon as SolidCog6ToothIcon,
  QuestionMarkCircleIcon as SolidQuestionMarkCircleIcon,
} from "@heroicons/react/20/solid";

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
}: NavLinkProps) => {
  return (
    <Link
      href={href}
      className={`flex items-center justify-between p-2 rounded-md text-sm hover:bg-[var(--sidebar-accent)] font-medium${
        selected
          ? " bg-[var(--sidebar-accent)] text-[var(--sidebar-primary-foreground)]"
          : ""
      }`}
    >
      <div className="flex items-center gap-2">
        {selected ? (
          <SolidIcon className="w-5 h-5 text-[var(--color-primary)]" />
        ) : (
          <Icon className="w-5 h-5" />
        )}
        <span>{name}</span>
      </div>
      {isFooter && <ChevronRightIcon className="w-4 h-4 text-[var(--sidebar-foreground)]" />}
    </Link>
  );
};

export default function Sidebar() {
  const pathname = usePathname();

  // Map your links to real routes
  const mainLinks = [
    { name: "Home", href: "/home", Icon: OutlineSquares2X2Icon, SolidIcon: SolidSquares2X2Icon },
    { name: "Kai", href: "/kai", Icon: OutlineSparklesIcon, SolidIcon: SolidSparklesIcon },
  ];

  const progressLinks = [
    { name: "Tracks", href: "/tracks", Icon: OutlineAcademicCapIcon, SolidIcon: SolidAcademicCapIcon },
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
    <aside className="w-56 h-full border-r-2 border-[var(--sidebar-border)] bg-[var(--sidebar)] text-[var(--sidebar-foreground)] flex flex-col p-3">
      <div className="flex-grow">
        {/* Top-level navigation */}
        <nav className="space-y-1">
          {mainLinks.map((link) => (
            <NavLink key={link.name} {...link} selected={isSelected(link.href)} />
          ))}
        </nav>

        {/* Progress Section */}
        <div className="mt-6">
          <h3 className="px-2 text-xs font-semibold uppercase text-[var(--sidebar-foreground)] tracking-wider">
            Progress
          </h3>
          <nav className="mt-2 space-y-1">
            {progressLinks.map((link) => (
              <NavLink key={link.name} {...link} selected={isSelected(link.href)} />
            ))}
          </nav>
        </div>

        {/* Community Section */}
        <div className="mt-6">
          <h3 className="px-2 text-xs font-semibold uppercase text-[var(--sidebar-foreground)] tracking-wider">
            Community
          </h3>
          <nav className="mt-2 space-y-1">
            {communityLinks.map((link) => (
              <NavLink key={link.name} {...link} selected={isSelected(link.href)} />
            ))}
          </nav>
        </div>
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
            />
          ))}
        </nav>
      </div>
    </aside>
  );
}