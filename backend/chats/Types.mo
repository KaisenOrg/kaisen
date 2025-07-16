import Principal "mo:base/Principal";
import Time "mo:base/Time";

module {
  public type Sender = { #User; #Model };
  
  public type Message = { sender : Sender; text : Text; timestamp : Time.Time };
  
  public type ChatSession = {
    id : Text;
    owner : Principal;
    title : Text;
    createdAt : Time.Time;
    messages : [Message];
  };
};
