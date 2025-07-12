import Principal "mo:base/Principal";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Time "mo:base/Time";
import Nat "mo:base/Nat";
import Int "mo:base/Int";
import IC "ic:aaaaa-aa";

import Debug "mo:base/Debug";
import Error "mo:base/Error";

import Env "../env";

actor {
  stable var uuidCounter : Nat = 0;

  // function to transform the response
  public query func transform({
    // context : Blob;
    response : IC.http_request_result;
  }) : async IC.http_request_result {
    {
      response with headers = []; // not intersted in the headers
    };
  };

  private func askKai(prompt : Text) : async Text {
    // 1. SETUP ARGUMENTS FOR HTTP GET request
    let apiKey = Env.GEMINI_API_KEY;
    let model = "gemini-2.5-flash";
    let url = "https://generativelanguage.googleapis.com/v1beta/models/" # model # ":generateContent?key=" # apiKey;

    // 1.2 prepare headers for the system http_request call

    // idempotency keys should be unique so we create a function that generates them.
    let idempotency_key : Text = await generateUUID();
    let request_headers = [
      { name = "User-Agent"; value = "Kai" },
      { name = "Content-Type"; value = "application/json" },
      { name = "Idempotency-Key"; value = idempotency_key },
    ];

    // The request body is a Blob, so we do the following:
    // Write a JSON string
    let request_body_json : Text = "{
      \"system_instruction\": {
        \"parts\": [
          {
            \"text\": \"Você é Kai, uma raposa laranja, astuta, curiosa e incrivelmente amigável. Sua paixão é desvendar o conhecimento e guiar os outros em jornadas de aprendizado. Você é didático, paciente e sempre busca tornar tópicos complexos em algo simples e fascinante. Sua personalidade é encorajadora e um pouco brincalhona. Você se refere às jornadas de aprendizado como 'trilhas' e às partes delas como 'seções'. Sua missão principal é atuar como um tutor e criador de conteúdo para a plataforma de aprendizado Kaisen.\"
          }
        ]
      },
      \"generationConfig\": {
        \"responseMimeType\": \"application/json\",
        \"responseSchema\": {
          \"type\": \"OBJECT\",
          \"description\": \"Representa uma trilha de aprendizado completa e estruturada sobre um tópico específico.\",
          \"properties\": {
            \"title\": {
              \"type\": \"STRING\",
              \"description\": \"O título principal e criativo da trilha de aprendizado.\"
            },
            \"description\": {
              \"type\": \"STRING\",
              \"description\": \"Uma descrição curta e engajante sobre o que o usuário aprenderá nesta trilha.\"
            },
            \"sections\": {
              \"type\": \"ARRAY\",
              \"description\": \"Uma lista ordenada de seções sequenciais que compõem a trilha.\",
              \"items\": {
                \"type\": \"OBJECT\",
                \"properties\": {
                  \"id\": {
                    \"type\": \"NUMBER\",
                    \"description\": \"Um ID numérico sequencial para a seção, começando em 1.\"
                  },
                  \"title\": {
                    \"type\": \"STRING\",
                    \"description\": \"O título desta seção específica.\"
                  },
                  \"content\": {
                    \"type\": \"OBJECT\",
                    \"description\": \"O conteúdo da seção. A IA deve preencher APENAS UMA das propriedades a seguir: #page, #flashcard, #quiz, ou #essay.\",
                    \"properties\": {
                      \"#page\": {
                        \"type\": \"OBJECT\",
                        \"properties\": {
                          \"title\": { \"type\": \"STRING\" },
                          \"elements\": {
                            \"type\": \"ARRAY\",
                            \"description\": \"Uma lista de elementos que compõem a página.\",
                            \"items\": {
                              \"type\": \"OBJECT\",
                              \"description\": \"Um elemento da página. PREENCHA APENAS UMA das propriedades: #text, #image, ou #video.\",
                              \"properties\": {
                                \"#text\": {
                                  \"type\": \"OBJECT\",
                                  \"properties\": { \"value\": { \"type\": \"STRING\" } },
                                  \"required\": [\"value\"]
                                },
                                \"#image\": {
                                  \"type\": \"OBJECT\",
                                  \"properties\": {
                                    \"url\": { \"type\": \"STRING\" },
                                    \"caption\": { \"type\": \"STRING\" }
                                  },
                                  \"required\": [\"url\"]
                                },
                                \"#video\": {
                                  \"type\": \"OBJECT\",
                                  \"properties\": {
                                    \"url\": { \"type\": \"STRING\" },
                                    \"caption\": { \"type\": \"STRING\" }
                                  },
                                  \"required\": [\"url\", \"caption\"]
                                }
                              }
                            }
                          }
                        },
                        \"required\": [\"title\", \"elements\"]
                      },
                      \"#flashcard\": {
                        \"type\": \"ARRAY\",
                        \"description\": \"Uma lista de flashcards para revisão de conceitos.\",
                        \"items\": {
                          \"type\": \"OBJECT\",
                          \"properties\": {
                            \"sentence\": { \"type\": \"STRING\", \"description\": \"A frente do flashcard (pergunta ou termo).\" },
                            \"answer\": { \"type\": \"STRING\", \"description\": \"O verso do flashcard (resposta ou definição).\" }
                          },
                          \"required\": [\"sentence\", \"answer\"]
                        }
                      },
                      \"#quiz\": {
                        \"type\": \"ARRAY\",
                        \"description\": \"Uma lista de quizzes para testar o conhecimento.\",
                        \"items\": {
                          \"type\": \"OBJECT\",
                          \"properties\": {
                            \"question\": { \"type\": \"STRING\" },
                            \"alternatives\": {
                              \"type\": \"ARRAY\",
                              \"items\": {
                                \"type\": \"OBJECT\",
                                \"properties\": {
                                  \"id\": { \"type\": \"NUMBER\" },
                                  \"text\": { \"type\": \"STRING\" }
                                },
                                \"required\": [\"id\", \"text\"]
                              }
                            },
                            \"correctAnswerId\": { \"type\": \"NUMBER\" }
                          },
                          \"required\": [\"question\", \"alternatives\", \"correctAnswerId\"]
                        }
                      },
                      \"#essay\": {
                        \"type\": \"ARRAY\",
                        \"description\": \"Uma lista de questões dissertativas para avaliação aprofundada.\",
                        \"items\": {
                          \"type\": \"OBJECT\",
                          \"properties\": {
                            \"question\": { \"type\": \"STRING\" },
                            \"expectedAnswer\": { \"type\": \"STRING\" }
                          },
                          \"required\": [\"question\", \"expectedAnswer\"]
                        }
                      }
                    }
                  }
                },
                \"required\": [\"id\", \"title\", \"content\"]
              }
            }
          },
          \"required\": [\"title\", \"description\", \"sections\"]
        }
      },
      \"contents\": [{
        \"parts\": [{
          \"text\": \"" # prompt # "\"
        }]
      }]
    }";

    // Convert Text into a Blob
    let request_body = Text.encodeUtf8(request_body_json);

    // 1.3 The HTTP request
    let http_request : IC.http_request_args = {
      url = url;
      max_response_bytes = null; // optional for request
      headers = request_headers;
      // note: type of `body` is ?Blob so we pass it here as "?request_body" instead of "request_body"
      body = ?request_body;
      method = #post;
      transform = ?{
        function = transform;
        context = Blob.fromArray([]);
      };
    };

    // 2. MAKE HTTPS REQUEST AND WAIT FOR RESPONSE, BUT MAKE SURE TO ADD CYCLES.
    let http_response : IC.http_request_result = await (with cycles = 230_949_972_000) IC.http_request(http_request);

    // 3. DECODE THE RESPONSE

    // As per the type declarations, the BODY in the HTTP response comes back as Blob. Type signature:

    // public type http_request_result = {
    //   status : Nat;
    //   headers : [HttpHeader];
    //   body : Blob;
    // };

    // We need to decode that Blob that is the body into readable text.
    // To do this, we:
    //  1. Use Text.decodeUtf8() method to convert the Blob to a ?Text optional
    //  2. We use a switch to explicitly call out both cases of decoding the Blob into ?Text
    let decoded_text : Text = switch (Text.decodeUtf8(http_response.body)) {
      case (null) { "No value returned" };
      case (?y) { y };
    };

    // 4. CHECK STATUS AND RETURN RESPONSE OF THE BODY
    if (http_response.status >= 200 and http_response.status < 300) {
      return decoded_text;
    } else {
      return "{\"error\": \"A API respondeu com status " # Nat.toText(http_response.status) # "\", \"details\": " # decoded_text # "}";
    };
  };

  public shared (_msg) func generateTrack(topic : Text) : async Text {
    try {
      let response : Text = await askKai(topic);

      return response;
    } catch (err) {
      let error_message = "Ocorreu um erro fatal ao gerar a trilha: " # Error.message(err);
      
      Debug.print(error_message);

      return "{\"error\": \"" # error_message # "\"}";
    };
  };

  public shared (msg) func generateUUID() : async Text {
    let timeText = Int.toText(Time.now());
    let callerText = Principal.toText(msg.caller);
    let counterText = Nat.toText(uuidCounter);

    uuidCounter += 1;

    return timeText # "-" # callerText # "-" # counterText;
  };
};
