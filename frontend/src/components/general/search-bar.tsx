import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon, UserGroupIcon, DocumentTextIcon, CalendarDaysIcon, PlusIcon as HeroPlusIcon } from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";

// Define a estrutura de um item de resultado da pesquisa
interface SearchResult {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  end?: string;
  type: 'action' | 'report' | 'user' | 'meeting';
}

// Dados de exemplo para simular uma pesquisa
type SearchResultData = {
  id: string;
  label: string;
  icon: string;
  description?: string;
  end?: string;
  type: 'action' | 'report' | 'user' | 'meeting';
};
const allData: SearchResultData[] = [
  { id: '1', label: 'Create learning track', icon: 'PlusIcon', description: 'Create', end: 'Action', type: 'action' },
];

export function ActionSearchBar() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultData[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Efeito para simular a pesquisa com lógica condicional de debounce
  useEffect(() => {
    // Se o campo não estiver focado, limpa tudo.
    if (!isFocused) {
      setSearchResults([]);
      setIsLoadingSearch(false);
      return;
    }

    // Se estiver focado, mas sem texto, mostra os resultados iniciais imediatamente.
    if (query.length === 0) {
      setIsLoadingSearch(false); // Garante que o loading não apareça
      setSearchResults(allData);
      return; // Sai do efeito para não ativar o debounce
    }

    // Se estiver focado E com texto, aplica o debounce.
    setIsLoadingSearch(true);
    const handler = setTimeout(() => {
      const filtered = allData.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.description?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setIsLoadingSearch(false);
    }, 300);

    // Limpa o timeout se o utilizador continuar a digitar
    return () => clearTimeout(handler);

  }, [query, isFocused]);

  // Efeito para fechar o dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Efeito para o atalho Ctrl+K
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.getElementById("action-search");
        searchInput?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Variantes de animação (MODIFICADO)
  // A propriedade 'exit' foi removida para desativar a animação de fecho.
  const containerVariants = {
    hidden: { opacity: 0, y: -5 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
    // A propriedade 'exit' foi removida daqui.
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchContainerRef}>
      <div className="relative">
        <Input
          id="action-search"
          type="text"
          placeholder="Search anything..."
          className="pl-4 pr-10 py-2 h-12 text-base rounded-lg focus-visible:ring-offset-0 w-full shadow-sm"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
        />
        <div className="absolute right-3 top-0 h-full flex items-center pointer-events-none">
          {isLoadingSearch ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      <AnimatePresence>
        {isFocused && searchResults.length > 0 && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-2 w-full border rounded-lg shadow-lg overflow-hidden bg-card z-50 border-border"
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit="exit" // Apesar de o 'exit' estar aqui, ele não encontrará uma definição em 'containerVariants', desativando a animação.
          >
            <motion.ul className="max-h-80 overflow-hidden">
              {searchResults.map((resultItem) => {
                let IconComponent;
                switch (resultItem.icon) {
                  case 'PlusIcon': IconComponent = <HeroPlusIcon className="h-5 w-5 text-primary" />; break;
                  case 'Users': IconComponent = <UserGroupIcon className="h-5 w-5 text-chart-2" />; break;
                  case 'FileText': IconComponent = <DocumentTextIcon className="h-5 w-5 text-chart-3" />; break;
                  case 'Calendar': IconComponent = <CalendarDaysIcon className="h-5 w-5 text-chart-4" />; break;
                  default: IconComponent = null;
                }
                return (
                  <motion.li
                    key={resultItem.id}
                    className="px-4 py-3 flex items-center justify-between hover:bg-muted/60 cursor-pointer transition-colors"
                    variants={itemVariants}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {IconComponent}
                      <span className="text-base text-foreground truncate font-medium">{resultItem.label}</span>
                      <span className="text-sm text-muted-foreground ml-1 truncate">{resultItem.description}</span>
                    </div>
                    <Badge variant="secondary" className="font-normal bg-accent text-accent-foreground border-border">
                      {resultItem.end}
                    </Badge>
                  </motion.li>
                );
              })}
            </motion.ul>
            <div className="px-4 py-2 border-t border-border bg-zinc-900">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{searchResults.length} results</span>
                <span>ESC to close</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}