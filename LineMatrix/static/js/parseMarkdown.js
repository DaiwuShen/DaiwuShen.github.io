function parsemarkdown(alticle){
    var codeblocks, content_list;
    alticle = alticle.replace(/\-\-\-/g, "<hr style=\"border: double 1px deepskyblue; width: 80%\"/>");//分割线
    [alticle, codeblocks] = parseMdcodeblock(alticle);
    alticle = parseMdlist(alticle);
    [alticle, content_list] = parseMdtitle(parseMdlink(parseMditalic(parseMdHighlight(parseMdstrong(alticle)))));
    alticle = parseMdblockquote(alticle);
    alticle = parseMdnomalpar(parseMdpretreat(alticle));
    alticle = backMdcodeblock(alticle, codeblocks);
    if(alticle.split("\n")[0].match(/\<img\s.+\/\>/g) != null) {alticle = alticle.replace(alticle.split("\n")[0], alticle.split("\n")[0] + "<div class=\"alticle-detail\"><div class=\"paragraph\">");}
    else {alticle = "<div class=\"alticle-detail\"><div class=\"paragraph\">"+alticle;}
    return [alticle + "</div></div>", content_list]}

// 预处理，清除空行
function parseMdpretreat(str){
    var lines = str.split("\n");//把str分割
    if(lines != null){
	str = "";//清空str
	for (var i=0; i<lines.length; i++){
	    if(lines[i][0] != ""){//清除空行
		str += lines[i] + "\n";}}}
    return str;}

// 解析引用块
function parseMdblockquote(str){
    if(str != null){
	var like_quotes = str.match(/.*\>\x20.*/g);//找出疑似引用块的行
	if(like_quotes != null){
	    var quote_lines = [];
	    for(var i = 0; i < like_quotes.length; i++){
		if(like_quotes[i].match(/^\>\x20/g) != null){
		    quote_lines.push(like_quotes[i]);}}
	    var blockquote = [];
	    blockquote[0] = [];
	    blockquote[0].push(quote_lines[0]);
	    var quotehtml = quote_lines[0]+"\n";
	    var j = 0;
	    for(var i = 1; i < quote_lines.length; i++){
		if(str.indexOf(quote_lines[i]) == str.indexOf(quote_lines[i-1]) + quote_lines[i-1].length + 1){//依靠连续性判断是否是同一
		    blockquote[j].push(quote_lines[i]);
		    quotehtml += quote_lines[i] + "\n";
		}
		else{
		    j++;
		    blockquote[j] = [];
		    str = str.replace(quotehtml, "<div id=\"blockquote_" + j + "\"></div>");
		    quotehtml = quote_lines[i]+"\n";
		    
		}
	    }
	    str = str.replace(quotehtml, "<div id=\"blockquote_" + j + "\"></div>");
	    console.log(quotehtml);
	    console.log(str.indexOf(quotehtml));
	    for(var i = 0; i < blockquote.length; i++){
		html = "";
		for(var j = 0; j < blockquote[i].length; j++){
		    html += blockquote[i][j].replace(/\>\x20/g, "").replace(/\&/g, "&amp").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/\x20/g, "&emsp;").replace(/\t/g, "&emsp;&emsp;&emsp;&emsp;") + "<br>";
		}
		str = str.replace("<div id=\"blockquote_" + i + "\"></div>", "<blockquote>" + html + "</blockquote>");
	    }
	}
    }
    return str;
}

// 解析增强性文本
function parseMdstrong(str){
    var strong_text=str.match(/(\*\*|__)(.+?)(\*\*|__)/g);//加粗文本
    if(strong_text != null){
	for(var i = 0; i < strong_text.length; i++){
	    str = str.replace(strong_text[i], "<strong>" + strong_text[i].match(/[^(**)^(__)]+/g)[0] + "</strong>");}}
    return str;}

// 解析文本高亮
function parseMdHighlight(str){
    var highlight_text=str.match(/==(.+?)==/g);//背景高亮文本
    if(highlight_text != null){
	for (var i=0;i<highlight_text.length;i++){
	    str=str.replace(highlight_text[i], "<span style=\"background-color: yellow\">"+ highlight_text[i].match(/[^(==)]+/g)[0] +"</span>");}}
    return str;}

// 解析斜体文本
function parseMditalic(str){
    var em_text=str.match(/(_|\*)(.+?)(_|\*)/g);//斜体文本
    if(em_text != null){
	for (var i=0;i<em_text.length;i++){
	    str=str.replace(em_text[i], "<em>" + em_text[i].match(/[^_^*]+/g)[0] + "</em>");}}
    return str;}

// 解析标题
function parseMdtitle(str){
    var content_list = {};
    var titles = str.match(/#+\s.+/g); //获取到全部的标题
    if(titles == null) {return titles;} //如果标题列表为空，直接返回
    var titlenum = [0,0]; //标记二级标题、三级标题的个数
    var title2 = ""; //暂存二级标题
    for(var i = 0; i < titles.length; i++){
	var titlelevel = titles[i].indexOf(" ");
	if(titlelevel == 1){//一级标题用alticle-title包裹
	    var title1 = titles[i].match(/[^#^\s]+/g)[0];
            document.getElementsByTagName("title")[0].innerText = title1;
	    str = str.replace(titles[i], "<div class=\"alticle-title\"><h1 id=\"_title0\">" + title1 + "</h1></div>");}
	else if(titlelevel == 2){
	    titlenum[0] ++;
	    titlenum[1] = 0;
	    title2 = titles[i].slice(titles[i].indexOf(" ")+1)
	    str = str.replace(titles[i], "<h2 id=\"_title" + titlenum[0] + "\">" + title2 + "</h2>");
	    content_list[title2] = [];}
	else if(titlelevel == 3){
	    titlenum[1] ++;
	    str = str.replace(titles[i], "<h3 id=\"_title" + titlenum[0] + "-" + titlenum[1] + "\">" + titles[i].slice(titles[i].indexOf(" ")+1) + "</h3>");
	    content_list[title2].push(titles[i].slice(titles[i].indexOf(" ")+1));}
	else {
	    str = str.replace(titles[i], "<h" + titlelevel + ">" + titles[i].match(/[^#^\s]/g)[0] + "</h" + titlelevel + ">");}}
    return [str, content_list];}

// 解析代码块，理论上代码块的情况比较复杂，这里是将解析后的代码块传出来，在全部解析结束后在拼接上去
function parseMdcodeblock(str){
    var codeblocks = str.match(/```(.|\n|\r)+?```/g);//获取到```包裹的代码块整体
    if(codeblocks != null){
	for(var i=0; i<codeblocks.length; i++){
	    str=str.replace(codeblocks[i], "<pre><code id=\"codeblock_" + i + "\"></code></pre>");//在文本中做标记，方便将代码块放回
	    codeblocks[i]=codeblocks[i].replace(/\&/g, "&amp").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/(\x20\x20|\t)/g, "&emsp;&emsp;");//将特殊字符用html的转义字符替换
	    codeblocks[i]=codeblocks[i].replace(codeblocks[i].match(/^```.*\n/g)[0], "<code>").replace(codeblocks[i].match(/\n```$/g)[0], "</code>");}}//将代码块的```符号去掉
    return [str, codeblocks];}

// 放回代码块
function backMdcodeblock(str, codeblocks){
    if(codeblocks != null){
	for (var i = 0; i < codeblocks.length; i++) {
	    var linenum=codeblocks[i].split("\n").length;
	    var codelinebox="<div class=\"hljs-ln-numbers line-number\">";
	    for(var j=1;j<linenum+1;j++){
		codelinebox += "<p>" + j +"</p>";}
	    codelinebox += "</div>";
	    str=str.replace("<code id=\"codeblock_" + i + "\"></code>", codelinebox + codeblocks[i]);}}
    return str;}

// 解析markdown列表
function parseMdlist(str){
    var items = str.match(/(\x20+|\t+)?([\d]+\.|\-)\x20.+/g);//获取全部列表
    if(items != null){
	var block = [];//分块存储列表块
	var j = 0;
	var htmlblock = items[0]+"\n";//暂存列表字符串，方便后面给str添加定位
	block[j] = [];
	block[j].push(items[0]);
	for (var i = 1; i < items.length; i++) {
	    if(str.indexOf(items[i]) == (str.indexOf(items[i-1]) + items[i-1].length +1)){//判断前一个列表项目是否与后一个列表项目连续，不连续则为两块不同的列表
		block[j].push(items[i]);
		htmlblock += items[i] + "\n";
	    }
	    else{
		str = str.replace(htmlblock, "<div id=\"listblock_" + j + "\">");
		j++;
		block[j] = [];
		block[j].push(items[i]);
		htmlblock = items[i]+"\n";
	    }
	}
	str = str.replace(htmlblock, "<div id=\"listblock_" + j + "\">");
    }
    if(block != null){
	var parselist = [];//存储列表块解析后的html代码
	for(var i = 0; i < block.length; i++){
	    var listhtml = ["", "", ""];//暂存一级、二级、三级列表项目
	    for(var j = 0; j < block[i].length; j++){
		if(block[i][j].indexOf(block[i][j].match(/([\d]+\.|\-)\x20/g)[0]) == 0){//一级列表前方无制表符
		    if(listhtml[2] != ""){//判断前面是否暂存有三级列表
			if(block[i][j-1].match(/\-\x20/g) != null){
			    listhtml[1] += "<ul>" + listhtml[2] + "</ul>";
			}
			else{
			    listhtml[1] += "<ol>" + listhtml[2] + "</ol>";
			}
			listhtml[2] = "";
		    }
		    if(listhtml[1] != ""){//如果先前有暂存二级列表将二级列表合并
			if(block[i][j-1].match(/\-\x20/g) != null){//通过
			    listhtml[0] += "<ul>" + listhtml[1] + "</ul>";
			}
			else{
			    listhtml[0] += "<ol>" + listhtml[1] + "</ol>";
			}
			listhtml[1] = "";
		    }
		    listhtml[0] += block[i][j].replace(block[i][j].match(/(\x20+|\t+)?([\d]+\.|\-)\x20/g), "<li>") + "</li>";
		    listhtml[2] = "";
		}
		else if(block[i][j].indexOf(block[i][j].match(/([\d]+\.|\-)\x20/g)[0]) == 1){//二级列表的前方有一个制表符
		    if(listhtml[2] != ""){//若先前有暂存的三级列表，则合并
			if(block[i][j-1].match(/\-\x20/g) != null){
			    listhtml[1] += "<ul>" + listhtml[2] + "</ul>";
			}
			else{
			    listhtml[1] += "<ol>" + listhtml[2] + "</ol>";
			}
			listhtml[2] = "";
		    }
		    listhtml[1] += block[i][j].replace(block[i][j].match(/(\x20+|\t+)?([\d]+\.|\-)\x20/g), "<li>") + "</li>";
		}
		else{
		    listhtml[2] += block[i][j].replace(block[i][j].match(/(\x20+|\t+)?([\d]+\.|\-)\x20/g), "<li>") + "</li>";
		}
	    }
	    if(listhtml[2] != ""){
		if(block[i][j-1].match(/\-\x20/g) != null){
		    listhtml[1] += "<ul>" + listhtml[2] + "</ul>";
		}
		else{
		    listhtml[1] += "<ol>" + listhtml[2] + "</ol>";
		}
		listhtml[2] = "";
	    }
	    if(listhtml[1] != ""){
		if(block[i][j-1].match(/\-\x20/g) != null){
		    listhtml[0] += "<ul>" + listhtml[1] + "</ul>";
		}
		else{
		    listhtml[0] += "<ol>" + listhtml[1] + "</ol>";
		}
		listhtml[1] = "";
	    }
	    if(block[i][0][0] == "-"){
		parselist.push("<ul>" + listhtml[0] + "</ul>");
	    }
	    else{
		parselist.push("<ol>" + listhtml[0] + "</ol>");
	    }
	}
	for(var i = 0; i < parselist.length; i++){
	    str = str.replace("<div id=\"listblock_" + i + "\">", parselist[i]);
	}
    }
    return str;
}

// 解析链接和图片
function parseMdlink(str){
    var links=str.match(/!?\[.+?\]\(https?:\/\/.+\)/g);// 解析出链接
    if(links != null){
	for (var i = 0; i < links.length; i++) {
	    var text_link=links[i].match(/[^!^\[^\(^\]^\)]+/g);
	    if(links[i][0] == "!") {str = str.replace(links[i], "<img src=\"" + text_link[1] + "\" loading=\"lazy\" alt=\"" + text_link[0] + "\" />");}
	    else {str = str.replace(links[i], "<a href=\"" + text_link[1] + "\">" + text_link[0] + "</a>");}}}
    return str;}



// 解析普通文本
function parseMdnomalpar(str){
    var lines=str.split("\n");
    if(str != null){
	for (var i = 0; i < lines.length; i++){
	    if(lines[i][0] != "<" && lines[i].length != 0){
		str=str.replace(lines[i], "<p>" + lines[i] + "</p>");}}}
    return str;}

// 判断对象是否为空
function isEmpty(obj){
    for(var n in obj){
	return false;
    }
    return true;
}
