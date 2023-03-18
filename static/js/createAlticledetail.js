$(document).ready(function () {
    createAlticlepage();
    insertData();
    insertAlticle();
})

function createAlticlepage() {
    include("#header", "header");
    include("#left-area", ["author", "announce"]);
    $("#left-area").append("<div id=\"left-content\"><div>");
    include("#left-content", ["contentlist", "recently", "visit"]);
}

function insertAlticle() {
    var url = new URL(window.location.href)
    if (url.searchParams != 0) {
        // 如果alticle-detail页面存在参数
        if (url.searchParams.get("uuid") != null) {
            // 如果参数中存在uuid
            var uuid = url.searchParams.get("uuid");
            // 读取文章统计文件
            var alticlelist = getJSON("static/data/json/alticle_count.json");
        }
        else {
            // 不存在uuid参数则返回
            alert("参数错误，即将返回。");
            window.history.back(-1);
        }
        if (uuid in alticlelist) {
            // 在文章统计json中通过uuid查找文章，若存在，则读取对应文件
            var alticle = $.ajax({
                url: alticlelist[uuid]["path"],
                type: "get",
                async: false,
                error: function () {
                    alert("资源查询错误，即将返回。");
                    window.history.back(-1);
                }
            }).responseText;
            /* 如果是md文件 */
            if (alticlelist[uuid]["path"].split(".")[1] == "md") {
                alticle = parseMarkdown(alticle);
            }
            $("#alticle-box").append(alticle);	/* 写入文章html内容 */
            insertContent(parseHTMLcontent(alticle));/* 写入目录 */
            $("title")[0].innerText = alticlelist[uuid]["path"].split("/").pop().split(".")[0] + "&emsp;|&emsp;武陆柒的个人博客";/* 插入标题 */
            hljs.initHighlightingOnLoad();	/* 代码高亮 */
            hljs.highlightAll();/* 初始化 */
            stickySidebar("#left-content");
            zoomInpicture();
        }
        else {
            // 若uuid不存在
            alert("未找到该文章，即将返回。");
            window.history.back(-1);
        }
    }
    else {
        // 若alticle-detail页面的url参数为空
        alert("页面访问出错，即将返回。");
        window.history.back(-1);
    }
}


// 在目录栏插入目录
function insertContent(content) {
    var content_box = $("#left-contentlist").children(".data-cantainer");
    var content_html = "";
    if (!isEmpty(content)) {
        var level = [0, 0, 0];	/* 记录标题的数量 */
        for (var item1 in content) {/* 一级标题 */
            level[0]++;
            level[1] = level[2] = 0;
            content_html += "<li><a class=\"meta-data\" href=\"#_title" + level[0] + "\">" + item1 + "</a></li>";
            if (!isEmpty(content[item1])) {
                content_html = content_html.substring(0, content_html.length - 5) + "<ul>";
                for (var item2 in content[item1]) {
                    level[1]++;
                    level[2] = 0;
                    content_html += "<li><a class=\"meta-data\" href=\"#_title" + level[0] + "-" + level[1] + "\">" + item2 + "</a></li>";
                    if (!isEmpty(content[item1][item2])) {
                        content_html = content_html.substring(0, content_html.length - 5) + "<ul>";
                        for (var item3 of content[item1][item2]) {
                            level[2]++;
                            content_html += "<li><a class=\"meta-data\" href=\"#_title" + level[0] + "-" + level[1] + "-" + level[2] + "\">" + item3 + "</a></li>";
                        }
                        content_html += "</ul></li>";
                    }
                }
                content_html += "</ul></li>";
            }
        }
    }
    else { content_html = "<li><p class=\"meta-data\">无目录。</p></li>"; }
    content_box.append(content_html);
}

function parseHTMLcontent(alticle) {
    var title_line = alticle.match(/\<h[123].*?\>.+(\<\/h[123]\>)?/g);	/* 获取一到三级标题 */
    var title_dict = {};
    var title = [" ", " "];
    for (var i = 0; i < title_line.length; i++) {
        var content = title_line[i].replace(/\<h[123].*?\>/g, "").replace(/\<\/h[123]\>/g, "");
        if (title_line[i][2] == "1") {
            title[0] = content;
            title_dict[title[0]] = {};
        }
        else if (title_line[i][2] == "2") {
            title[1] = content;
            title_dict[title[0]][title[1]] = [];
        }
        else {
            title_dict[title[0]][title[1]].push(content);
        }
    }
    console.log(title_dict);
    return title_dict;
}
