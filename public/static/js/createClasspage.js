$(document).ready(function () {
    createClasspage();
    stickySidebar("#left-content");
    insertData();
    searchClass();
})

function createClasspage() {
    include("#header", "header");
    include("#left-area", ["author", "announce"]);
    $("#left-area").append("<div id=\"left-content\"><div>");
    include("#left-content", ["tags", "recently", "tools"]);
}

function searchClass() {
    var url = new URL(window.location.href);
    if (url.searchParams != null) {
        var classi = url.searchParams.get("class");
        if (classi != null) {
            var alticlelist = getJSON("static/data/json/alticle_count.json");
            var alticlelist_classi = {}
            for (var uid in alticlelist) {
                if (Object.keys(alticlelist[uid]["classification"])[0] == classi || Object.values(alticlelist[uid]["classification"])[0] == classi) {
                    alticlelist_classi[uid] = alticlelist[uid];
                }
            }
            getFile("static/js/createIndex.js");
            $("#right-area").append("<div id=\"alticlelist\"></div>");
            insertAlticlelist(alticlelist_classi, 0, alticlelist_classi.length);
            $("title").text(classi + "&ensp;|&ensp;陆柒的个人博客");
        }
        else {

        }
    }
}