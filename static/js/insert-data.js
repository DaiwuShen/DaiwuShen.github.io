function insertData() {
    // 插入公告
    insertAnnounce(window.datacount["announce"]);
    insertTags(window.datacount["tags"]);
    insertBasecount(window.datacount);
    insertClasslist(window.datacount["classification"]);
    insertAchivelist(window.datacount["achive"]);
    insertTools(window.datacount["tools"]);
    insertRecentlist(window.datacount["alticles"]);
    insertInformation(window.datacount);
}

// 插入公告
function insertAnnounce(announce) {
    // 生成公告
    var announce_box = $("#left-announcement");
    if (announce_box.length) {
        for (var item of announce) {
            announce_box.append("<div class=\"data-cantainer\"><div class=\"meta-data\"><p>" + item + "</p></div></div>");
        }
    }
}

// 生成作者信息栏
function insertBasecount(jsondata) {
    $("#avatar")[0].src = jsondata["avatar"];
    $("#base-data-box").children("div").children("p")[0].innerText = jsondata["alticles-count"];
    $("#base-data-box").children("div").children("p")[1].innerText = jsondata["classifications-count"];
    $("#base-data-box").children("div").children("p")[2].innerText = jsondata["tags-count"];
}

// 生成标签列表
function insertTags(tags) {
    var tags_div = $("#tags");
    if (tags_div.length) {
        for (var item in tags) {
            tags_div.append("<a class=\"tag\" href=\"tags.html?tag=" + escapeURL(item) + "\">" + item + "</a>");
        }
    }
}

// 生成类别列表
function insertClasslist(classi) {
    var classi_div = $("#classification");
    if (classi_div.length) {
        var html = "";
        // 生成类别列表
        for (var key in classi) {
            var line = "";
            var count = 0;
            if ((classi[key].length != 0 || classi[key] != null) && typeof (classi[key]) == "object") {
                line += "<ul>";
                for (var key1 in classi[key]) {
                    line += "<li class=\"class\"><a href=\"class.html?class=" + escapeURL(key1) + "\" class=\"meta-data\"><span>" + key1 + "</span><span>" + classi[key][key1] + "</span></a></li>";
                    count += classi[key][key1];
                }
                line += "</ul>";
            }
            html += "<li class=\"class\"><a href=\"class.html?class=" + escapeURL(key) + "\" class=\"meta-data\"><span>" + key + "</span><span>" + count + "</span></a>" + line + "</li>";
        }
        html = "<ul>" + html + "</ul>";
        classi_div.append(html);
    }
}

// 生成归档列表
function insertAchivelist(achive) {
    var achive_div = $("#achive");
    if (achive_div.length) {
        var i = 0;
        for (var key in achive) {
            var count = 0;
            achive_div.append("<li id=\"achive_" + String(i) + "\"><a href=\"\" class=\"meta-data\"><span>" + String(key) + "年</span><span id=\"achive_" + String(i) + "_num\"></span></a><ul></ul></li>");
            for (var j = 0; j < 12; j++) {
                if (achive[key][j] > 0) {
                    achive_div.children("#achive_" + String(i)).children("ul").append("<li><a href=\"\" class=\"meta-data\"><span>" + String(j + 1) + "月</span><span>" + String(achive[key][j]) + "</span></a></li>")
                    count += achive[key][j];
                }
            }
            $("#achive_" + String(i) + "_num").text(count);
            i += 1;
        }
    }
}

// 获取最近文章信息
function insertRecentlist(alticlelist) {
    // 生成最近文章列表
    var recentbox = $("#left-recent");
    if (recentbox.length) {
        var i = 0;
        var recent_html = "";
        for (var uuid in alticlelist) {
            recent_html += "<div class=\"data-cantainer\"><a class=\"meta-data\" href=\"alticle-detail.html?uuid=" + uuid + "\"><span class=\"alticle-title\">" + alticlelist[uuid]["name"] + "</span><p class=\"alticle-date\">" + alticlelist[uuid]["date"] + "</p></a></div>";
            i++;
            if (i >= 5) { break; }
        }
        recentbox.append(recent_html);
    }
}

// 插入自制工具列表
function insertTools(toollist) {
    var cantainer = $("#left-tools");
    if (cantainer.length) {
        var i = 0;
        var toolhtml = "";
        for (var name in toollist) {
            toolhtml += "<div class=\"data-cantainer\"><a class=\"meta-data\" href=\"tool.html?tool=" + escapeURL(name) + "\"><span class=\"alticle-title\">" + name + "</span><p class=\"alticle-date\">" + toollist[name]["description"] + "</p></a></div>";
            i++;
            if (i >= 5) { break; }// 限制显示个数为5个
        }
        cantainer.append(toolhtml);
    }
}

// 插入网站资讯
function insertInformation(jsondata) {
    var alticle_count = $("#alticle-count");
    var last_update = $("#recently-update");
    var runtime = $("#site-runtime");
    if (alticle_count.length) {
        $("#alticle-count").text(jsondata["alticles-count"]);
    }
    if (last_update.length) {
        last_update.text(jsondata["last-update"]);
    }
    if (runtime.length) {
        setInterval(function () {
            $("#site-runtime").text(delta_time(Date.parse(jsondata["site-setuptime"]), Date()));
        }, 1000);
    }
}

function delta_time(start_time, end_time) {
    var start = new Date(start_time);
    var end = new Date(end_time);
    var deltatime = end - start;
    var day = Math.floor(deltatime / (24 * 60 * 60 * 1000));
    var hour = Math.floor((deltatime - day * 24 * 60 * 60 * 1000) / (60 * 60 * 1000));
    var min = Math.floor((deltatime - (day * 24 + hour) * 60 * 60 * 1000) / (60 * 1000));
    var sec = (deltatime - (((day * 24 + hour) * 60) + min) * 60 * 1000) / 1000;
    return String(day + "天" + hour + "时" + min + "分" + sec + "秒");
}
