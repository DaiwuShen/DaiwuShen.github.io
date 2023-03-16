function include(element, part) {
    var box = $(element);
    box.append(getText("static/site-part-element/part-" + part + ".html"));
}