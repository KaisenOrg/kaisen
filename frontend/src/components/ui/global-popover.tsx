import { usePopoverStore } from '@/stores/usePopoverStore';
import { Dialog } from "@/components/ui/dialog";
import {
  ContentSectionPreset,
  FlashcardSectionPreset,
  GenericPopupContent,
  QuizSectionPreset,
  EssaySectionPreset,
  LoadingPreset,
  CreateTrackPreset
} from '@/components/specific/popover-presets';
import { AlertDialog } from './alert-dialog';

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
        if ('Quiz' in payload.data.content) {
          return (
            <QuizSectionPreset
              title={payload.data.title}
              pageData={payload.data.content.Quiz}
            />
          );
        }
        if ('Essay' in payload.data.content) {
          return (
            <EssaySectionPreset
              title={payload.data.title}
              pageData={payload.data.content.Essay}
            />
          );
        }
        return (
          <GenericPopupContent
            title="Erro ao carregar o conteúdo"
            description="Aconteceu um erro ao carregar o conteúdo desta seção. Por favor, tente novamente mais tarde."
          />
        );

      case 'loading':
        return (
          <LoadingPreset progress={payload.progress} />
        );

      case 'create-track':
        return (
          <CreateTrackPreset navigate={payload.navigate} />
        );

      case 'generic':
        return (
          <GenericPopupContent
            title={payload.title}
            description={payload.description}
            content={payload.content}
            onConfirm={payload.onConfirm}
            useAlertDialog={payload.useAlertDialog}
          />
        );

      default:
        return null;
    }
  };

  if ((payload?.type === 'generic' && payload?.useAlertDialog) || payload?.type === 'loading') return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && close()}>
      {renderContent()}
    </AlertDialog>
  )

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      {renderContent()}
    </Dialog>
  );
}