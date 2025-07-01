actor {
  public func greeting(name : Text) : async Text {
    return "Hello, " # name # "!";
  };
}