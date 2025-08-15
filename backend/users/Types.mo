import Time "mo:base/Time";

module {
  public type FollowerData = {
    userIdentity : Text;
    timestamp : Time.Time;
  };

  public type InProgressTracksData = {
    id : Text;
    progress : Nat8;
  };

  public type User = {
    picture : ?Text;
    nickname : Text;
    username : Text; // deve ser unico
    about : ?Text;
    role : ?Text;

    followers : [FollowerData];
    following : [Text];

    certificates : [Text];
    createdTracks : [Text];
    inProgressTracks : [InProgressTracksData];
    completedTracks : [Text];

    identity : Text; // id usado para todo o resto/dados sociais (autenticação, comunidade, etc)
    principal : Principal; // id usado somente para dados financeiro
  };
};
