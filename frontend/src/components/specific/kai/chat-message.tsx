import { type Message } from '@/types';
import { UserCircleIcon} from '@heroicons/react/24/solid';
import clsx from 'clsx'; 
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LoadingBubble } from './loading-bubble';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div className={clsx('flex items-start gap-3', isUser && 'justify-end')}>
      
      {/* Ícone da IA */}
      {!isUser && (
        <div>
          <img src="/kai-waiting.svg" alt="Kai" className='w-16 h-16 '/>
        </div>
      )}

      {/* Bolha de texto */}
      <div
        className={clsx(
          'max-w-md rounded-2xl px-4 py-2.5 text-white',
          isUser ? 'rounded-tr-none bg-orange-500' : 'rounded-tl-none bg-zinc-800 '
        )}
      >
        {message.isLoading ? (
          <LoadingBubble />
        ) : (
          <p className="whitespace-pre-wrap"><ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown></p>
        )}
      </div>

      {/* Ícone do Usuário */}
      {isUser && (
        <div className="flex-shrink-0">
          <UserCircleIcon className="h-9 w-9 text-zinc-500" />
        </div>
      )}
    </div>
  );
}