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

function include(element, part) {
    var box = $(element);
    box.append(getText("static/site-part-element/part-" + part + ".html"));
}