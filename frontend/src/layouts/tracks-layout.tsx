import { PageHeader } from "@/components/general/page-header";
import { CubeTransparentIcon, ShieldCheckIcon, BoltIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { Outlet } from "react-router-dom";

export default function TracksLayout() {
  const tabs = [
    { value: "/", label: "Track", icon: CubeTransparentIcon },
    { value: "/practice", label: "Practice", icon: BoltIcon },
    { value: "/proof", label: "Proof of Learning", icon: ShieldCheckIcon },
    { value: "/knowledge", label: "Knowledge", icon: ArchiveBoxIcon },
  ];

  return (
    <main className="flex flex-col h-full">
      <PageHeader
        title="Lorem ipsum"
        subtitle="Lorem ipsum dolor sit amet"
        baseUrl="/tracks"
        tabs={tabs}
      />
      <Outlet />
    </main>
  );
}