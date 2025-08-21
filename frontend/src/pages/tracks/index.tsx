import { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

import { generateSectionPositions } from "@/lib/mappers";
import { useTracksActions } from "@/hooks/useTracksActions";
import { type Section } from "@/types";
import { useActor } from "@/lib/agent";
import { useUser } from "@/providers/user-provider";
import { toastKoin } from "@/components/general/koin-toast";
import { useKoin } from "@/hooks/useKoin";

import { SectionCard } from "@/components/specific/tracks/section-card";
import { DraggableBackground } from "@/components/ui/draggable-bg";
import { ChatPanel } from "@/components/specific/tracks/chat-panel";
import { ConnectingArrows } from "@/components/specific/tracks/connecting-arrows";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import NftModal from "@/components/specific/tracks/nftModal";

import { useTrackStore } from "@/stores/useTrackStore";
import { useModalStore } from "@/stores/useModalStore";

export default function TrackPage() {
  const { tracks, isLoading } = useTrackStore();
  const { fetchTracks, injectSampleTracks } = useTracksActions();
  const { open } = useModalStore();
  const tracksActor = useActor("tracks_backend");
  const usersActor = useActor("users_backend");
  const { user, updateUser } = useUser();
  const { id } = useParams();
  const { principal } = user || {};
  const { transfer } = useKoin(principal ?? null);

  const selectedTrack = tracks?.find((track) => track.id === id);

  const [sectionsWithPositions, setSectionsWithPositions] = useState<any[]>([]);

  const [nftModalData, setNftModalData] = useState<{
    username: string;
    trackName: string;
    timeSpent: bigint;
  } | null>(null);

  const [screenHeight, setScreenHeight] = useState(0);
  const [screenWidth, setScreenWidth] = useState(0);
  const cardDimensions = { width: 320, height: 238 };

  useEffect(() => {
    fetchTracks().then(() => {
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

      const generatedSections = generateSectionPositions(
        selectedTrack.sections,
        {
          cardWidth: cardDimensions.width,
          canvasHeight: currentScreenHeight * 0.8,
          gap: 200,
          initialLeftOffset: 150,
          verticalBounds: [0.2, 0.4],
          maxVerticalShift: 400,
        }
      );
      setSectionsWithPositions(generatedSections);
    }
  }, [selectedTrack, tracks]);

  const handleSectionClick = async (
    section: Section,
    isActive?: boolean,
    isCompleted?: boolean
  ) => {
    console.log(user);
    if (!usersActor || !user) {
      toast.error("Usuário não autenticado.");
      return;
    }

    if (section.id === 1 && !isCompleted && selectedTrack) {
      const timerKey = `track_startTime_${selectedTrack.id}`;
      if (!localStorage.getItem(timerKey)) {
        localStorage.setItem(timerKey, Date.now().toString());
        console.log(`Cronômetro iniciado para a trilha: ${selectedTrack.id}`);
      }
    }
    
    const res = await usersActor.tryAccessSection(
      user.identity,
      selectedTrack?.id ?? "",
      BigInt(section.id)
    );
    if ("err" in res) {
      toast.error(res.err);
      return;
    }
    open({
      type: "section",
      data: {
        ...section,
        onComplete: isActive ? () => handleCompleteSection(section) : null,
        isCompleted,
      },
    });
  };

  const handleCompleteSection = async (section: Section) => {
    if (!user || !selectedTrack) return;

    const progressData = user.inProgressTracks.find(
      (t) => t.id === selectedTrack.id
    );
    const currentProgress = progressData ? progressData.progress : 0;

    if (section.id === currentProgress + 1) {
      const totalSections = selectedTrack.sections.length;

      if (section.id === totalSections) {
        await handleCompleteTrack(selectedTrack.id);
      } else {
        const updatedInProgress = user.inProgressTracks.filter(
          (t) => t.id !== selectedTrack.id
        );
        updatedInProgress.push({ id: selectedTrack.id, progress: section.id });
        await updateUser({ inProgressTracks: updatedInProgress });

        if (transfer && principal) {
          try {
            await transfer(principal, BigInt("5000000000"));
            toastKoin("You've earned 5 Koins for completing the section!");
          } catch {}
        }
      }
    }
  };

  const handleCompleteTrack = async (trackId: string) => {
    if (!user || !selectedTrack) return;

    const timerKey = `track_startTime_${trackId}`;
    const startTimeString = localStorage.getItem(timerKey);
    let timeSpentInSeconds = 0n;

    if (startTimeString) {
      const startTime = parseInt(startTimeString, 10);
      const endTime = Date.now();
      const durationInMs = endTime - startTime;
      const durationInSeconds = Math.round(durationInMs / 1000);
      timeSpentInSeconds = BigInt(durationInSeconds);

      localStorage.removeItem(timerKey);
      console.log(`Trilha finalizada em ${durationInSeconds} segundos.`);
    } else {
      console.warn("Não foi possível encontrar o tempo de início da trilha.");
    }

    const updatedInProgress = user.inProgressTracks.filter(
      (t) => t.id !== trackId
    );
    const updatedCompleted = [...(user.completedTracks || []), trackId];
    await updateUser({
      inProgressTracks: updatedInProgress,
      completedTracks: updatedCompleted,
    });

    if (transfer && principal) {
      try {
        await transfer(principal, BigInt("20000000000"));
        toastKoin("Congratulations! You've completed the track and earned 20 Koins!");
      } catch {
        toast.error("We could not process your final reward.");
      }
    }

    setNftModalData({
      username: user.username,
      trackName: selectedTrack.title,
      timeSpent: timeSpentInSeconds,
    });
  };

  const getButtonTextForContent = (content: Section["content"]): string => {
    if ("Page" in content) return "Read";
    if ("Quiz" in content) return "Answer";
    if ("Flashcard" in content) return "Review";
    if ("Essay" in content) return "Write";
    return "See";
  };

  const canvasWidth = useMemo(() => {
    return Math.max(
      selectedTrack
        ? selectedTrack.sections.length * (cardDimensions.width + 120) + 600
        : 0,
      screenWidth
    );
  }, [screenWidth, selectedTrack]);

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
              <ConnectingArrows
                positions={sectionsWithPositions.map((s) => {
                  const progressData = user?.inProgressTracks.find(
                    (t) => t.id === selectedTrack?.id
                  );
                  const currentProgress = progressData
                    ? progressData.progress
                    : 0;
                  return {
                    ...s.position,
                    active: s.id <= currentProgress,
                  };
                })}
                cardDimensions={cardDimensions}
              />
              {sectionsWithPositions.map((section) => {
                const progressData = user?.inProgressTracks.find(
                  (t) => t.id === selectedTrack?.id
                );
                const currentProgress = progressData
                  ? progressData.progress
                  : 0;
                const isActive = section.id === currentProgress + 1;
                const isCompleted = section.id <= currentProgress;
                return (
                  <SectionCard
                    key={section.id}
                    title={section.title}
                    description={`Seção ${section.id} da trilha.`}
                    buttonText={getButtonTextForContent(section.content)}
                    onClick={() =>
                      handleSectionClick(section, isActive, isCompleted)
                    }
                    style={section.position}
                  />
                );
              })}
            </>
          )}
        </DraggableBackground>
      </Panel>
      <PanelResizeHandle className="bg-zinc-800 w-0.5 cursor-col-resize" />
      <Panel defaultSize={30} minSize={30} maxSize={60} className="h-full">
        <ChatPanel />
      </Panel>
      {nftModalData && (
        <NftModal
          {...nftModalData}
          onClose={() => setNftModalData(null)}
        />
      )}
    </PanelGroup>
  );
}