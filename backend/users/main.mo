import TrieMap "mo:base/TrieMap";
import Text "mo:base/Text";
import Result "mo:base/Result";
import Iter "mo:base/Iter";
import Types "./Types";

actor {
  private var users : TrieMap.TrieMap<Text, Types.User> = TrieMap.TrieMap(Text.equal, Text.hash);
  stable var stableUsers : [(Text, Types.User)] = [];

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
    };
  };

  public func updateUser(user : Types.User) : async Result.Result<(), Text> {
    switch (users.get(user.identity)) {
      case null { return #err("Usuário não encontrado.") };
      case _ {
        users.put(user.identity, user);
        return #ok;
      };
    };
  };

  public func deleteUser(identity : Text) : async Result.Result<(), Text> {
    switch (users.remove(identity)) {
      case null { return #err("Usuário não encontrado.") };
      case _ { return #ok };
    };
  };

};
