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
      title = "A Fascinante História da Fotografia";
      description = "Viaje no tempo e descubra como a humanidade aprendeu a capturar a luz! Desde as primeiras imagens borradas até as câmaras digitais de hoje, esta trilha explora os inventores, as tecnologias e os momentos que definiram a arte da fotografia.";
      authorId = Principal.toText(controller.caller);
      createdAt = Time.now();
      sections = [
        {
          id = 1;
          title = "O Nascimento da Imagem";
          content = #Page({
            title = "Capturando a Primeira Luz";
            elements = [
              #Text({
                value = "Bem-vindo(a), explorador(a) visual! A nossa jornada começa no início do século XIX, muito antes das selfies. A fotografia nasceu de uma combinação de química e ótica. A primeira imagem permanente foi criada por Joseph Nicéphore Niépce em 1826, uma vista da janela de sua casa que exigiu uma exposição de várias horas!";
              }),
              #Image({
                url = "https://placehold.co/600x400?text=Vista+da+Janela+em+Le+Gras+(1826)";
                caption = ?"A primeira fotografia da história, tirada por Niépce.";
              }),
              #Text({
                value = "Esta invenção, chamada de 'Heliografia', usava uma placa de estanho coberta com betume. Onde a luz batia, o betume endurecia; o resto era lavado, revelando uma imagem rudimentar.";
              }),
            ];
          });
        },
        {
          id = 2;
          title = "Conceitos Fundamentais (Flashcards)";
          content = #Flashcard([
            {
              sentence = "O processo criado por Louis Daguerre que popularizou a fotografia.";
              answer = "Daguerreótipo (Daguerréotype)";
            },
            {
              sentence = "A parte da câmara que controla a quantidade de luz que entra.";
              answer = "Abertura (Aperture)";
            },
            {
              sentence = "O componente sensível à luz que captura a imagem (em câmaras analógicas).";
              answer = "Filme fotográfico";
            },
          ]);
        },
        {
          id = 3;
          title = "Teste seu Conhecimento!";
          content = #Quiz([{
            question = "Quem é considerado o inventor da primeira fotografia permanente?";
            alternatives = [
              { id = 1; text = "Louis Daguerre" },
              { id = 2; text = "George Eastman" },
              { id = 3; text = "Joseph Nicéphore Niépce" },
              { id = 4; text = "Thomas Edison" },
            ];
            correctAnswerId = 3;
          }]);
        },
        {
          id = 4;
          title = "A Revolução Digital";
          content = #Page({
            title = "Adeus, Filme! Olá, Pixels!";
            elements = [
              #Video({
                url = "https://videos.pexels.com/video-files/3214561/3214561-hd_1280_720_25fps.mp4";
                caption = "A fotografia digital mudou para sempre a forma como registamos os nossos momentos.";
              }),
              #Text({
                value = "A grande virada ocorreu no final do século XX com a invenção do sensor digital (CCD e, mais tarde, CMOS). Em vez de capturar a luz em um filme químico, as câmaras digitais a convertem em dados eletrónicos – pixels.";
              }),
            ];
          });
        },
        {
          id = 5;
          title = "Reflexão Final";
          content = #Essay([{
            question = "Em sua opinião, qual foi o maior impacto da fotografia digital na sociedade?";
            expectedAnswer = "O aluno deve discutir temas como a democratização da imagem, a ascensão das redes sociais, e questões sobre a veracidade das imagens na era da manipulação digital.";
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

    let trackId3 = "1003";
    let track3 : Types.Track = {
      id = trackId3;
      title = "A Arte da Fofoca";
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

    tracks := Trie.put(tracks, key(trackId3), Text.equal, track3).0;
    tracks := Trie.put(tracks, key(trackId2), Text.equal, track2).0;
    tracks := Trie.put(tracks, key(trackId1), Text.equal, track1).0;
  };
};
