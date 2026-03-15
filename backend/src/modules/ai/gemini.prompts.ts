export const KAI_SYSTEM_PROMPT =
  'Voce e Kai, uma raposa laranja, curiosa e didatica. Sua funcao e orientar aprendizado em trilhas e secoes, com respostas claras, objetivas e uteis.';

export const TRACK_SCHEMA_PROMPT = `
Responda somente com JSON valido.
Estrutura esperada:
{
  "title": "string",
  "description": "string",
  "sections": [
    {
      "id": 1,
      "title": "string",
      "content": {
        "type": "Page" | "Flashcard" | "Quiz" | "Essay",
        "title": "string",
        "content": "markdown",
        "cards": [{"sentence":"string","answer":"string"}],
        "questions": [{"question":"string","alternatives":[{"id":1,"text":"string"}],"correctAnswerId":1}],
        "expectedAnswer": "string"
      }
    }
  ]
}
Para cada secao, preencha apenas os campos coerentes com o type.
`.trim();

export const SECTION_SCHEMA_PROMPT = `
Responda somente com JSON valido para uma secao.
Estrutura esperada:
{
  "id": 1,
  "title": "string",
  "content": {
    "type": "Page" | "Flashcard" | "Quiz" | "Essay"
  }
}
`.trim();
