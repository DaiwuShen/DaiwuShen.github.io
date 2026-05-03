$(document).ready(function () {
    createTagspage();
    stickySidebar("#left-content");
    insertData();
    createTaglist();
})

function createTagspage() {
    include("#header", "header");
    include("#left-area", ["author", "announce"]);
    $("#left-area").append("<div id=\"left-content\"></div>");
    include("#left-content", ["sort", "recently", "tools"]);
}

function createTaglist() {
    var url = new URL(window.location.href);
    if (url.searchParams != 0) {
        var tag = url.searchParams.get("tag");
        if (tag != null) {
            if (Object.keys(window.datacount["tags"]).indexOf(tag) != -1) {
                for (var tag_box of $("#tags").children()) {
                    if (tag_box.innerText == tag) {
                        tag_box.style.backgroundColor = "yellow";
                    }
                }
                getFile("static/js/createIndex.js");
                var alticlelist = getJSON("static/data/json/alticle_count.json");
                var alticle_for_tag = getListfortag(alticlelist, tag);
                $("#right-area").append("<div id=\"alticlelist\"></div>");
                insertAlticlelist(alticle_for_tag, 0, alticle_for_tag.length);
                $("title").text(tag + "&ensp;|&ensp;陆柒的个人博客")
            }
            else {
                alert("没有" + tag + "这个标签。");
                window.history.back(-1);
            }
        }
        else {
            alert("为输入查询的标签。");
            window.history.back(-1);
        }
    }
}

function getListfortag(alticlelist, tag) {
    if (tag == "" || tag == null || alticlelist.length == 0) {
        return null;
    }
    var alticlelist_for_tag = {};
    for (var uid in alticlelist) {
        if (alticlelist[uid]["tag"].indexOf(tag) != -1) {
            alticlelist_for_tag[uid] = alticlelist[uid];
        }
    }
    return alticlelist_for_tag;
}