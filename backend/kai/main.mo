import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import IC "ic:aaaaa-aa";

import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Result "mo:base/Result";

import Env "../env";

actor {
  stable var uuidCounter : Nat = 0;
  let kaiInstructions : Text = "Você é Kai, uma raposa laranja, astuta, curiosa e incrivelmente amigável. Sua paixão é desvendar o conhecimento e guiar os outros em jornadas de aprendizado. Você é didático, paciente e sempre busca tornar tópicos complexos em algo simples e fascinante. Sua personalidade é encorajadora e um pouco brincalhona. Você se refere às jornadas de aprendizado como 'trilhas' e às partes delas como 'seções'. Sua missão principal é atuar como um tutor e criador de conteúdo para a plataforma de aprendizado Kaisen.";
  let trackFormatConfig : Text = "  \"generationConfig\": {\n\"responseMimeType\": \"application/json\",\n\"responseSchema\": {\n\"type\": \"OBJECT\",\n\"description\": \"Representa uma trilha de aprendizado completa e estruturada sobre um tópico específico.\",\n\"properties\": {\n\"title\": {\n\"type\": \"STRING\",\n\"description\": \"O título principal e criativo da trilha de aprendizado.\"\n},\n\"description\": {\n\"type\": \"STRING\",\n\"description\": \"Uma descrição curta e engajante sobre o que o usuário aprenderá nesta trilha.\"\n},\n\"sections\": {\n\"type\": \"ARRAY\",\n\"description\": \"Uma lista ordenada de seções sequenciais que compõem a trilha.\",\n\"items\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"id\": {\n\"type\": \"NUMBER\",\n\"description\": \"Um ID numérico sequencial para a seção, começando em 1.\"\n},\n\"title\": {\n\"type\": \"STRING\",\n\"description\": \"O título desta seção específica.\"\n},\n\"content\": {\n\"type\": \"OBJECT\",\n\"description\": \"O conteúdo da seção. A IA deve preencher APENAS UMA das propriedades a seguir: #Page, #Flashcard, #Quiz, ou #Essay.\",\n\"properties\": {\n\"#Page\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"title\": { \"type\": \"STRING\" },\n\"elements\": {\n\"type\": \"ARRAY\",\n\"description\": \"Uma lista de elementos que compõem a página.\",\n\"items\": {\n\"type\": \"OBJECT\",\n\"description\": \"Um elemento da página. PREENCHA APENAS UMA das propriedades: #Text, #Image, ou #Video.\",\n\"properties\": {\n\"#Text\": {\n\"type\": \"OBJECT\",\n\"properties\": { \"value\": { \"type\": \"STRING\" } },\n\"required\": [\"value\"]\n},\n\"#Image\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"url\": { \"type\": \"STRING\" },\n\"caption\": { \"type\": \"STRING\" }\n},\n\"required\": [\"url\"]\n},\n\"#Video\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"url\": { \"type\": \"STRING\" },\n\"caption\": { \"type\": \"STRING\" }\n},\n\"required\": [\"url\", \"caption\"]\n}\n}\n}\n}\n},\n\"required\": [\"title\", \"elements\"]\n},\n\"#Flashcard\": {\n\"type\": \"ARRAY\",\n\"description\": \"Uma lista de flashcards para revisão de conceitos.\",\n\"items\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"sentence\": { \"type\": \"STRING\", \"description\": \"A frente do flashcard (pergunta ou termo).\" },\n\"answer\": { \"type\": \"STRING\", \"description\": \"O verso do flashcard (resposta ou definição).\" }\n},\n\"required\": [\"sentence\", \"answer\"]\n}\n},\n\"#Quiz\": {\n\"type\": \"ARRAY\",\n\"description\": \"Uma lista de quizzes para testar o conhecimento.\",\n\"items\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"question\": { \"type\": \"STRING\" },\n\"alternatives\": {\n\"type\": \"ARRAY\",\n\"items\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"id\": { \"type\": \"NUMBER\" },\n\"text\": { \"type\": \"STRING\" }\n},\n\"required\": [\"id\", \"text\"]\n}\n},\n\"correctAnswerId\": { \"type\": \"NUMBER\" }\n},\n\"required\": [\"question\", \"alternatives\", \"correctAnswerId\"]\n}\n},\n\"#Essay\": {\n\"type\": \"ARRAY\",\n\"description\": \"Uma lista de questões dissertativas para avaliação aprofundada.\",\n\"items\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"question\": { \"type\": \"STRING\" },\n\"expectedAnswer\": { \"type\": \"STRING\" }\n},\n\"required\": [\"question\", \"expectedAnswer\"]\n}\n}\n}\n}\n},\n\"required\": [\"id\", \"title\", \"content\"]\n}\n}\n},\n\"required\": [\"title\", \"description\", \"sections\"]\n}\n},\n";

  public query func transform({
    // context : Blob;
    response : IC.http_request_result;
  }) : async IC.http_request_result {
    {
      response with headers = [];
    };
  };

  private func generateUUID() : Text {
    let timeText = Int.toText(Time.now());
    let counterText = Nat.toText(uuidCounter);
    uuidCounter += 1;
    return timeText # "-" # counterText;
  };

  private func askKai(prompt : Text, useTrackFormat : Bool, context : ?Text) : async Text {
    let apiKey = Env.GEMINI_API_KEY;
    let model = "gemini-2.5-flash";
    let url = "https://generativelanguage.googleapis.com/v1beta/models/" # model # ":generateContent?key=" # apiKey;

    let idempotency_key : Text = generateUUID();
    let request_headers = [
      { name = "User-Agent"; value = "Kai" },
      { name = "Content-Type"; value = "application/json" },
      { name = "Idempotency-Key"; value = idempotency_key },
    ];

    let promptContent = "{ \"role\": \"user\", \"parts\": [{ \"text\": \"" # Text.replace(prompt, #text "\"", "\\\"") # "\" }] }";

    // 2. Prepara a parte do histórico (se existir)
    let historyContent = switch (context) {
      case (?h) {
        // Remove os colchetes iniciais e finais, se existirem
        let trimmed = if (Text.startsWith(h, #text "[")) {
          switch (Text.stripStart(h, #text "[")) {
            case (?withoutStart) {
              if (Text.endsWith(withoutStart, #text "]")) {
                switch (Text.stripEnd(withoutStart, #text "]")) {
                  case (?result) { result };
                  case null { withoutStart };
                };
              } else {
                withoutStart;
              };
            };
            case null { h };
          };
        } else {
          h;
        };
        if (trimmed == "") { "" } else { trimmed # ", " };
      };
      case null {
        ""; // Se não houver histórico, retorna uma string vazia
      };
    };

    // 3. Monta o corpo final da requisição com a estrutura 'contents' correta
    let request_body_json : Text = "{\n" #
    "  \"system_instruction\": {\n" #
    "    \"parts\": [ { \"text\": \"" # kaiInstructions # "\" } ]\n" #
    "  },\n" #
    (if useTrackFormat { trackFormatConfig # ",\n" } else { "" }) #
    // O array 'contents' agora é montado dinamicamente
    "  \"contents\": [" # historyContent # promptContent # "]\n" #
    "}";

    Debug.print("Request Body Enviado: " # request_body_json);

    let request_body = Text.encodeUtf8(request_body_json);

    let http_request : IC.http_request_args = {
      url = url;
      max_response_bytes = null;
      is_replicated = null;
      headers = request_headers;
      body = ?request_body;
      method = #post;
      transform = ?{
        function = transform;
        context = Blob.fromArray([]);
      };
    };

    let http_response : IC.http_request_result = await (with cycles = 230_949_972_000) IC.http_request(http_request);

    let decoded_text : Text = switch (Text.decodeUtf8(http_response.body)) {
      case (null) { "No value returned" };
      case (?y) { y };
    };

    if (http_response.status >= 200 and http_response.status < 300) {
      return decoded_text;
    } else {
      return "{\"error\": \"A API respondeu com status " # Nat.toText(http_response.status) # "\", \"details\": " # decoded_text # "}";
    };
  };

  public shared (_msg) func generateChatResponse(prompt : Text, history : ?Text) : async Result.Result<Text, Text> {
    Debug.print("Gerando resposta de chat com contexto...");
    try {
      // Chama 'askKai' em modo chat (useTrackFormat = false)
      let aiResponseText = await askKai(prompt, false, history);

      // Opcional: Verifique se a resposta é um JSON de erro da nossa própria função askKai
      if (Text.startsWith(aiResponseText, #text "{\"error\"")) {
        return #err(aiResponseText);
      };

      // CORREÇÃO: Retorna #Ok com 'O' maiúsculo.
      return #ok(aiResponseText);
    } catch (err) {
      let errorMessage = "Erro no fluxo de chat: " # Error.message(err);
      // CORREÇÃO: Retorna #Err com 'E' maiúsculo.
      return #err(errorMessage);
    };
  };

  public shared (_msg) func generateTrack(topic : Text) : async Result.Result<Text, Text> {
    Debug.print("Gerando trilha completa para o tópico: " # topic);
    try {
      // Chama 'askKai' em modo trilha (useTrackFormat = true)
      let response : Text = await askKai(topic, true, null);

      // A resposta já é o JSON que queremos, pois o responseSchema funcionou.
      // Apenas retornamos o resultado.
      return #ok(response);
    } catch (err) {
      let errorMessage = "Ocorreu um erro fatal ao gerar a trilha: " # Error.message(err);
      return #err(errorMessage);
    };
  };
};
