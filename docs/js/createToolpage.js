$(document).ready(function () {
    createHTML();
    stickySidebar("#left-content");
    insertData();
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
    var url = window.location.href;
    var toollist = getJSON("../static/data/json/tools_count.json");
    var tool = decodeURI(url.split("/").pop().split(".")[0])
    if (tool in toollist) {
        getFile(toollist[tool]["script"]);
    }
    else {
        window.location.href = "https://www.informatrix.space/404.html"
    }
}


// function insertToollist(Toollist, start, step) {
//     // 生成首页文章列表
//     var listbox = $("#alticlelist");
//     if (listbox.length) {
//         var uuids = Object.keys(Toollist);
//         var htmlblock = "";
//         for (var name of uuids.slice(start, step)) {
//             htmlblock += "<div class=\"data-block\">" +
//                 "<div class=\"alticle-info\">" +
//                 "<a href=\"tool.html?tool=" + name + "\"><div class=\"alticle-img\" style=\"background-image:url(" + Toollist[name]["image"] + ");\"></div></a>" +
//                 "<div class=\"alticle-baseinfo\">" +
//                 "<a href=\"tool.html?tool=" + name + "\"><h1>" + name + "</h1></a>" +
//                 "<div class=\"alticle-meta\"><span>" + Toollist[name]["description"] + "</span><br><span style=\"color:#808080\">更新于</span><span style=\"color:#808080\">" + Toollist[name]["updatetime"] + "</span>&emsp;|&emsp;<span style=\"color:#808080\">" + Toollist[name]["version"] + "</span></div></div></div></div>";
//         }
//         listbox[0].innerHTML = htmlblock;
//     }
// }