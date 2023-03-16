var parts = ["author", "announce", "recently", "sort", "tags", "achive", "tools", "information"]
include("#header", "header");
$("#right-area").append("<div id=\"alticlelist\"></div>")
for (var part of parts) {
    include("#left-area", part);
}