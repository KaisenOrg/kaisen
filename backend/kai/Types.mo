module {
  public type InlineData = {
    mimeType : Text;
    data : Text;
  };

  public type Part = {
    #text : Text;
    #inlineData : InlineData;
  };

  public type Content = {
    parts : [Part];
    role : ?Text;
  };

  public type Candidate = {
    content : Content;
  };

  public type GeminiResponse = {
    candidates : [Candidate];
  };
};
