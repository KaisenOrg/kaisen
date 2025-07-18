import Trie "mo:base/Trie";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Error "mo:base/Error";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Int "mo:base/Int";

import Types "Types";

actor {
  stable var tracks : Trie.Trie<Text, Types.Track> = Trie.empty();
  stable var nextIdCounter : Nat = 0;

  // --- FUNÇÕES PRIVADAS (HELPERS) ---

  type Key<K> = Trie.Key<K>;

  private func key(t : Text) : Key<Text> { { hash = Text.hash(t); key = t } };

  private func generateUniqueId() : Text {
    let timeText = Int.toText(Time.now());
    let counterText = Nat.toText(nextIdCounter);
    nextIdCounter += 1;
    return timeText # "-" # counterText;
  };

  // --- FUNÇÕES PÚBLICAS ---

  public shared (msg) func createTrack(title : Text, description : Text, sections : [Types.Section]) : async Text {
    let caller = msg.caller;
    let newId = generateUniqueId();
    let now = Time.now();

    let newTrack : Types.Track = {
      id = newId;
      title = title;
      description = description;
      authorId = Principal.toText(caller);
      createdAt = now;
      sections = sections;
    };

    // Usando .0 para pegar apenas a nova trie.
    tracks := Trie.put(tracks, key(newId), Text.equal, newTrack).0;

    return newId;
  };

  public query func getTrack(trackId : Text) : async ?Types.Track {
    return Trie.get(tracks, key(trackId), Text.equal);
  };

  public query func listAllTracks() : async [Types.Track] {
    var allTracks : [Types.Track] = [];

    for ((_key, track) in Trie.iter(tracks)) {
      allTracks := Array.append(allTracks, [track]);
    };
    return allTracks;
  };

  public shared (msg) func deleteTrack(trackId : Text) : async Bool {
    let callerPrincipal = msg.caller;

    switch (Trie.get(tracks, key(trackId), Text.equal)) {
      case (null) {
        throw Error.reject("Trilha com ID '" # trackId # "' não encontrada.");
      };
      case (?track) {
        if (track.authorId != Principal.toText(callerPrincipal)) {
          throw Error.reject("Acesso negado: você não é o autor desta trilha.");
        };

        tracks := Trie.remove(tracks, key(trackId), Text.equal).0;
        return true;
      };
    };
  };

  public shared (msg) func updateTrackDetails(trackId : Text, newTitle : Text, newDescription : Text) : async () {
    let callerPrincipal = msg.caller;

    switch (Trie.get(tracks, key(trackId), Text.equal)) {
      case (null) {
        throw Error.reject("Trilha com ID '" # trackId # "' não encontrada.");
      };
      case (?oldTrack) {
        if (oldTrack.authorId != Principal.toText(callerPrincipal)) {
          throw Error.reject("Acesso negado: você não é o autor desta trilha.");
        };

        let updatedTrack : Types.Track = {
          oldTrack with
          title = newTitle;
          description = newDescription;
        };

        tracks := Trie.put(tracks, key(trackId), Text.equal, updatedTrack).0;
      };
    };
  };

  // DEV FUNCTION (deletar antes de enviar p/ produção)

  /**
     * @notice Limpa todas as trilhas existentes e injeta um conjunto de trilhas de exemplo para teste.
     * Apenas controllers do canister podem chamar esta função.
     */
  public shared (controller) func injectSampleTracks() : async () {
    tracks := Trie.empty();

    let trackId1 = "1001";
    let track1 : Types.Track = {
      id = trackId1;
      title = "Motoko para Iniciantes";
      description = "Uma trilha de aprendizado introdutória sobre a linguagem Motoko na Internet Computer.";
      authorId = Principal.toText(controller.caller);
      createdAt = Time.now();
      sections = [
        {
          id = 1;
          title = "O que é Motoko?";
          content = #Page({
            title = "Introdução ao Motoko";
            elements = [
              #Text({
                value = "Motoko é uma linguagem de programação moderna e com segurança de tipos, projetada para compilar diretamente para WebAssembly.";
              }),
              #Text({
                value = "Ela é otimizada para o modelo de programação de atores da Internet Computer.";
              }),
            ];
          });
        },
        {
          id = 2;
          title = "Teste Rápido";
          content = #Quiz([{
            question = "Qual palavra-chave declara uma variável que persiste durante upgrades?";
            alternatives = [
              { id = 1; text = "var" },
              { id = 2; text = "let" },
              { id = 3; text = "stable" },
            ];
            correctAnswerId = 3;
          }]);
        },
      ];
    };

    let trackId2 = "1002";
    let track2 : Types.Track = {
      id = trackId2;
      title = "A Arte do Brigadeiro";
      description = "Aprenda a fazer o doce mais amado do Brasil.";
      authorId = Principal.toText(controller.caller);

      createdAt = Time.now();
      sections = [{
        id = 1;
        title = "Conceitos Chave";
        content = #Flashcard([
          {
            sentence = "Ingrediente principal que dá a base de chocolate.";
            answer = "Leite condensado e chocolate em pó";
          },
          {
            sentence = "O ponto correto para desligar o fogo.";
            answer = "Quando a mistura desgruda do fundo da panela.";
          },
        ]);
      }];
    };

    tracks := Trie.put(tracks, key(trackId1), Text.equal, track1).0;
    tracks := Trie.put(tracks, key(trackId2), Text.equal, track2).0;
  };
};
