"use client"

import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { EssayQuestion as Essay } from "@/types";
import { useState } from "react";
import { useActor } from "@/lib/agent";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface Props {
  title: string
  pageData: Essay[]
}

export function EssaySectionPreset({ title, pageData }: Props) {
  const kaiActor = useActor("kai_backend");

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState("");
  const [aiFeedback, setAiFeedback] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);

  const question = pageData[currentQuestion];
  const isLastQuestion = currentQuestion === pageData.length - 1;

  const handleCheckAnswer = async () => {
    if (!kaiActor || loading) return;

    setLoading(true);

    const prompt = `
Você está corrigindo uma prova de dissertativa. Considere a seguinte questão:

Questão: ${question.question}

Resposta esperada: ${question.expectedAnswer}

Resposta do aluno: ${answer}

Diga se a resposta está correta ou incorreta e explique o porquê. Retorne uma resposta curta e objetiva começando com "Correto" ou "Incorreto".
`;

    try {
      const response = await kaiActor.generateChatResponse(prompt, []);

      if ('err' in response) {
        setAiFeedback("Erro ao corrigir a resposta.");
        return;
      }

      const formatedResponse = JSON.parse(response.ok).candidates[0].content.parts[0].text;

      setAiFeedback(formatedResponse);

      if (formatedResponse.toLowerCase().startsWith("correto")) {
        setCorrectAnswers(prev => prev + 1);
      }

      setAnsweredQuestions(prev => [...prev, currentQuestion]);

    } catch (err) {
      console.error(err);
      setAiFeedback("Erro ao corrigir a resposta.");
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (isLastQuestion) {
      setShowResult(true);
      return;
    }

    setCurrentQuestion(prev => prev + 1);
    setAnswer("");
    setAiFeedback("");
  };

  const handleClear = () => {
    setAnswer("");
    setAiFeedback("");
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswer("");
    setAiFeedback("");
    setCorrectAnswers(0);
    setShowResult(false);
    setAnsweredQuestions([]);
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
        <>
          <div className="mb-2">
            <Textarea
              placeholder="Digite sua resposta aqui"
              className="min-h-40"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              disabled={aiFeedback !== ""}
            />
          </div>

          {aiFeedback && (
            <div className={cn(
              "p-4 rounded-md text-sm",
              aiFeedback.toLowerCase().startsWith("correto") ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
            )}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {aiFeedback}
              </ReactMarkdown>
            </div>
          )}
        </>
      )}

      <DialogFooter className="mt-2 pb-4">
        {!showResult ? (
          <>
            <Button
              className="flex-1"
              onClick={aiFeedback ? handleNext : handleCheckAnswer}
              disabled={loading || (answer.trim() === "" && aiFeedback === "")}
            >
              {aiFeedback ? (isLastQuestion ? "Finalizar" : "Próximo") : (loading ? "Corrigindo..." : "Enviar")}
            </Button>

            <Button
              className="flex-1"
              variant="outline"
              onClick={handleClear}
              disabled={loading}
            >
              {aiFeedback ? "Try again" : "Clear"}
            </Button>
          </>
        ) : (
          <Button onClick={handleRestart}>
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
