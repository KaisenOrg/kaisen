import Time "mo:base/Time";

module {
  public type Page = {
    title : Text;
    content: Text;
  };

  public type Flashcard = {
    sentence : Text;
    answer : Text;
  };

  public type Alternative = {
    id : Nat;
    text : Text;
  };

  public type Quiz = {
    question : Text;
    alternatives : [Alternative];
    correctAnswerId : Nat;
  };

  public type EssayQuestion = {
    question : Text;
    expectedAnswer : Text;
  };

  public type Content = {
    #Page : Page;
    #Flashcard : [Flashcard];
    #Quiz : [Quiz];
    #Essay : [EssayQuestion];
  };

  public type Section = {
    id : Nat;
    title : Text;
    content : Content;
  };

  public type Track = {
    id : Text;
    title : Text;
    description : Text;
    authorId : Text;
    createdAt : Time.Time;
    sections : [Section];
  };
};
