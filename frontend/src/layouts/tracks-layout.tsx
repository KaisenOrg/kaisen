import { PageHeader } from "@/components/general/page-header";
import { useTrackStore } from "@/stores/useTrackStore";
import { CubeTransparentIcon, ShieldCheckIcon, BoltIcon, ArchiveBoxIcon } from "@heroicons/react/24/outline";
import { Outlet, useParams } from "react-router-dom";

export default function TracksLayout() {
  const { id } = useParams();
  const { tracks } = useTrackStore();
  const tabs = [
    { value: "/", label: "Track", icon: CubeTransparentIcon },
    { value: "/practice", label: "Practice", icon: BoltIcon },
    { value: "/proof", label: "Proof of Learning", icon: ShieldCheckIcon },
    { value: "/knowledge", label: "Knowledge", icon: ArchiveBoxIcon },
  ];

  const currentTrack = tracks.find((track) => track.id === id);
  
  return (
    <main className="flex flex-col h-full">
      <PageHeader
        title={currentTrack?.title || "Unknown"}
        subtitle={currentTrack?.description || "Unknown"}
        baseUrl="/tracks"
        tabs={tabs}
      />
      <Outlet />
    </main>
  );
}