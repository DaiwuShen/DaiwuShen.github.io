![anime-anime-girls-science-fiction-fantasy-girl-Fantasy-Architecture-2210141-wallhere.com](https://cdn.staticaly.com/gh/DaiwuShen/daiwuImageBed@main/blog/anime-anime-girls-science-fiction-fantasy-girl-Fantasy-Architecture-2210141-wallhere.com.jpg)

# 「Javascript」解析markdown为html——特殊样式篇

> author: 陆柒
>
> date: 2023-03-21
>
> classification: 计算机 . javascript
>
> tag: Javascript, 解析, markdown, html

## 1 前言

在记录笔记或撰写文章时，时常需要突出重点，让自己和读者关注到重要内容。在 markdown 和 html 中，常见的着重样式有**加粗**，==高亮==，_斜体_。在我的[个人博客](https://www.informatrix.space)中，为了更方便更完整地转换格式，在转换脚本中也加入了这方面的转换。

---



## 2 格式分析

### 2.1 加粗

markdown：

```markdown
**markdown加粗样式**
__markdown加粗样式__
```

html：

```html
<strong>html加粗样式</strong>
```

在 markdown 中加粗样式虽然有两种标记，但都是==前后各两个“*”或“_”进行包裹==，可以精确地对两符号之间的内容渲染加粗样式。对应于 html 则只需用 <strong> 标签包裹即可。

### 2.2 斜体

markdown：

```markdown
*markdown斜体*
_markdown斜体_
```

html：

```html
<em>html斜体</em>
```

markdown 语法很简单，==首尾各一个“*”或“_”时表示斜体==，两个时表示加粗。对应于 html 的<em>标签。

### 2.3 高亮

markdown：

```
==markdown高亮样式==
```

html：

```html
<span style="background-color:yellow">html高亮</span>
<mark>html高亮</mark>
```

在 html 中两种方式都有，但是直接使用 mark 标签是专用来标记的标签，使用更方便。

---



## 3 代码

### 3.1 解析加粗样式

```javascript
function parseMdstrong(str) {
	var strong_text = str.match(/(\*\*|__)(.+?)(\*\*|__)/g);//匹配加粗文本，正则中(.+?)的？是为了避免过度匹配把多个加粗匹配成一个
	if (strong_text != null) {// 如果有这个样式
		for (var i = 0; i < strong_text.length; i++) {
			str = str.replace(strong_text[i], "<strong>" + strong_text[i].match(/[^(**)^(__)]+/g)[0] + "</strong>");// 替换成 html 标签
		}
	}
	return str;
}
```



### 3.2 解析斜体样式

```javascript
function parseMditalic(str) {
	var em_text = str.match(/(_|\*)(.+?)(_|\*)/g);//匹配斜体文本，同样为了避免正则贪婪匹配
	if (em_text != null) {
		for (var i = 0; i < em_text.length; i++) {
			str = str.replace(em_text[i], "<em>" + em_text[i].match(/[^_^*]+/g)[0] + "</em>");// 替换成 html 标签
		}
	}
	return str;
}
```



### 3.3 解析高亮样式

```javascript
function parseMdHighlight(str) {
	var highlight_text = str.match(/==(.+?)==/g);//正则匹配高亮文本
	if (highlight_text != null) {
		for (var i = 0; i < highlight_text.length; i++) {
			str = str.replace(highlight_text[i], "<mark>" + highlight_text[i].match(/[^(==)]+/g)[0] + "</mark>");// 替换成 html 标签
		}
	}
	return str;
}
```

代码中，运用了 ==match== 函数进行正则表达式匹配出特定格式的文本，也运用该函数匹配出样式标记包裹的文本。[正则表达式测试工具在这里](https://www.informatrix.space/tool.html?tool=%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%9C%A8%E7%BA%BF%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B7)。

---



## 4 其他

