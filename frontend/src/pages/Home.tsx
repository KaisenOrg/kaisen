import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import HomeButton from "@/components/specific/home/home-button";
import CommunityCard from "@/components/specific/community/community-card";
import ContinueCard from "@/components/general/continue-card";
import { SkeletonCommunityCard } from "@/components/specific/community/skeleton-community-card";
import { SkeletonContinueCard } from "@/components/general/skeleton-continue-card";

import { useTrackStore } from "@/stores/useTrackStore";
import { useModalStore } from "@/stores/useModalStore";
import { useTracksActions } from "@/hooks/useTracksActions";
import { useActor } from "@/lib/agent";
import "@/globals.css";

export default function Home() {
  const { open, close } = useModalStore();
  const { tracks, isLoading } = useTrackStore();
  const { fetchTracks, injectSampleTracks } = useTracksActions();
  const tracksActor = useActor("tracks_backend");
  const navigate = useNavigate();

  const handleOpenCreateTrackModal = () => {
    open({ type: "create-track", navigate });
  };

  useEffect(() => {
    if (!tracksActor) return;

    fetchTracks().then(async () => {
      if (tracks?.length === 0) {
        await injectSampleTracks();
      }

      close();
    });
  }, [tracksActor]);

  return (
    <main
      className="max-w-7xl mx-auto py-12 px-8"
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
        minHeight: "100vh",
        transition: "background 0.3s, color 0.3s",
      }}
    >
      <HomeButton onClick={handleOpenCreateTrackModal} />

      {/* Seção "Continue de onde parou" (pode be implemented in the future) */}
      <div className="mt-6">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          Pick up where you left off
        </h2>

        <div className="flex mt-4 gap-4">
          {isLoading ? <SkeletonContinueCard /> : <ContinueCard />}
        </div>
      </div>

      <div className="mt-12" data-tour="sidebar-suggestions">
        <h2
          className="text-lg font-semibold"
          style={{ color: "var(--foreground)" }}
        >
          Explore community blocks
        </h2>
        <h3
          className="text-sm font-medium"
          style={{ color: "var(--muted-foreground)" }}
        >
          Browse and join learning tracks created by the community
        </h3>

        <div className="flex flex-wrap gap-4 mt-4">
          {isLoading
            ? Array(4)
                .fill(0)
                .map((_, i) => (
                  <SkeletonCommunityCard
                    key={`skeleton-${i}`}
                    // variant={i === 0 || i === 3 ? "large" : "default"}
                  />
                ))
            : tracks.map((track, i) => (
                <CommunityCard 
                  key={track.id}
                  id={track.id}
                  title={track.title}
                  description={track.description}
                  creator={track.authorId.slice(0, 10) + "..."}
                  members={"0"}
                  time={`--`}
                  variant={
                    i === 0 || (i === tracks.length - 1 && i > 2)
                      ? "large"
                      : "default"
                  }
                  showMascot={i === 0 || (i === tracks.length - 1 && i > 1)}
                />
              ))}
        </div>
      </div>
    </main>
  );
}
