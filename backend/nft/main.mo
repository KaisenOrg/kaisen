import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Nat64 "mo:base/Nat64";
import IC "ic:aaaaa-aa";

actor {

  type CertificateData = {
    username: Text;
    track: Text;
    time: Nat;
    tokenId: Text;
  };

  stable var certificates: [CertificateData] = [];

  public query func transform({
    // context : Blob;
    response : IC.http_request_result;
  }) : async IC.http_request_result {
    {
      response with headers = []; // not intersted in the headers
    };
  };

  /// Gera um ID único baseado no tempo (usado como tokenId e Idempotency-Key)
  func generateUUID() : Text {
  Nat64.toText(Nat64.fromIntWrap(Time.now()))  
  };

  /// Função principal: emite o certificado e envia requisição HTTP para Node.js
  public func emmitCertificate(username: Text, track: Text, time: Nat) : async Text {
    let tokenId = generateUUID();

    let cert: CertificateData = {
      username;
      track;
      time;
      tokenId;
    };

    let payloadJson = 
      "{ \"username\": \"" # username # "\", " #
      "\"track\": \"" # track # "\", " #
      "\"time\": \"" # Nat.toText(time) # "\", " #
      "\"tokenId\": \"" # tokenId # "\" }";

    let request_body: Blob = Text.encodeUtf8(payloadJson);

    // Cabeçalhos HTTP
    let headers = [
      { name = "Content-Type"; value = "application/json" },
      { name = "Idempotency-Key"; value = tokenId },
    ];

    // Configuração da requisição
    let request : IC.http_request_args = {
      url = "${COLOCAR-O-LINK-PARA-FAZER-A-REQUISICAO-AQUI}/mint"; // <-- Substitua aqui!
      method = #post;
      headers = headers;
      body = ?request_body;
      max_response_bytes = null;
      transform = ?{
        function = transform;
        context = Blob.fromArray([]);
      };
    };

    // Envio da requisição com ciclos
    let response: IC.http_request_result =
      await (with cycles = 300_000_000_000) IC.http_request(request);

    // Decodificação do corpo da resposta (de Blob para Text)
    let cid: Text = switch (Text.decodeUtf8(response.body)) {
      case (?val) val;
      case null "Erro ao decodificar resposta";
    };

    // Armazenar as informações do certificado na Blockchain
    certificates := Array.append(certificates, [cert]);

    return cid;
  };

  public query func getAllCertificates(): async [CertificateData] {
    return certificates;
  };
};
