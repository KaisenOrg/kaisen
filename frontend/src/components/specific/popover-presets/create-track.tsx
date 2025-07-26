'use client';

import {
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTracksActions } from '@/hooks/useTracksActions';
import { useActor } from '@/lib/agent';
import { useState } from 'react';
import type { Section } from '@/types';
import { usePopoverStore } from '@/stores/usePopoverStore';

export function CreateTrackPreset({ navigate }: { navigate: (route: string) => void }) {
  const { createTrack } = useTracksActions();
  const { close } = usePopoverStore();
  const kaiActor = useActor('kai_backend');

  const [topic, setTopic] = useState('');
  const [track, setTrack] = useState<{
    title: string;
    description: string;
    sections: Section[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!kaiActor) return;
    setLoading(true);
    setError(null);
    try {
      const result = await kaiActor.generateTrack(topic);
      if ('ok' in result) {
        const parsed = JSON.parse(
          JSON.parse(result.ok).candidates[0].content.parts[0].text.replaceAll('#', '')
        );

        console.log(JSON.stringify(parsed, null, 2));

        const { title, description, sections } = parsed;
        setTrack({ title, description, sections });
      } else {
        setError(result.err);
      }
    } catch (err) {
      setError('Failed to generate track.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!track) return;
    try {
      const id = await createTrack({
        title: track.title,
        description: track.description,
        sections: track.sections,
      });

      if (!id) {
        setError('Failed to save track.');
        return;
      }

      navigate(`/tracks/${id}`);
      close();
    } catch (err) {
      setError('Failed to save track.');
      console.error(err);
    }
  };

  return (
    <DialogContent className="max-w-xl" style={{ borderColor: 'var(--border)' }}>
      <DialogTitle className="text-2xl font-semibold">Create Track</DialogTitle>
      <DialogDescription>
        Generate a learning track based on a topic and confirm to add it.
      </DialogDescription>

      <div className="space-y-4 mt-4">
        {!track && (
          <>
            <Input
              placeholder="Enter a topic (e.g. Intro to AI)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={loading}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button
              onClick={handleGenerate}
              disabled={loading || topic.trim() === ''}
              className="w-full"
            >
              {loading ? 'Generating track...' : 'Generate with AI'}
            </Button>
          </>
        )}

        {track && (
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Track Details</h3>
              <p className="text-sm text-muted-foreground">
                <strong>Title:</strong> {track.title}
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Description:</strong> {track.description}
              </p>
            </div>
            <div className="rounded-md border p-3 bg-muted/40 max-h-72 overflow-y-auto">
              {track.sections.map((section, index) => (
                <div
                  key={index}
                  className="p-2 border-b last:border-none text-sm"
                >
                  <p className="font-medium">
                    {index + 1}. {section.title}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    Type: {Object.keys(section.content)[0]}
                  </p>
                </div>
              ))}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => {
                  setTrack(null);
                  setError(null);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Add Track
              </Button>
            </div>
          </div>
        )}
      </div>
    </DialogContent>
  );
}
