import Template "templateSvg";
import Text "mo:base/Text";
import Nat "mo:base/Nat";

module {
    public func generateSVG(
        userName : Text,
        trackName : Text,
        timeSpent : Nat,
        id : Text
    ) : Text {
        let timeText = Nat.toText(timeSpent);

        var svg = Text.replace(Template.template, #text("%USERNAME%"), userName);
        svg := Text.replace(svg, #text("%TRACK%"), trackName);
        svg := Text.replace(svg, #text("%TIME%"), timeText # " hours");
        Text.replace(svg, #text("%TOKENID%"), id)
    };

}