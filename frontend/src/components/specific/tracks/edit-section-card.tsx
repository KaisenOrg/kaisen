import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface TrackCardProps {
  title: string;
  description: string;
  buttonText?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  onTitleChange?: (newTitle: string) => void;
  onDescriptionChange?: (newDescription: string) => void;
}

export function EditSectionCard({
  title,
  description,
  buttonText,
  onClick,
  className,
  style,
  onTitleChange,
  onDescriptionChange
}: TrackCardProps) {
  const [localTitle, setLocalTitle] = useState(title);
  const [localDescription, setLocalDescription] = useState(description);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalTitle(e.target.value);
    onTitleChange?.(e.target.value);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalDescription(e.target.value);
    onDescriptionChange?.(e.target.value);
  };

  return (
    <div style={style} className={`absolute cursor-default ${className}`}>
      <div className='flex flex-col gap-2 bg-card w-80 p-6 border-2 border-zinc-800 rounded-2xl'>
        <label htmlFor="title" className='text-sm'>
          <strong>Title</strong>
        </label>
        <input
          id="title"
          type="text"
          value={localTitle}
          onChange={handleTitleChange}
          className="bg-zinc-800 px-2 py-1 rounded-lg border-none outline-none font-bold text-lg"
          placeholder="Título da seção"
        />
        <label htmlFor="description" className='text-sm'>
          <strong>Description</strong>
        </label>
        <textarea
          id="description"
          value={localDescription}
          onChange={handleDescriptionChange}
          className="bg-zinc-800 px-2 py-1 rounded-lg border-none outline-none text-sm text-zinc-400 resize-none"
          placeholder="Descrição da seção"
          rows={3}
        />
        <Button variant='outline' className='mt-4 cursor-pointer' onClick={onClick}>
          {buttonText || 'Edit'}
        </Button>
      </div>
    </div>
  );
}
