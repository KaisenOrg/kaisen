import { Button } from '@/components/ui/button';
import { useModalStore } from '@/stores/useModalStore';
import type { Section } from '@/types';

interface SectionCardProps {
  trackId: string;
  section: Section;
  sectionType: string;
  description: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function EditSectionCard({ trackId, section, description, sectionType, onClick, className, style }: SectionCardProps) {
  const { open } = useModalStore();

  const handleChangeContent = () => {
    if (!trackId) return

    open({ type: 'choose-section-content', section, trackId });
  }

  return (
    <div style={style} className={`absolute cursor-default ${className}`}>
      <div className='flex flex-col gap-2 bg-card w-80 p-6 border-2 border-zinc-800 rounded-2xl'>
        <strong>{section.title}</strong>

        <span className='bg-zinc-800 text-white text-xs px-4 py-1 rounded-full w-min'>
          {sectionType}
        </span>

        <p className='text-sm text-zinc-400'>
          {description}
        </p>

        <div className='flex flex-col'>
          <Button variant='outline' className='mt-4 cursor-pointer' onClick={onClick}>
            Edit
          </Button>
          <Button variant='ghost' className='mt-4 cursor-pointer' onClick={handleChangeContent}>
            Change content type
          </Button>
        </div>
      </div>
    </div>
  );
}