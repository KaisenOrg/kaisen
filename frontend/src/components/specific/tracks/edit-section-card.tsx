import { Button } from '@/components/ui/button';
import { useModalStore } from '@/stores/useModalStore';

interface SectionCardProps {
  title: string;
  description: string;
  sectionType: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export function EditSectionCard({ title, description, sectionType, onClick, className, style }: SectionCardProps) {
  const { open } = useModalStore();

  const handleChangeContent = () => {
    open({ type: 'choose-section-content' });
  }

  return (
    <div style={style} className={`absolute cursor-default ${className}`}>
      <div className='flex flex-col gap-2 bg-card w-80 p-6 border-2 border-zinc-800 rounded-2xl'>
        <strong>{title}</strong>

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