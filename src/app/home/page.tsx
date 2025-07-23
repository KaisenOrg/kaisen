'use client';

import { useEffect } from 'react';
import HomeButton from "@/components/ui/home-button";
import CommunityCard from "@/components/ui/community-card";
import ContinueCard from '@/components/ui/continue-card';

import { useActor } from '@/lib/agent';
import { useTrackStore } from '@/store/useTrackStore';
import { usePopoverStore } from '@/store/usePopoverStore';
import { useTracksActions } from '@/hooks/useTracksActions';

export default function Home() {
  const { tracks, isLoading, error } = useTrackStore();
  const { fetchTracks, injectSampleTracks, createTrack } = useTracksActions();
  const tracksActor = useActor('tracks_backend');
  const { open } = usePopoverStore();

  const handleOpenConfirmationPopover = () => {
    open({
      type: 'generic',
      title: 'Confirmar Ação',
      description: 'Tem certeza que deseja continuar?',
      content: <p>Esta ação não poderá ser desfeita.</p>,
      onConfirm: () => alert('Ação confirmada!'),
    });
  };

  useEffect(() => {
    fetchTracks()
      .then(() => {
        if (tracks?.length === 0) {
          injectSampleTracks();
        }
      });
  }, [tracksActor]);

  return (
    <main className="max-w-7xl mx-auto py-12 px-8">
      <HomeButton onClick={handleOpenConfirmationPopover} />

      {/* Seção "Continue de onde parou" (pode ser implementada no futuro) */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Pick up where you left off</h2>

        <div className="flex mt-4 gap-4">
          <ContinueCard />
          <ContinueCard />
          <ContinueCard />
          <ContinueCard />
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-lg font-semibold">Explore community blocks</h2>
        <h3 className="text-sm font-medium text-zinc-400">Browse and join learning tracks created by the community</h3>

        {/* Lógica para exibir o estado de carregamento ou erro */}
        {isLoading && <p className="mt-4 text-zinc-500">Carregando trilhas...</p>}
        {error && <p className="mt-4 text-red-500">{error}</p>}

        <div className="flex flex-wrap gap-4 mt-4">
          {!isLoading && tracks.map((track, i) => (
            <CommunityCard
              key={track.id}
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