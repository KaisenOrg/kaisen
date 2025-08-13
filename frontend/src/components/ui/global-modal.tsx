import { useModalStore } from '@/stores/useModalStore';
import { Dialog } from "@/components/ui/dialog";
import {
  ContentSectionPreset,
  FlashcardSectionPreset,
  GenericPopupContent,
  QuizSectionPreset,
  EssaySectionPreset,
  LoadingPreset,
  CreateTrackPreset
} from '@/components/specific/modal-presets';
import { AlertDialog } from './alert-dialog';
import { ChooseContentType, CreateSummary } from '../specific/modal-presets/edit-section';

export function GlobalModal() {
  const { isOpen, payload, close } = useModalStore();

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

      case 'choose-section-content':
        return (
          <ChooseContentType />
        );

      case 'create-summary':
        return <CreateSummary content={payload.content} />
        
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