'use client'
import { TrackCard } from '@/components/specific/tracks/card'
import { ConnectingArrows } from '@/components/specific/tracks/connecting-arrows'
import { DraggableBackground } from '@/components/ui/draggable-bg'
import { generateTrackPositions } from '@/lib/utils'
import { useState, useEffect } from 'react';

const tracks = [
  {
    id: 1,
    title: 'Lorem ipsum',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    buttonText: 'Read',
    href: '/tracks',
    active: true
  },
  {
    id: 2,
    title: 'Lorem ipsum',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    buttonText: 'Watch',
    href: '/tracks',
    active: false
  },
  {
    id: 3,
    title: 'Lorem ipsum',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    buttonText: 'Answer',
    href: '/tracks',
    active: false
  },
  {
    id: 4,
    title: 'Lorem ipsum',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua',
    buttonText: 'Test',
    href: '/tracks',
    active: false
  },
];

export default function TracksPage() {
  const [tracksWithPositions, setTracksWithPositions] = useState<any[]>([]);
  const [screenHeight, setScreenHeight] = useState(0);
  const cardDimensions = { width: 320, height: 238 };

  useEffect(() => {
    const screenHeight = window.innerHeight;
    setScreenHeight(screenHeight);

    const generatedTracks = generateTrackPositions(tracks, {
      cardWidth: cardDimensions.width,
      canvasHeight: screenHeight * 0.8,
      gap: 200,
      initialLeftOffset: 150,
      verticalBounds: [0.2, 0.4],
      maxVerticalShift: 400
    });

    setTracksWithPositions(generatedTracks);

  }, []);

  const canvasWidth = tracks.length * (cardDimensions.width + 120) + 450;

  return (
    <article className='flex-1 flex'>
      <DraggableBackground
        className="h-full w-full bg-gradient-to-t from-primary/5 to-transparent select-none"
        canvasWidth={canvasWidth}
        canvasHeight={screenHeight * 0.8}
        canvasClassName="bg-[radial-gradient(theme(colors.gray.600/0.2)_1px,transparent_0)] bg-[length:20px_20px]"
      >
        {tracksWithPositions.length > 0 && (
          <>
            <ConnectingArrows positions={tracksWithPositions.map(t => ({ ...t.position, active: t.active }))} cardDimensions={cardDimensions} />
            {tracksWithPositions.map(track => (
              <TrackCard
                key={track.id}
                title={track.title}
                description={track.description}
                buttonText={track.buttonText}
                href={track.href}
                style={track.position}
              />
            ))}
          </>
        )}
      </DraggableBackground>

      <div>
        <p>chat</p>
      </div>
    </article>
  )
}