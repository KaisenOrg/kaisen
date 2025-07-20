'use client';

import { usePopoverStore } from '@/store/usePopoverStore';
import { Dialog } from "@/components/ui/dialog";
import {
  ContentSectionPreset,
  FlashcardSectionPreset,
  GenericPopupContent,
} from '@/components/specific/popover-presets';

export function GlobalPopover() {
  const { isOpen, payload, close } = usePopoverStore();

  const renderContent = () => {
    if (!payload) return null;

    switch (payload.type) {
      case 'section':
        if ('Page' in payload.data.content) {
          return (
            <ContentSectionPreset
              title={payload.data.title}
              pageData={payload.data.content.Page}
            />
          );
        }
        if ('Flashcard' in payload.data.content) {
          return (
            <FlashcardSectionPreset
              title={payload.data.title}
              flashcards={payload.data.content.Flashcard}
            />
          );
        }
        return (
          <GenericPopupContent
            title="Erro ao carregar o conteúdo"
            description="Aconteceu um erro ao carregar o conteúdo desta seção. Por favor, tente novamente mais tarde."
          />
        );

      case 'generic':
        return (
          <GenericPopupContent
            title={payload.title}
            description={payload.description}
            content={payload.content}
            onConfirm={payload.onConfirm}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      {renderContent()}
    </Dialog>
  );
}