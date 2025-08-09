import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Time "mo:base/Time";
import Principal "mo:base/Principal";
import HashMap "mo:base/HashMap";
import Array "mo:base/Array";
import Char "mo:base/Char";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import IC "ic:aaaaa-aa";

import Error "mo:base/Error";
import Result "mo:base/Result";

import Env "../env";

persistent actor {
  var uuidCounter : Nat = 0;
  transient var pendingImageResponses : HashMap.HashMap<Principal, Text> = HashMap.HashMap<Principal, Text>(1, Principal.equal, Principal.hash);
  transient let kaiInstructions : Text = "Você é Kai, uma raposa laranja, astuta, curiosa e incrivelmente amigável. Sua paixão é desvendar o conhecimento e guiar os outros em jornadas de aprendizado. Você é didático, paciente e sempre busca tornar tópicos complexos em algo simples e fascinante. Sua personalidade é encorajadora e um pouco brincalhona. Você se refere às jornadas de aprendizado como 'trilhas' e às partes delas como 'seções'. Sua missão principal é atuar como um tutor e criador de conteúdo para a plataforma de aprendizado Kaisen. Além disso, você responde com uma quantidade moderada de palavras, não muitas nem poucas.";
  transient let trackGenerationConfig : Text = "  \"generationConfig\": {\n\"responseMimeType\": \"application/json\",\n\"responseSchema\": {\n\"type\": \"OBJECT\",\n\"description\": \"Representa uma trilha de aprendizado completa e estruturada sobre um tópico específico.\",\n\"properties\": {\n\"title\": {\n\"type\": \"STRING\",\n\"description\": \"O título principal e criativo da trilha de aprendizado.\"\n},\n\"description\": {\n\"type\": \"STRING\",\n\"description\": \"Uma descrição curta e engajante sobre o que o usuário aprenderá nesta trilha.\"\n},\n\"sections\": {\n\"type\": \"ARRAY\",\n\"description\": \"Uma lista ordenada de seções sequenciais que compõem a trilha.\",\n\"items\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"id\": {\n\"type\": \"NUMBER\",\n\"description\": \"Um ID numérico sequencial para a seção, começando em 1.\"\n},\n\"title\": {\n\"type\": \"STRING\",\n\"description\": \"O título desta seção específica.\"\n},\n\"content\": {\n\"type\": \"OBJECT\",\n\"description\": \"O conteúdo da seção. A IA deve preencher APENAS UMA das propriedades a seguir: #Page, #Flashcard, #Quiz, ou #Essay.\",\n\"properties\": {\n\"#Page\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"title\": { \"type\": \"STRING\" },\n\"elements\": {\n\"type\": \"ARRAY\",\n\"description\": \"Uma lista de elementos que compõem a página.\",\n\"items\": {\n\"type\": \"OBJECT\",\n\"description\": \"Um elemento da página. PREENCHA APENAS UMA das propriedades: #Text, #Image, ou #Video.\",\n\"properties\": {\n\"#Text\": {\n\"type\": \"OBJECT\",\n\"properties\": { \"value\": { \"type\": \"STRING\" } },\n\"required\": [\"value\"]\n},\n\"#Image\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"url\": { \"type\": \"STRING\" },\n\"caption\": { \"type\": \"STRING\" }\n},\n\"required\": [\"url\"]\n},\n\"#Video\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"url\": { \"type\": \"STRING\" },\n\"caption\": { \"type\": \"STRING\" }\n},\n\"required\": [\"url\", \"caption\"]\n}\n}\n}\n}\n},\n\"required\": [\"title\", \"elements\"]\n},\n\"#Flashcard\": {\n\"type\": \"ARRAY\",\n\"description\": \"Uma lista de flashcards para revisão de conceitos.\",\n\"items\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"sentence\": { \"type\": \"STRING\", \"description\": \"A frente do flashcard (pergunta ou termo).\" },\n\"answer\": { \"type\": \"STRING\", \"description\": \"O verso do flashcard (resposta ou definição).\" }\n},\n\"required\": [\"sentence\", \"answer\"]\n}\n},\n\"#Quiz\": {\n\"type\": \"ARRAY\",\n\"description\": \"Uma lista de quizzes para testar o conhecimento.\",\n\"items\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"question\": { \"type\": \"STRING\" },\n\"alternatives\": {\n\"type\": \"ARRAY\",\n\"items\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"id\": { \"type\": \"NUMBER\" },\n\"text\": { \"type\": \"STRING\" }\n},\n\"required\": [\"id\", \"text\"]\n}\n},\n\"correctAnswerId\": { \"type\": \"NUMBER\" }\n},\n\"required\": [\"question\", \"alternatives\", \"correctAnswerId\"]\n}\n},\n\"#Essay\": {\n\"type\": \"ARRAY\",\n\"description\": \"Uma lista de questões dissertativas para avaliação aprofundada.\",\n\"items\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"question\": { \"type\": \"STRING\" },\n\"expectedAnswer\": { \"type\": \"STRING\" }\n},\n\"required\": [\"question\", \"expectedAnswer\"]\n}\n}\n}\n}\n},\n\"required\": [\"id\", \"title\", \"content\"]\n}\n}\n},\n\"required\": [\"title\", \"description\", \"sections\"]\n}\n},\n";
  transient let sectionGenerationConfig : Text = "  \"generationConfig\": {\n\"responseMimeType\": \"application/json\",\n\"responseSchema\": {\n\"type\": \"OBJECT\",\n\"description\": \"Uma seção sequencial que compõe a trilha.\",\n\"properties\": {\n\"id\": {\n\"type\": \"NUMBER\",\n\"description\": \"Um ID numérico sequencial para a seção, começando em 1.\"\n},\n\"title\": {\n\"type\": \"STRING\",\n\"description\": \"O título desta seção específica.\"\n},\n\"content\": {\n\"type\": \"OBJECT\",\n\"description\": \"O conteúdo da seção. A IA deve preencher APENAS UMA das propriedades a seguir: #Page, #Flashcard, #Quiz, ou #Essay.\",\n\"properties\": {\n\"#Page\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"title\": { \"type\": \"STRING\" },\n\"elements\": {\n\"type\": \"ARRAY\",\n\"description\": \"Uma lista de elementos que compõem a página.\",\n\"items\": {\n\"type\": \"OBJECT\",\n\"description\": \"Um elemento da página. PREENCHA APENAS UMA das propriedades: #Text, #Image, ou #Video.\",\n\"properties\": {\n\"#Text\": {\n\"type\": \"OBJECT\",\n\"properties\": { \"value\": { \"type\": \"STRING\" } },\n\"required\": [\"value\"]\n},\n\"#Image\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"url\": { \"type\": \"STRING\" },\n\"caption\": { \"type\": \"STRING\" }\n},\n\"required\": [\"url\"]\n},\n\"#Video\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"url\": { \"type\": \"STRING\" },\n\"caption\": { \"type\": \"STRING\" }\n},\n\"required\": [\"url\", \"caption\"]\n}\n}\n}\n}\n},\n\"required\": [\"title\", \"elements\"]\n},\n\"#Flashcard\": {\n\"type\": \"ARRAY\",\n\"description\": \"Uma lista de flashcards para revisão de conceitos.\",\n\"items\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"sentence\": { \"type\": \"STRING\", \"description\": \"A frente do flashcard (pergunta ou termo).\" },\n\"answer\": { \"type\": \"STRING\", \"description\": \"O verso do flashcard (resposta ou definição).\" }\n},\n\"required\": [\"sentence\", \"answer\"]\n}\n},\n\"#Quiz\": {\n\"type\": \"ARRAY\",\n\"description\": \"Uma lista de quizzes para testar o conhecimento.\",\n\"items\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"question\": { \"type\": \"STRING\" },\n\"alternatives\": {\n\"type\": \"ARRAY\",\n\"items\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"id\": { \"type\": \"NUMBER\" },\n\"text\": { \"type\": \"STRING\" }\n},\n\"required\": [\"id\", \"text\"]\n}\n},\n\"correctAnswerId\": { \"type\": \"NUMBER\" }\n},\n\"required\": [\"question\", \"alternatives\", \"correctAnswerId\"]\n}\n},\n\"#Essay\": {\n\"type\": \"ARRAY\",\n\"description\": \"Uma lista de questões dissertativas para avaliação aprofundada.\",\n\"items\": {\n\"type\": \"OBJECT\",\n\"properties\": {\n\"question\": { \"type\": \"STRING\" },\n\"expectedAnswer\": { \"type\": \"STRING\" }\n},\n\"required\": [\"question\", \"expectedAnswer\"]\n}\n}\n}\n}\n},\n\"required\": [\"id\", \"title\", \"content\"]\n}\n},\n";
  transient let imageGenerationConfig : Text = "  \"generationConfig\":{\n\"responseModalities\": [\"TEXT\",\"IMAGE\"]\n},\n";

  public query func transform({ response : IC.http_request_result }) : async IC.http_request_result {
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

  private func askKai(prompt : Text, responseConfig : ?Text, context : ?Text, model : ?Text, isImageGeneration : Bool) : async Text {
    let apiKey = Env.GEMINI_API_KEY;
    let url = "https://generativelanguage.googleapis.com/v1beta/models/" # (switch (model) { case (?m) { m }; case null { "gemini-2.5-flash" } }) # ":generateContent?key=" # apiKey;

    let idempotency_key : Text = generateUUID();
    let request_headers = [
      { name = "User-Agent"; value = "Kai" },
      { name = "Content-Type"; value = "application/json" },
      { name = "Idempotency-Key"; value = idempotency_key },
    ];

    let promptContent = "{ \"role\": \"user\", \"parts\": [{ \"text\": \"" # Text.replace(prompt, #text "\"", "\\\"") # "\" }] }";

    let historyContent = switch (context) {
      case (?h) {
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
        "";
      };
    };

    let request_body_json : Text = "{\n" #
    (if (isImageGeneration == false) { "  \"system_instruction\": {\n    \"parts\": [ { \"text\": \"" # kaiInstructions # "\" } ]\n  },\n" } else { "" }) #
    (switch (responseConfig) { case (?cfg) { cfg }; case null { "" } }) #
    "  \"contents\": [" # historyContent # promptContent # "]\n" #
    "}";

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
    try {
      let aiResponseText = await askKai(prompt, null, history, null, false);

      if (Text.startsWith(aiResponseText, #text "{\"error\"")) {
        return #err(aiResponseText);
      };

      return #ok(aiResponseText);
    } catch (err) {
      let errorMessage = "Erro no fluxo de chat: " # Error.message(err);
      return #err(errorMessage);
    };
  };

  public shared (_msg) func generateTrack(topic : Text, context : ?Text) : async Result.Result<Text, Text> {
    try {
      let response : Text = await askKai(topic, ?trackGenerationConfig, context, null, false);

      return #ok(response);
    } catch (err) {
      let errorMessage = "Ocorreu um erro fatal ao gerar a trilha: " # Error.message(err);
      return #err(errorMessage);
    };
  };

  public shared (_msg) func generateSection(topic : Text, context : ?Text) : async Result.Result<Text, Text> {
    try {
      let response : Text = await askKai(topic, ?sectionGenerationConfig, context, null, false);

      return #ok(response);
    } catch (err) {
      let errorMessage = "Ocorreu um erro fatal ao gerar a seção: " # Error.message(err);
      return #err(errorMessage);
    };
  };

  public shared (_msg) func regenerateTrackDescription(topic : Text, context : ?Text) : async Result.Result<Text, Text> {
    try {
      let response : Text = await askKai(topic, null, context, null, false);

      return #ok(response);
    } catch (err) {
      let errorMessage = "Ocorreu um erro fatal ao gerar a descrição da trilha: " # Error.message(err);
      return #err(errorMessage);
    };
  };

  public shared (msg) func requestImageGeneration(prompt : Text, context : ?Text) : async Result.Result<Null, Text> {
    let caller = msg.caller;

    try {
      let responseText : Text = await askKai(
        prompt,
        ?imageGenerationConfig,
        context,
        ?"gemini-2.0-flash-preview-image-generation",
        true,
      );

      if (Text.startsWith(responseText, #text "{\"error\"")) {
        return #err("Erro retornado pela API do Gemini: " # responseText);
      };

      // Armazena a resposta bruta associada ao chamador
      pendingImageResponses.put(caller, responseText);

      return #ok(null);

    } catch (err) {
      let errorMessage = "Ocorreu um erro fatal ao requisitar a imagem: " # Error.message(err);
      return #err(errorMessage);
    };
  };

  // NOVA FUNÇÃO 2: Pega o resultado armazenado e o processa
  public shared (msg) func processImageResponse() : async Result.Result<Text, Text> {
    let caller = msg.caller;

    // Pega a resposta pendente para este usuário
    switch (pendingImageResponses.get(caller)) {
      case (null) {
        return #err("Nenhuma resposta de imagem pendente encontrada para você. Por favor, requisite uma primeiro.");
      };
      case (?responseText) {
        // Remove a entrada do mapa para limpar a memória
        pendingImageResponses.delete(caller);

        // Agora, executa a análise pesada em sua própria transação
        return extractImageData(responseText);
      };
    };
  };

  private func extractImageData(jsonText : Text) : Result.Result<Text, Text> {
    let mainChars = Text.toArray(jsonText);
    let mimeTypeKeyChars = Text.toArray("\"mimeType\": \"");
    let dataKeyChars = Text.toArray("\"data\": \"");

    // Função auxiliar para extrair um valor de texto delimitado por aspas
    func extractValue(keyChars : [Char], startPos : Nat) : ?{
      value : [Char];
      newStart : Nat;
    } {
      // Encontra a posição da chave
      switch (_findSubArray(mainChars, keyChars, startPos)) {
        case (null) { return null }; // Chave não encontrada
        case (?keyEndPos) {
          let valueStartPos = keyEndPos + keyChars.size();

          var valueChars : [Char] = [];
          var i = valueStartPos;

          // Itera para encontrar a próxima aspa
          while (i < mainChars.size()) {
            if (mainChars[i] == Char.fromNat32(34)) {
              // Encontrou o final, retorna o valor e a nova posição para continuar a busca
              return ?{ value = valueChars; newStart = i + 1 };
            };
            valueChars := Array.append<Char>(valueChars, [mainChars[i]]);
            i += 1;
          };

          // Se chegar aqui, o JSON está malformado (sem aspa de fechamento)
          return null;
        };
      };
    };

    var mimeType : Text = "";
    var base64Data : Text = "";
    var searchStart : Nat = 0;

    // Extrai o mimeType
    switch (extractValue(mimeTypeKeyChars, searchStart)) {
      case (null) {
        return #err("Não foi possível extrair o 'mimeType' da resposta.");
      };
      case (?result) {
        mimeType := Text.fromArray(result.value);
        searchStart := result.newStart; // Atualiza a posição para a próxima busca
      };
    };

    // Extrai os dados base64, continuando de onde parou
    switch (extractValue(dataKeyChars, searchStart)) {
      case (null) {
        return #err("Não foi possível extrair os dados 'data' da resposta.");
      };
      case (?result) {
        base64Data := Text.fromArray(result.value);
      };
    };

    // Monta o Data URL final e retorna sucesso
    let dataUrl = "data:" # mimeType # ";base64," # base64Data;

    return #ok(dataUrl);
  };

  private func _findSubArray(main : [Char], sub : [Char], start : Nat) : ?Nat {
    if (sub.size() == 0 or main.size() < sub.size() + start) {
      return null;
    };

    var i = start;
    let limit = Nat.sub(main.size(), sub.size());
    label outer while (i <= limit) {
      var j = 0;
      var found = true;
      label inner while (j < sub.size()) {
        if (main[i + j] != sub[j]) {
          found := false;
          break inner;
        };
        j := j + 1;
      };
      if (found) {
        return ?i;
      };
      i := i + 1;
    };
    return null;
  };
};
