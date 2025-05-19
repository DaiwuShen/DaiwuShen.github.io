$(document).ready(function () {
    var url = new URL(window.location.href);
    if (url.pathname == "/index.html" || url.pathname == "/") {
        var alticlelist = getJSON("static/data/json/alticle_count.json");
        createIndexpage();
        insertAlticlelist(alticlelist, 0, 10);
        insertData();
    }
})

function createIndexpage() {
    var parts = ["author", "announce", "sort", "tags", "achive", "tools", "information"];
    include("#header", "header");
    include("#left-area", parts);
}

// 生成文章列表
function insertAlticlelist(alticlelist, start, step) {
    // 生成首页文章列表
    var listbox = $("#alticlelist");
    if (listbox.length) {
        var uuids = Object.keys(alticlelist);
        var htmlblock = "";
        for (var title of uuids.slice(start, step)) {
            var main_classi = Object.keys(alticlelist[title]["classification"])[0];
            var sub_classi = alticlelist[title]["classification"][main_classi];
            htmlblock += "<div class=\"data-block\"><a href=\"alticle-list/" + title + ".html\">" +
                "<div class=\"alticle-info\">" +
                "<div class=\"alticle-img\" style=\"background-image:url(" + alticlelist[title]["image"] + ");\"></div>" +
                "<div class=\"alticle-baseinfo\">" +
                "<h1>" + title + "</h1>" + "<div class=\"description\">" + alticlelist[title]["description"] + "</div>" +
                "<div class=\"alticle-meta\"><span>" + main_classi + "</span><span>-&gt;</span><span>" + sub_classi + "</span></div>" +
                "<div class=\"alticle-meta\"><span>发布于</span><span>" + alticlelist[title]["date"] + "</span></div></div></div></a></div>";
        }
        listbox[0].innerHTML = htmlblock;
    }
}