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
};
