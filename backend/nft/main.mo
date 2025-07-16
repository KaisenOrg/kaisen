import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Time "mo:base/Time";
import svg "svg/generateSvg";
import Trie "mo:base/Trie";
import Blob "mo:base/Blob";
import Result "mo:base/Result";
import Sha256 "mo:sha2/Sha256";
import Nat8 "mo:base/Nat8";
import Principal "mo:base/Principal";

actor class CertificateNFT() {
  public type NFT = {
    id : Text;
    authorId: Text;
    userName : Text;
    trackName : Text;
    timeSpent : Nat;          
    emmittedAt : Time.Time;
    img : Text;            
  };

  //Trie para guardar os NFTs
  private var nfts = Trie.empty<Text, NFT>();

  type Key<K> = Trie.Key<K>;

  private func key(t : Text) : Key<Text> { { hash = Text.hash(t); key = t } };
  
  private func blobToHex(blob: Blob) : Text {
    let hex = ["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
    var text = "";
    for (byte in blob.vals()) {
      let high_nibble_nat8 = byte >> 4;
      let low_nibble_nat8 = byte & 15;
      let high_index = Nat8.toNat(high_nibble_nat8);
      let low_index = Nat8.toNat(low_nibble_nat8);

      text := text # hex[high_index] # hex[low_index];
    };
    return text;
  };

  //Trie para guardar os usuários e seus respectivos NFTs
  var userIndex : Trie.Trie<Text, [Text]> = Trie.empty();

  func updateUserIndex(userId: Text, nftId: Text) {
    switch (Trie.get(userIndex, key(userId), Text.equal)) {
        case (?ids) {
            userIndex := Trie.put(userIndex, key(userId), Text.equal, Array.append(ids, [nftId])).0;
        };
        case null {
            userIndex := Trie.put(userIndex, key(userId), Text.equal, [nftId]).0;
        };
    };
  };

  public shared ({ caller }) func mintNFT(
    userName : Text,
    trackName : Text, 
    timeSpent : Nat
    ) : async  Result.Result<Text, Text> {

    //Criação de um hash para ser o identificador do NFT
    let timeSpentText = Nat.toText(timeSpent);
    let serializedMetadata : Text = 
    "userName=" # userName #
    "|trackName=" # trackName #
    "|timeSpent=" # timeSpentText;
    let contentBlob = Text.encodeUtf8(serializedMetadata);
    let hashBlob = Sha256.fromBlob(#sha256, contentBlob);
    let nftId = blobToHex(hashBlob);

    switch (Trie.get(nfts, key(nftId), Text.equal)) {
      case (?_existing) {
        return #err("NFT already exists");
      };
      case null {  
        let img = svg.generateSVG(userName, trackName, timeSpent, nftId);

        let nft : NFT = {
          id = nftId;
          authorId = Principal.toText(caller);
          userName = userName;
          trackName = trackName;
          timeSpent = timeSpent;
          emmittedAt = Time.now();
          img = img;
        };

        nfts := Trie.put(nfts, key(nftId), Text.equal, nft).0;

        updateUserIndex(Principal.toText(caller), nftId);

        return #ok(nftId);
      };
    };
  };

  public query func getAllNFTs() : async [NFT] {
    var allNfts : [NFT] = [];
    for ((_key, nft) in Trie.iter(nfts)) {
      allNfts := Array.append(allNfts, [nft]);
    };
    return allNfts;
  };

  public query func getNFTsByUser(userId: Text) : async [NFT] {
    switch (Trie.get(userIndex, key(userId), Text.equal)) {
        case (?nftIds) {
            return Array.mapFilter(nftIds, func (id: Text) : ?NFT {
                Trie.get(nfts, key(id), Text.equal)
            });
        };
        case null { return [] };
    };
  } ;
  
  public shared query func getNFTById(id: Text) : async ?NFT {
    return Trie.get(nfts, key(id), Text.equal);
  };

};
