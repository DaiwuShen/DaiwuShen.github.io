var alticle_count = $.ajax({
    url: "static/data/json/data_count.json",
    type: "get",
    async: false,
    error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(XMLHttpRequest.status);
        console.log(XMLHttpRequest.readyState);
        console.log(textStatus);}
}).responseJSON;

var wallpaper = $.ajax({
    url : "static/data/json/wallpapers.json",
    type : "get",
    async: false,
    error: "https://cdn.staticaly.com/gh/DaiwuShen/daiwuImageBed@main/wallhere/daiwus-anime-girl-1275965-wallhere.46hzxvakciyo.jpg"
}).responseJSON;

var alticlelist = $.ajax({
    url:"static/data/json/alticle_count.json",
    type:"get",
    async:false,
    error:function(){
	alert("不存在该文章，即将返回。");
	window.history.back(-1);}
}).responseJSON;
