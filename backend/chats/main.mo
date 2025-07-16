import Trie "mo:base/Trie";
import Principal "mo:base/Principal";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Error "mo:base/Error";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Int "mo:base/Int";
import Debug "mo:base/Debug";

import Types "Types";

actor {
  stable var chats : Trie.Trie<Text, Types.ChatSession> = Trie.empty();
  stable var nextChatId : Nat = 0;
  stable var kaiCanister : ?Principal = null;

  // --- FUNÇÕES DE ADMINISTRAÇÃO (SEGURANÇA) ---
  public shared (msg) func setKaiCanister(id : Principal) : async () {
    let caller = msg.caller;
    if (not Principal.isController(caller)) {
      throw Error.reject("Acesso negado: o chamador não é um controller.");
    };
    kaiCanister := ?id;
  };

  // --- FUNÇÕES PÚBLICAS (API DO CANISTER) ---
  public shared (msg) func createChatSession(firstMessageText : Text) : async Text {
    let caller = msg.caller;
    let now = Time.now();
    let chatId = generateUniqueId();

    let initialMessage : Types.Message = {
      sender = #User;
      text = firstMessageText;
      timestamp = now;
    };

    let newSession : Types.ChatSession = {
      id = chatId;
      owner = caller;
      title = firstMessageText;
      createdAt = now;
      messages = [initialMessage];
    };

    chats := Trie.put(chats, key(chatId), Text.equal, newSession).0;
    return chatId;
  };

  public shared (msg) func addInteraction(chatId : Text, userMessage : Text, aiMessage : Text) : async () {
    let caller = msg.caller;
    let session = switch (Trie.get(chats, key(chatId), Text.equal)) {
      case (null) {
        throw Error.reject("Chat com ID '" # chatId # "' não encontrado.");
      };
      case (?s) { s };
    };

    if (session.owner != caller) {
      throw Error.reject("Acesso negado.");
    };

    let now = Time.now();
    let userMsg : Types.Message = {
      sender = #User;
      text = userMessage;
      timestamp = now;
    };
    let aiMsg : Types.Message = {
      sender = #Model;
      text = aiMessage;
      timestamp = now;
    };

    let updatedSession = {
      session with messages = Array.append(session.messages, [userMsg, aiMsg])
    };
    chats := Trie.put(chats, key(chatId), Text.equal, updatedSession).0;
  };

  public shared query (msg) func getChatHistory(chatId : Text) : async ?[Types.Message] {
    let caller = msg.caller;
    switch (Trie.get(chats, key(chatId), Text.equal)) {
      case (null) { return null };
      case (?session) {
        Debug.print("session.owner = " # Principal.toText(session.owner));
        Debug.print("current caller = " # Principal.toText(caller));
        if (session.owner != caller) { return null };
        return ?session.messages;
      };
    };
  };

  // --- FUNÇÕES AUXILIARES ---
  private func generateUniqueId() : Text {
    nextChatId += 1;
    return Int.toText(Time.now()) # "-" # Nat.toText(nextChatId);
  };

  private func key(t : Text) : Trie.Key<Text> {
    { hash = Text.hash(t); key = t };
  };
};
