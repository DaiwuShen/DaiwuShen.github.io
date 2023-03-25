window.onload = function () {
    include("#header", "header")
    include("#left-area", ["author", "announce"])
    var ele = document.createElement("div")
    ele.id = "left-content"
    document.getElementById("left-area").append(ele)
    include("#left-content", ["sort", "tags", "tools", "information"])
    stickySidebar("#left-content");
    insertData();
}