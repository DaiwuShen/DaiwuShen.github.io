// 
// let Today = new Date();
// background_image = wallpaper[(Today.getDate() < wallpaper.length)? (Today.getDate() % wallpaper.length) : (wallpaper.length % Today.getDate())]
// document.getElementById("header").style.backgroundImage = "url(\"" + background_image + "\")";//每日一图
// document.getElementById("foot-bar").style.backgroundImage = "url(\"" + background_image + "\")"
// console.log("wallpaper: " + (Today.getDate() < wallpaper.length)? Today.getDate() % wallpaper.length : wallpaper.length % Today.getDate())

$(document).ready(function(){
    var site_setuptime = insertCount(alticle_count);
    insertAbstract();
    setInterval(function(){
	$("#site-runtime").text(delta_time(Date.parse(site_setuptime), Date()));
    },1000)})

// 获取统计数据
function insertCount(jsondata){
    // 插入头像
    $("#avatar")[0].src = jsondata["avatar"];
    // 生成公告
    for(var item in jsondata["announce"]){
	$("#left-announcement").append("<div class=\"data-cantainer\"><p>"+ jsondata["announce"][item] +"</p></div>");}
    $("#alticle-count").text(jsondata["alticles-count"]);
    var tags=jsondata["tags"];
    var classi=jsondata["classification"];
    var achive=jsondata["achive"];
    createTags(tags);
    createBasecount(jsondata);
    createClasslist(classi);
    createAchivelist(achive);
    return jsondata["site-setuptime"];
}

// 生成归档列表
function createBasecount(jsondata){
    $("#base-data-box").children("div").children("p")[0].innerText=jsondata["alticles-count"];
    $("#base-data-box").children("div").children("p")[1].innerText=jsondata["classifications-count"];
    $("#base-data-box").children("div").children("p")[2].innerText=jsondata["tags-count"];
    $("#alticle-count").text(jsondata["alticle-count"]);
    $("#recently-update").text(jsondata["last-update"]);
}

// 生成标签列表
function createTags(tags){
    var tags_div = $("#tags");
    for (var item in tags) {
	tags_div.append("<a class=\"tag\">"+ item +"</a>");}}

// 生成类别列表
function createClasslist(classi){
    var i=0;
    var total=0;
    // 生成类别列表
    for (var key in classi){
	var classi_div = $("#classification");
	var count=0;
	classi_div.append("<li id=\"class_"+ String(i) +"\"><a href=\"\" class=\"meta-data\"><span>"+ String(key) +"</span><span id=\"class_"+ String(i) +"_num\"></span></a><ul></ul></li>");
	for(var key1 in classi[key]){
	    classi_div.children("#class_"+String(i)).children("ul").append("<li><a href=\"\" class=\"meta-data\"><span>"+ String(key1) +"</span><span>"+ String(classi[key][key1]) +"</span></a></li>");
	    count = count + classi[key][key1];
	}
	$("#class_"+String(i)+"_num").text(count);
	i+=1;
	total+=count;}
    return total;}

// 生成归档列表
function createAchivelist(achive){
    var achive_div = $("#achive");
    var i=0;
    for (var key in achive){
	var count = 0;
	achive_div.append("<li id=\"achive_"+String(i)+"\"><a href=\"\" class=\"meta-data\"><span>"+ String(key) +"年</span><span id=\"achive_"+ String(i) +"_num\"></span></a><ul></ul></li>");
	for (var j=0;j<12;j++){
	    if(achive[key][j] > 0){
		achive_div.children("#achive_"+String(i)).children("ul").append("<li><a href=\"\" class=\"meta-data\"><span>"+ String(j+1) +"月</span><span>"+ String(achive[key][j]) +"</span></a></li>")
		count += achive[key][j];
	    }
	}
	$("#achive_"+String(i)+"_num").text(count);
	i+=1;}}

// 获取最近文章信息
function insertAbstract(){
    // 读取文件
    var alticlelist=$.ajax({
	url:"static/data/json/alticle_count.json",
	type: "get",
	async:false,
	error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.log(XMLHttpRequest.status);
            console.log(XMLHttpRequest.readyState);
            console.log(textStatus);
        },
    }).responseJSON;
    // 生成最近文章列表
    for(var uuid in alticlelist){
	$("#left-recent").append("<div class=\"data-cantainer\"><a href=\"alticle-detail.html?uuid="+ uuid +"\"><span class=\"alticle-title\">"+ alticlelist[uuid]["path"].split("/").pop().split(".")[0] +"</span></a><p class=\"alticle-date\">"+ alticlelist[uuid]["date"] +"</p></div>")
    }
    // 生成首页文章列表
    var i=0;
    for(var uuid in alticlelist){
	var main_classi=Object.keys(alticlelist[uuid]["classification"])[0];
	var sub_classi=alticlelist[uuid]["classification"][main_classi];
	var htmlblock="<div id=\"alticle_"+ i +"\" class=\"data-block\">"+
	    "<div class=\"alticle-info\">"+
	    "<a class=\"alticle_"+ i +"_detail\" href=\"alticle-detail.html?uuid="+ uuid +"\"><div class=\"alticle-img\" style=\"background-image:url(" + alticlelist[uuid]["image"] + ");\"></div></a>"+
	    "<div class=\"alticle-baseinfo\">"+
	    "<a class=\"alticle_" + i + "_detail\" href=\"alticle-detail.html?uuid="+ uuid +"\"><h1>"+ alticlelist[uuid]["path"].split("/").pop().split(".")[0] +"</h1></a>"+
	    "<div class=\"alticle-meta\"><span>发表于</span><span>"+ alticlelist[uuid]["date"] +"</span><span>"+ main_classi +"</span><span>-&gt;</span><span>"+ sub_classi +"</span></div></div></div></div>"
	$("#alticlelist").append(htmlblock);
	i++;
    };
}

function delta_time(start_time, end_time){
    var start=new Date(start_time);
    var end=new Date(end_time);
    var deltatime=end-start;
    var day=Math.floor(deltatime/(24*60*60*1000));
    var hour=Math.floor((deltatime-day*24*60*60*1000)/(60*60*1000));
    var min=Math.floor((deltatime-(day*24+hour)*60*60*1000)/(60*1000));
    var sec=(deltatime-(((day*24+hour)*60)+min)*60*1000)/1000 ;
    return String(day+"天"+hour+"时"+min+"分"+sec+"秒");
}
