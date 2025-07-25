import { useEffect } from 'react';
import HomeButton from "@/components/ui/home-button";
import CommunityCard from "@/components/ui/community-card";
import ContinueCard from '@/components/ui/continue-card';

import { useActor } from '@/lib/agent';
import { useTrackStore } from '@/stores/useTrackStore';
import { usePopoverStore } from '@/stores/usePopoverStore';
import { useTracksActions } from '@/hooks/useTracksActions';
import { useNavigate } from 'react-router-dom';
import '@/globals.css';

export default function Home() {
  const { open, close } = usePopoverStore();
  const { tracks, isLoading } = useTrackStore();
  const { fetchTracks, injectSampleTracks } = useTracksActions();
  const tracksActor = useActor('tracks_backend');
  const navigate = useNavigate();

  const handleOpenCreateTrackPopover = () => {
    open({
      type: 'create-track',
      navigate
    });
  };

  useEffect(() => {
    if (!tracksActor) return;

    open({ type: 'loading' })

    fetchTracks()
      .then(async () => {
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
        background: 'var(--background)',
        color: 'var(--foreground)',
        minHeight: '100vh',
        transition: 'background 0.3s, color 0.3s',
      }}
    >
      <HomeButton onClick={handleOpenCreateTrackPopover} />

      {/* Seção "Continue de onde parou" (pode be implemented in the future) */}
      <div className="mt-6">
        <h2
          className="text-lg font-semibold"
          style={{ color: 'var(--foreground)' }}
        >
          Pick up where you left off
        </h2>

        <div className="flex mt-4 gap-4">
          <ContinueCard />
        </div>
      </div>

      <div className="mt-12">
        <h2
          className="text-lg font-semibold"
          style={{ color: 'var(--foreground)' }}
        >
          Explore community blocks
        </h2>
        <h3
          className="text-sm font-medium"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Browse and join learning tracks created by the community
        </h3>

        <div className="flex flex-wrap gap-4 mt-4">
          {!isLoading && tracks.map((track, i) => (
            <CommunityCard
              key={track.id}
              id={track.id}
              title={track.title}
              description={track.description}
              creator={track.authorId.slice(0, 10) + "..."}
              members={'0'}
              time={`--`}
              variant={i === 0 || (i === tracks.length - 1 && i > 2) ? 'large' : 'default'}
              showMascot={i === 0 || (i === tracks.length - 1 && i > 1)}
            />
          ))}
        </div>
      </div>
    </main>
  );
}