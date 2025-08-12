import { type Message } from '@/types';
import { UserCircleIcon, CpuChipIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx'; // Biblioteca útil para classes condicionais

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    // `flex` para alinhar o ícone e a bolha de texto
    // `justify-end` para o usuário, `justify-start` (padrão) para a IA
    <div className={clsx('flex items-start gap-3', isUser && 'justify-end')}>
      
      {/* Ícone da IA (só aparece se não for o usuário) */}
      {!isUser && (
        <div className="flex-shrink-0 rounded-full bg-zinc-700 p-1.5">
          <CpuChipIcon className="h-6 w-6 text-white" />
        </div>
      )}

      {/* Bolha de texto */}
      <div
        className={clsx(
          'max-w-md rounded-2xl px-4 py-2.5 text-white',
          isUser ? 'rounded-br-none bg-blue-600' : 'rounded-bl-none bg-zinc-800'
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>

      {/* Ícone do Usuário (só aparece se for o usuário) */}
      {isUser && (
        <div className="flex-shrink-0">
          <UserCircleIcon className="h-9 w-9 text-zinc-500" />
        </div>
      )}
    </div>
  );
}