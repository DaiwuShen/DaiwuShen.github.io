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

window.datacount = getJSON("static/data/json/data_count.json");