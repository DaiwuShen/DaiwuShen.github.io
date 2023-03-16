$(document).ready(function () {
    createHTML();
    createToolpage();
});

// 构建页面
function createHTML() {
    include("#header", "header");
    include("#left-area", "author");
    include("#left-area", "announce");
    $("#left-area").append("<div id=\"left-content\"></div>");
    include("#left-content", "tools");
    include("#left-content", "recently");
    include("#left-content", "visit");
    $("#visit").children("div").children("div").children("span")[0].innerText = "本工具已使用";
}

function createToolpage() {
    var url = new URL(window.location.href)
    if (url.searchParams != 0) {
        if (url.searchParams.get("tool") != null) {
            var tool = url.searchParams.get("tool");
            var toollist = getJSON("static/data/json/tools_count.json");
            if (tool in toollist) {
                var pageHtml = $.ajax({
                    url: "static/tool/" + toollist[tool]["name"] + ".html",
                    type: "get",
                    async: false,
                }).responseText;
                document.getElementById("alticle-box").innerHTML = pageHtml;
                $.ajax({
                    url: toollist[tool]["script"],
                    type: "get",
                    async: false
                })
            }
        }
    }
}