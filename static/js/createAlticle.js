$(document).ready(function(){
    var url=new URL(window.location.href)
    if(url.searchParams!=0){
	// 如果alticle-detail页面存在参数
	if(url.searchParams.get("uuid")!=null){
	    // 如果参数中存在uuid
	    var uuid=url.searchParams.get("uuid");
	    // 读取文章统计文件
	    }
	else{
	    // 不存在uuid参数则返回
	    alert("参数错误，即将返回。");
	    window.history.back(-1);}
	if(uuid in alticlelist){
	    // 在文章统计json中通过uuid查找文章，若存在，则读取对应文件
	    var contentlist;
	    var alticle=$.ajax({
		url:alticlelist[uuid]["path"],
		type:"get",
		async:false,
		error:function(){
		    alert("资源查询错误，即将返回。");
		    window.history.back(-1);}
	    }).responseText;
	    // 如果是html文件
	    if (alticlelist[uuid]["path"].split(".")[1]=="html") {
		contentlist = parseHTMLcontent(alticle);}
	    else {[alticle, contentlist] = parsemarkdown(alticle);}
	    // 写入文章html内容
	    $("#alticle-box").append(alticle);
            // 写入目录
	    createContent(contentlist);
            // 代码高亮
	    hljs.initHighlightingOnLoad(); // 初始化
	    hljs.highlightAll();
	    // 粘性侧边栏滚动
	    var left_area=$("#left-content")[0];
	    if(left_area.scrollHeight > (window.outerHeight-60)){
		// 如果左侧目录栏高度>屏幕高度，停靠位置等于屏幕高度-目录栏高度<0,即将顶部多于部分隐藏
		left_area.style.top=String(window.outerHeight-left_area.scrollHeight+20)+"px";}
	    else{
		left_area.style.top="80px";}
            
	    // 点击图片放大查看
	    $(".paragraph").children("img").each(function(){
		$(this).click(function(){
		    $("#view-figure")[0].style.display="flex";
		    $("#view-figure").children("img")[0].style.height=((this.naturalHeight/this.naturalWidth)>(window.outerHeight/window.outerWidth))?"90%":"auto";
		    $("#view-figure").children("img")[0].style.width=((this.naturalHeight/this.naturalWidth)>(window.outerHeight/window.outerWidth))?"auto":"90%";
		    $("#view-figure").children("img")[0].src=this.src;})})
	    // 放大图片点击还原
	    $("#view-figure").click(function(){
		$(this).children("img").src=null;
		this.style.display="none";})}
	else{
	    // 若uuid不存在
	    alert("未找到该文章，即将返回。");
	    window.history.back(-1);}}
    else{
	// 若alticle-detail页面的url参数为空
	alert("页面访问出错，即将返回。");
	window.history.back(-1);}})

// 在目录栏插入目录
function createContent(content){
    var content_box=$("#left-contentlist").children(".data-cantainer");
    if(!isEmpty(content)){
	var i=1;
	for(var item in content){//一级标题
	    content_box.append("<li id=\"_li_" + i + "\"><a class=\"meta-data\" href=\"#_title"+ i +"\">"+ item +"</a></li>");
	    if(!isEmpty(content[item])){
		var li = content_box.children("#_li_"+i);
		var j=1;
		li.append("<ul></ul>");
		if(content[item] instanceof Array){
		    for(var subitem in content[item]){//二级标题，没有三级标题
			li.children("ul").append("<li><a class=\"meta-data\" href=\"#_title" + i +  "-" + j + "\">" + content[item][subitem] + "</a></li>");
			j++;}}
		else{
		    for(var subitem in content[item]){//二级标题，有三级标题
			li.children("ul").append("<li id=\"_li_\"" + i + "-" + j + "><a class=\"meta-data\" href=\"#_title" + i +  "-" + j + "\">" + subitem + "</a></li>");
			if(!isEmpty(content[item][subitem])){
			    $("#_li_"+i+"-"+j).append("<ul></ul>");
			    for(var k=0; k<content[item][subitem].length; k++){//三级标题
				$("#_li_"+i+"-"+j).children("ul").append("<li><a class=\"meta-data\" href=\"#_title" + i +  "-" + j + "-" + k + "\">" + content[item][subitem][k] + "</a></li>");
			    }}
			j++;
		    }}}
	    i++;}}
    else {content_box.append("<li><p class=\"meta-data\">无目录。</p></li>");}
}

function parseHTMLcontent(alticle){
    var bigtitle = alticle.match(/\<h1.*?\>.+\<\/h1\>/g);
    console.log(bigtitle)
    if(bigtitle != null) { document.getElementsByTagName("title")[0].innerText = bigtitle[0].replace(/\<.+?>/g,""); }
    var title_withTag = alticle.match(/\<h[23].*\>.+\<\/h[23]\>/g);
    if(title_withTag != null){
        var content = {}
        for(var line in title_withTag){
            var titl2 = " "
            if(title_withTag[line].indexOf("h2") != -1){
                title2 = title_withTag[line].replace(/\<.+?\>/g, "");
                content[title2] = []
            }
            else{
                content[title2].push(title_withTag[line].replace(/\<.+?\>/g, ""));
            }
        }
        return content;
    }
    return null;
}
