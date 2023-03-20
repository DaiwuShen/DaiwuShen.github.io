![banner](https://cdn.staticaly.com/gh/DaiwuShen/daiwuImageBed@main/webP/informatrixspace-informatrix-18.50s3czapdqm8.webp)

# 「Javascript」解析markdown为html——标题篇

> author: 陆柒
>
> date: 2023-03-20
>
> classification: 计算机 . javascript
>
> tag: Javascript, 解析, markdown, html, 格式转换, 目录跳转

## 1 前言

在 markodwn 解析中，标题是最简单的格式之一。简单到只需要将 “#” 符号去掉，换之 html 的标题标签即可。

---



## 2 格式分析

### 2.1 markdown

在 markdown 中，一条标题的格式为：

```markdown
# title1
## title1.1
### title1.1.1
```

由此可见 markdown 中标题的格式：一方面， ==“#” 的个数代表了标题的级数==，其中一级标题比较大，与正文字体差距较大，比较适合作为文章标题，二极标题则适合作为章节标题，三级标题适合作小节标题……以上只是我在记录笔记时的个人风格，如何使用完全看个人。

另一方面， ==“#” 标记与标题内容之间用空格分隔==，这便给了解析以便利性。于是便有两种方法来得到对应的标题级数：

1. 数 “#” 符号的个数，
2. 获取第一个空格的下标。

相对来说，获取空格的下标更便捷一些，在 javascript 中，获取一个字符在字符串中第一次出现的位置只需要函数：

```javascript
var str = "#### title1.1.1.1";
var level = str.indexOf(" ");
```

---

### 2.2 html

在 html 中，标题标记与 markdown 的标题标记有一一对应的关系，虽然格式不同，但是只需要一点简单的替换就能将 markdown 解析为html。Html 的标题格式为：

```html
<h1>title1</h1>
<h2>
    title1.1
</h2>
<h3>
    title1.1.1
</h3>
<h2>
    title1.2
</h2>
```

不同标签表示不同等级的标题。

---

## 3 代码

### 3.1 将 markdown 解析为 html

单单将 markdown 文本解析为 html 文本的实现如下：

```javascript
var str = "#### title1.1.1.1";
var level = str.indexOf(" ");
if(level==1){
    var title = str.replace(/^#+\x20/g,"");//把 # 标记和分割的空格替换掉，用正则匹配可以匹配任意多个 # ，是通用的。
    title = "<h" + level + ">" + title + "</h" + level + ">";//用 html 相同等级的标题标签包裹，可以跟上一步合写为一句
}
```

这里正则表达式的匹配效果如下：

<img load="lazy" src="https://cdn.staticaly.com/gh/DaiwuShen/daiwuImageBed@main/20230320/informatrixspace-Peek-2023-03-20-10-22.3mlyuoyc74xs.gif" alt="informatrixspace-Peek-2023-03-20-10-22" style="zoom:50%;" />



### 3.2 html 可跳转目录

对于一篇比较长的文章来说，目录是十分有必要的。我希望在自己博客的文章一侧放置一个目录，点击目录就能跳转到对应标题。这需要对 html 的标题标签设置 id ，然后在 <a> 标签的 href 属性对应到标题即可实现跳转。如下：

```html
<h1 id="title1">title1</h1>
<a href="#title1">点击跳转到title1</a>
```

所以我的解析 markdown 标题代码如下：

```javascript
var title_content = block.replace(/^\#+\x20/g, "");
title_content = replaceSpecialstyle(title_content);
var level = block.indexOf(" ");	/* 以空格的下标判断标题的等级 */
var title = [0,0,0];// 分别记录一级、二极、三级标题的个数，
if (level == 1) {
	title[0]++;
	title[1] = title[2] = 0;// 遇到以及标题需要将二极、三级标题的个数清零。因为标题序号都是1.1、2.1.1之类
	block_html += "<div class=\"alticle-title\"><h1 id=\"_title" + title[0] + "\">" + title_content + "</h1></div><div class=\"paragraph\">";
}
else if (level == 2) {
	title[1]++;
	title[2] = 0;	// 遇到二极标题时，三级标题需要清零
	block_html += "<h2 id=\"_title" + title[0] + "-" + title[1] + "\">" + title_content + "</h2>";
}
else if (level == 3) {
	title[2]++;
	block_html += "<h3 id=\"_title" + title[0] + "-" + title[1] + "-" + title[2] + "\">" + title_content + "</h3>";
}
else {	// 对于其他更小的标题就不用跳转了
	block_html += "<h" + level + ">" + title_content + "</h" + level + ">";
}
```

---

以上。