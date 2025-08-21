import Template "templateSvg";
import Text "mo:base/Text";

module {
  public func generateSVG(
    userName : Text,
    trackName : Text,
    timeSpent : Text,
    id : Text,
  ) : Text {

    var svg = Text.replace(Template.template, #text("%USERNAME%"), userName);
    svg := Text.replace(svg, #text("%TRACK%"), trackName);
    svg := Text.replace(svg, #text("%TIME%"), timeSpent # " hours");
    Text.replace(svg, #text("%TOKENID%"), id);
  };

};
