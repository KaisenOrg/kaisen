import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { generateSectionPositions, type PositionedSection } from '@/lib/mappers'
import { type Section } from '@/types'

import { ConnectingArrows } from '@/components/specific/tracks/connecting-arrows'
import { EditSectionCard } from '@/components/specific/tracks/edit-section-card'
import { ChatPanel } from '@/components/specific/tracks/chat-panel'
import { DraggableBackground } from '@/components/ui/draggable-bg'

import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"

import { useTrackStore } from '@/stores/useTrackStore'
import { useModalStore } from '@/stores/useModalStore'

export default function EditTrackPage() {
  const { tracks, isLoading } = useTrackStore()
  const { open } = useModalStore()
  const { id } = useParams()

  const selectedTrack = tracks?.find((track) => track.id === id)

  const [sectionsWithPositions, setSectionsWithPositions] = useState<PositionedSection[]>([])
  const [screenHeight, setScreenHeight] = useState(0)
  const [screenWidth, setScreenWidth] = useState(0)
  const cardDimensions = { width: 320, height: 238 }

  useEffect(() => {
    if (selectedTrack && selectedTrack.sections.length > 0) {
      const currentScreenHeight = window.innerHeight
      const currentScreenWidth = window.innerWidth
      setScreenHeight(currentScreenHeight)
      setScreenWidth(currentScreenWidth)

      const generatedSections = generateSectionPositions(selectedTrack.sections, {
        cardWidth: cardDimensions.width,
        canvasHeight: currentScreenHeight * 0.8,
        gap: 200,
        initialLeftOffset: 150,
        verticalBounds: [0.2, 0.4],
        maxVerticalShift: 400
      })
      setSectionsWithPositions(generatedSections)
    }
  }, [selectedTrack, tracks])

  const handleSectionClick = (section: Section) => {
    if (!!('Page' in section.content) && !!selectedTrack)
      open({ type: 'create-summary', section, trackId: selectedTrack.id })
  }

  const getSectionTypeForContent = (content: Section['content']): string => {
    if ('Page' in content) return 'Page'
    if ('Quiz' in content) return 'Quiz'
    if ('Flashcard' in content) return 'Flashcard'
    if ('Essay' in content) return 'Essay'
    return 'Unknown'
  }

  const canvasWidth = useMemo(() => {
    return Math.max(selectedTrack ? selectedTrack.sections.length * (cardDimensions.width + 120) + 600 : 0, screenWidth)
  }, [screenWidth])

  return (
    <PanelGroup direction="horizontal" className="flex-1 flex h-full">
      <Panel defaultSize={75} minSize={20} className="flex-1 flex">
        <DraggableBackground
          className="h-full w-full bg-gradient-to-t from-primary/5 to-transparent select-none"
          canvasWidth={canvasWidth}
          canvasHeight={screenHeight * 0.8}
        >
          {sectionsWithPositions.length > 0 && !isLoading && selectedTrack && (
            <>
              <ConnectingArrows positions={sectionsWithPositions.map(s => ({ ...s.position, active: s.active }))} cardDimensions={cardDimensions} />
              {sectionsWithPositions.map((section, index) => (
                <EditSectionCard
                  key={(section.id + index).toString()}
                  section={section}
                  description={`Section ${index + 1} of ${selectedTrack?.sections.length || 1}`}
                  trackId={selectedTrack.id}
                  sectionType={getSectionTypeForContent(section.content)}
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