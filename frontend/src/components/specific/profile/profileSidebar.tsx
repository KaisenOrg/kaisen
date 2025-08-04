import { BoltIcon, BookmarkSquareIcon, CheckCircleIcon, ChevronRightIcon, CubeTransparentIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

type LinkProfileProps = {
  href: string,
  title: string,
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
};

const LinkProfile = ({ href, title, Icon }: LinkProfileProps) => {
  return (
    <Link to={href} className="group px-2 py-3 flex items-center justify-between w-full rounded-none first:rounded-t-xl last:rounded-b-xl transition-colors duration-200 hover:bg-orange-500/5 hover:text-white hover:text-bold hover:border-l hover:border-orange-500">
      <div className="gap-1 flex items-center">
        <Icon className="w-6 h-auto transition-colors duration-200 group-hover:text-orange-500" />
        <span>{title}</span>
      </div>

      <ChevronRightIcon className="w-6 h-auto " />
    </Link>
  );
};


export const ProfileSidebar = () => {
  const links = [
    { href: "#activities", title: "Activities", Icon: CubeTransparentIcon },
    { href: "#metrics", title: "Metrics", Icon: BoltIcon },
    { href: "#achievements", title: "Achievements", Icon: CheckCircleIcon },
    { href: "#tracksCreated", title: "Tracks Created", Icon: BookmarkSquareIcon }
  ]

  return (
    <nav className="flex flex-col bg-[#1A1A1E] rounded-xl text-sm text-zinc-500 w-1/4">
      {links.map((link, index) => (
        <LinkProfile key={index} {...link} />
      ))}
    </nav>
  )
}