import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Quiz } from "@/types";
import { useState } from "react";

interface Props {
  title: string
  pageData: Quiz[]
}

export function QuizSectionPreset({ title, pageData }: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]); // guarda as questões já respondidas
  const [showResult, setShowResult] = useState(false);

  const question = pageData[currentQuestion];
  const isLastQuestion = currentQuestion === pageData.length - 1;

  const handleSelect = (index: number) => {
    if (selected !== null) return; // Evita selecionar de novo

    setSelected(index);

    if (question.alternatives[index].id === question.correctAnswerId) {
      setCorrectAnswers(prev => prev + 1);
    }

    setAnsweredQuestions(prev => [...prev, currentQuestion]);
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResult(true);
      return;
    }

    setCurrentQuestion(prev => prev + 1);
    setSelected(null);
  };

  const handlePrev = () => {
    if (currentQuestion === 0) return;

    setCurrentQuestion(prev => prev - 1);
    setSelected(null);
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelected(null);
    setCorrectAnswers(0);
    setAnsweredQuestions([]);
    setShowResult(false);
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="text-2xl">
          {title}
        </DialogTitle>

        {!showResult ? (
          <DialogDescription className="text-base text-foreground">
            {`${currentQuestion + 1}. ${question.question}`}
          </DialogDescription>
        ) : (
          <DialogDescription className="text-base text-foreground">
            Você acertou {correctAnswers} de {pageData.length} questões.
          </DialogDescription>
        )}
      </DialogHeader>

      {!showResult && (
        <div className="flex flex-col gap-2 mb-2">
          {question.alternatives.map((alt, index) => {
            const isSelected = selected === index;
            const isCorrect = alt.id === question.correctAnswerId;

            return (
              <button
                key={alt.id}
                onClick={() => handleSelect(index)}
                className={cn(
                  "relative overflow-hidden py-4 px-6 border-2 border-zinc-800 rounded-lg text-left transition-colors",
                  selected !== index && "hover:bg-zinc-700/10 cursor-pointer",
                  selected !== null && (
                    isSelected
                      ? (isCorrect ? "bg-green-500/20 border-green-500" : "bg-red-500/20 border-red-500")
                      : "opacity-60"
                  )
                )}
                disabled={selected !== null} // Desativa após escolha
              >
                <span className={cn(
                  "border-2 border-zinc-800 rounded-full w-3.5 h-4/5 absolute left-0 top-1/2 -translate-y-1/2",
                  selected !== null && isSelected && (isCorrect ? "bg-green-500 border-green-500" : "bg-red-500 border-red-500")
                )} />
                <span className="text-sm">
                  {alt.text}
                </span>
              </button>
            );
          })}
        </div>
      )}

      <DialogFooter>
        {!showResult ? (
          <>
            <Button variant="outline" onClick={handlePrev} disabled={currentQuestion === 0}>
              Voltar
            </Button>

            <Button onClick={handleNext} disabled={selected === null}>
              {isLastQuestion ? "Finalizar" : "Próximo"}
            </Button>
          </>
        ) : (
          <Button onClick={handleReset}>
            Reiniciar Quiz
          </Button>
        )}

        <Progress
          indicatorClassName="bg-green-400"
          className="absolute bottom-0 left-0 right-0"
          value={(answeredQuestions.length / pageData.length) * 100}
        />
      </DialogFooter>
    </DialogContent>
  );
}
