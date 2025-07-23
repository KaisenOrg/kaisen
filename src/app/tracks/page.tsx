'use client'
import { TrackCard } from '@/components/specific/tracks/card'
import { ConnectingArrows } from '@/components/specific/tracks/connecting-arrows'
import { DraggableBackground } from '@/components/ui/draggable-bg'
import { useState, useEffect, useMemo } from 'react';
import { generateSectionPositions } from '@/lib/utils';
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { ChatPanel } from '@/components/specific/tracks/chat-panel';

import { useTrackStore } from '@/store/useTrackStore';
import { usePopoverStore } from '@/store/usePopoverStore';
import { useActor } from '@/lib/agent';
import { type Section } from '@/types';
import { useTracksActions } from '@/hooks/useTracksActions';

export default function TracksPage() {
  const { tracks, isLoading, error } = useTrackStore();
  const { fetchTracks, injectSampleTracks, createTrack } = useTracksActions();
  const { open, close } = usePopoverStore();
  const tracksActor = useActor('tracks_backend');

  const selectedTrack = tracks?.[0];

  const [sectionsWithPositions, setSectionsWithPositions] = useState<any[]>([]);
  const [screenHeight, setScreenHeight] = useState(0);
  const [screenWidth, setScreenWidth] = useState(0);
  const cardDimensions = { width: 320, height: 238 };

  useEffect(() => {
    fetchTracks()
      .then(() => {
        if (tracks?.length === 0) {
          injectSampleTracks();
        }
      });
  }, [tracksActor]);

  useEffect(() => {
    if (selectedTrack && selectedTrack.sections.length > 0) {
      const currentScreenHeight = window.innerHeight;
      const currentScreenWidth = window.innerWidth;
      setScreenHeight(currentScreenHeight);
      setScreenWidth(currentScreenWidth);

      const generatedSections = generateSectionPositions(selectedTrack.sections, {
        cardWidth: cardDimensions.width,
        canvasHeight: currentScreenHeight * 0.8,
        gap: 200,
        initialLeftOffset: 150,
        verticalBounds: [0.2, 0.4],
        maxVerticalShift: 400
      });
      setSectionsWithPositions(generatedSections);
    }
  }, [selectedTrack]);

  const handleSectionClick = (section: Section) => {
    open({ type: 'section', data: section });
  };

  // Função para determinar o texto do botão com base no tipo de conteúdo
  const getButtonTextForContent = (content: Section['content']): string => {
    if ('Page' in content) return 'Ler';
    if ('Quiz' in content) return 'Iniciar Quiz';
    if ('Flashcard' in content) return 'Revisar';
    if ('Essay' in content) return 'Responder';
    return 'Ver';
  };

  const canvasWidth = useMemo(() => {
    return Math.max(selectedTrack ? selectedTrack.sections.length * (cardDimensions.width + 120) + 450 : 0, screenWidth);
  }, [screenWidth]);

  return (
    <PanelGroup direction="horizontal" className="flex-1 flex h-full">
      <Panel defaultSize={75} minSize={20} className="flex-1 flex">
        <DraggableBackground
          className="h-full w-full bg-gradient-to-t from-primary/5 to-transparent select-none"
          canvasWidth={canvasWidth}
          canvasHeight={screenHeight * 0.8}
          canvasClassName="bg-[radial-gradient(theme(colors.gray.600/0.2)_1px,transparent_0)] bg-[length:20px_20px]"
        >
          {sectionsWithPositions.length > 0 && !isLoading && (
            <>
              <ConnectingArrows positions={sectionsWithPositions.map(s => ({ ...s.position, active: s.active }))} cardDimensions={cardDimensions} />
              {sectionsWithPositions.map(section => (
                <TrackCard
                  key={section.id}
                  title={section.title}
                  description={`Seção ${section.id} da trilha.`}
                  buttonText={getButtonTextForContent(section.content)}
                  onClick={() => handleSectionClick(section)}
                  style={section.position}
                />
              ))}
            </>
          )}
        </DraggableBackground>
      </Panel>
      <PanelResizeHandle className="bg-zinc-800 w-0.5 cursor-col-resize" />
      <Panel defaultSize={30} minSize={30} maxSize={60} className="h-full">
        <ChatPanel />
      </Panel>
    </PanelGroup>
  )
}