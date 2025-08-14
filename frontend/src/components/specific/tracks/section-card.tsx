import { Button } from '@/components/ui/button';

interface SectionCardProps {
  title: string;
  description: string;
  buttonText: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onComplete?: (() => void) | null;
  isCompleted?: boolean;
}

export function SectionCard({ title, description, buttonText, onClick, className, style, onComplete, isCompleted }: SectionCardProps) {
  return (
    <div style={style} className={`absolute cursor-default ${className}`}>
      <div className='flex flex-col gap-2 bg-card w-80 p-6 border-2 border-zinc-800 rounded-2xl'>
        <strong>{title}</strong>
        <p className='text-sm text-zinc-400'>
          {description}
        </p>
        <Button variant='outline' className='mt-4 cursor-pointer' onClick={onClick}>
          {buttonText}
        </Button>
        {onComplete && (
          <Button
            variant={isCompleted ? 'default' : 'secondary'}
            className='mt-2 cursor-pointer'
            onClick={onComplete}
            disabled={isCompleted}
          >
            {isCompleted ? 'Concluída' : 'Marcar como concluída'}
          </Button>
        )}
      </div>
    </div>
  );
}