include("#header", "header");
include("#left-area", ["author", "announce"]);
$("#left-area").append("<div id=\"left-content\"><div>");
include("#left-content", ["contentlist", "recently", "visit"]);
insertData();