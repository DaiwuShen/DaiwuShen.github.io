window.onload = function () {
    createAlticlepage();
    insertData();
}

function createAlticlepage() {
    include("#header", "header");
    include("#left-area", ["author", "announce"]);
    $("#left-area").append("<div id=\"left-content\"><div>");
    include("#left-content", ["contentlist", "recently", "tools", "visit"]);
    var alticle = document.getElementById("alticle-box").innerHTML;
    insertContent(parseHTMLcontent(alticle));/* 写入目录 */
    hljs.initHighlightingOnLoad();	/* 代码高亮 */
    hljs.highlightAll();/* 初始化 */
    stickySidebar("#left-content");
    zoomInpicture();
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
    var title_line = alticle.match(/<h[123].*?>.+?<\/h[123]>/g);	/* 获取一到三级标题 */
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
    return title_dict;
}

function isEmpty(obj) {
    for (var n in obj) {
        return false;
    }
    return true;
}
