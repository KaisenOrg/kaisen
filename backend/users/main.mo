
import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Types "./Types";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";

persistent actor {
  private transient var users : TrieMap.TrieMap<Text, Types.User> = TrieMap.TrieMap(Text.equal, Text.hash);
  transient var stableUsers : [(Text, Types.User)] = [];

  // Função auxiliar para checar se o usuário pode acessar a seção desejada
  private func canAccessSection(user : Types.User, trackId : Text, sectionId : Nat) : Bool {
    var progress : ?Types.InProgressTracksData = null;
    label search for (trk in user.inProgressTracks.vals()) {
      if (trk.id == trackId) {
        progress := ?trk;
        break search;
      }
    };
    switch (progress) {
      case null {
        // Se não há progresso, só pode acessar a primeira seção
        return sectionId == 1;
      };
      case (?p) {
        // Só pode acessar a próxima seção se a anterior foi concluída
  return sectionId <= Nat8.toNat(p.progress) + 1;
      }
    }
  };

  // ...existing code...
  // Função pública para tentar acessar/iniciar uma seção
  public func tryAccessSection(identity : Text, trackId : Text, sectionId : Nat) : async Result.Result<(), Text> {
    switch (users.get(identity)) {
      case null { return #err("Usuário não encontrado."); };
      case (?user) {
        if (canAccessSection(user, trackId, sectionId)) {
          return #ok;
        } else {
          return #err("Você precisa concluir a seção anterior antes de acessar esta.");
        }
      }
    }
  };

  system func preupgrade() {
    stableUsers := Iter.toArray(users.entries());
  };

  system func postupgrade() {
    users := TrieMap.fromEntries<Text, Types.User>(stableUsers.vals(), Text.equal, Text.hash);
  };

  public func createUser(user : Types.User) : async Result.Result<(), Text> {
    if (users.get(user.identity) != null) {
      return #err("Usuário já existe com esse identity.");
    };
    users.put(user.identity, user);
    return #ok;
  };

  public query func getUser(identity : Text) : async Result.Result<Types.User, Text> {
    switch (users.get(identity)) {
      case (?user) { return #ok(user) };
      case null { return #err("Usuário nao encontrado.") };
    }
  };

  public func updateUser(user : Types.User) : async Result.Result<(), Text> {
    switch (users.get(user.identity)) {
      case null { return #err("Usuário não encontrado.") };
      case _ {
        users.put(user.identity, user);
        return #ok;
      }
    }
  };

  public func deleteUser(identity : Text) : async Result.Result<(), Text> {
    switch (users.remove(identity)) {
      case null { return #err("Usuário não encontrado.") };
      case _ { return #ok };
    }
  };
};
