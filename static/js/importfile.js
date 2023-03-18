function getJSON(fileurl) {
    return $.ajax({
        url: fileurl,
        type: "get",
        async: false,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    }).responseJSON;
}

function getText(fileurl) {
    return $.ajax({
        url: fileurl,
        type: "get",
        async: false,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    }).responseText;
}

function getFile(fileurl) {
    return $.ajax({
        url: fileurl,
        type: "get",
        async: false,
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        }
    })
}

function include(element, part) {
    var box = $(element);
    if (typeof (part) == "object") {
        for (var item of part) {
            box.append(getText("static/site-part-element/part-" + item + ".html"));
        }
    }
    else if (typeof (part) == "string") { box.append(getText("static/site-part-element/part-" + part + ".html")); }
    else {
        console.log("出错！");
    }
}

function escapeURL(string) {
    return string.replace(/\"/g, "%22").replace(/\#/g, "%23").replace(/\%/g, "%25").replace(/\&/g, "%26").replace(/\+/g, "%2B");
}

function stickySidebar(element) {
    /* 粘性侧边栏滚动 */
    var left_area = $(element)[0];
    if (left_area.scrollHeight > (window.outerHeight - 60)) {/* 如果左侧目录栏高度>屏幕高度，停靠位置等于屏幕高度-目录栏高度<0,即将顶部多于部分隐藏 */
        left_area.style.top = String(window.outerHeight - left_area.scrollHeight + 20) + "px";
    }
    else {
        left_area.style.top = "80px";
    }
}

function zoomInpicture() {
    $(".paragraph").children("img").each(function () {/* 点击图片放大查看 */
        $(this).click(function () {
            $("#view-figure")[0].style.display = "flex";
            $("#view-figure").children("img")[0].style.height = ((this.naturalHeight / this.naturalWidth) > (window.outerHeight / window.outerWidth)) ? "90%" : "auto";
            $("#view-figure").children("img")[0].style.width = ((this.naturalHeight / this.naturalWidth) > (window.outerHeight / window.outerWidth)) ? "auto" : "90%";
            $("#view-figure").children("img")[0].src = this.src;
        })
    })
    $("#view-figure").click(function () {	/* 放大图片点击还原 */
        $(this).children("img").src = null;
        this.style.display = "none";
    })
}

window.datacount = getJSON("static/data/json/data_count.json");
