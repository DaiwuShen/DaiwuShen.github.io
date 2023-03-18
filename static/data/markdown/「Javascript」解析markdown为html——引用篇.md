![banner](https://cdn.staticaly.com/gh/DaiwuShen/daiwuImageBed@main/webP/informatrixspace-informatrix-14.2hh2i2g4k4jk.webp)	

# 「Javascript」解析markdown为html——引用篇.md

> author: 陆柒
>
> date: 2023-03-18
>
> classification: 计算机 . javascript
>
> tag: Javascript, 解析, markdown, html

## 1 前言

在建设自己的博客时，由于没有实力置办服务器和云服务器，而且也没有这个必要。所以我想通过 **github pages** 托管自己的静态网页，但是对于静态网站来说，数据的修改比较麻烦。截止今天，根据我的一些思路，用 javascript 将网站尽可能地动态化，对于数据修改可以达到 ”更新一处，处处更新” 的效果。并且选择用 markdown 文本来存储博客，在浏览器实时渲染。网上看到的 js 库虽然很强大，但是需要我调整 css 样式以达到想要的效果，所以我选择==自己实现==，这样**我自己熟悉生成的 html 文本，方便调整样式**。下文记录将 ==markdown 引用块解析为html引用块标签==的实现方法。

---



## 2 分析

### 2.1 markdown中的引用块

在 markdown 中，引用块是通过符号 "==>==" 加空格进行标记，而且引用中还可以嵌套引用。如下代码：

```markdown
> 鲁迅没有说过
> 鲁迅说过
>> 鲁迅说过这一句
>> 鲁迅还说过这一句
> 好像鲁迅没说过
```

markdown 的效果如下：

![informatrixspace-ScreenShot_20230318-001646](https://cdn.staticaly.com/gh/DaiwuShen/daiwuImageBed@main/20230318/informatrixspace-ScreenShot_20230318-001646.4y9eoryci7b4.webp)

### 2.2 html中的引用块

在html中，引用块需要用标签

```html
<blockquote></blockquote>
```

包裹。比如：

```html
<blockquot>
    <p>
        鲁迅没有说过
    </p>
    <p>
        鲁迅说过
    </p>
    <blockquot>
    	<p>
            鲁迅说过这一句
        </p>
        <p>
            鲁迅还说过这一句
        </p>
    </blockquot>
    <p>
        好像鲁迅没说过
    </p>
</blockquot>
```

效果如下：


> 鲁迅没有说过
>
> 鲁迅说过
>
> > 鲁迅说过这一句
> >
> > 鲁迅还说过这一句
>
> 好像鲁迅没说过

### 2.3 分析对应关系

从中可以看出对应关系，连续的 "**>**" 符号表示这是一个连续的引用块，多个 ">" 表示多级引用。对于一个连续的引用块，使用 blockquote 标签包裹，引用的一行可以使用 p 标签标记。

## 3 代码

```javascript
/* 解析引用块 */
// 假设 markdown 格式的引用块为：
var md_quote = "> 鲁迅没有说过\n> 鲁迅说过\n>> 鲁迅说过这一句\n>> 鲁迅还说过这一句\n> 好像鲁迅没说过";
function parsequoteblock(string) {//传入一段 markdown 引用块格式的字符串
	var quote_html = "<blockquote>";//先使用一个 blockquote 标签标记开始
	var lines = string.split("\n");//将其分割成行
	var i = 0;
	var subquote = "";				// 用于记录次级引用
	while (i < lines.length - 1) {	
		if (lines[i].match(/^(>\x20?){2}/g) != null) {	// 判断二级及更高级次的引用
			while (lines[i].match(/^(>\x20?){2}/g) != null) {	//将次级引用拼接到一起
				subquote += lines[i].replace(/^\>/g, "");	//拼接时去掉开头的引用标记字符
				i++;
			}
			quote_html += parsequoteblock(subquote);	//递归调用，解析次级引用块
		}
		else if (lines[i].match(/^(>\x20?){1}.+/g) != null) {	//保证有内容再包裹为 p 标签，防止空内容的 p 标签出现
			quote_html += "<p>" + replaceSpecialstyle(replaceSpecialsymbol(lines[i].slice(2, lines[i].length))) + "</p>";//将一行文字用 p 标签包裹
			i++;
		}
		else {
			i++;
		}
	}
	quote_html += "</blockquote>";//封闭 blockquote 标签
	return quote_html;//返回解析的字符串
}
```

---



## 4 总结

由于 markdown 编辑器的格式稍有不同，比如在 typora 中，次级引用格式是

```markdown
> > 字符串
```

即两个标记字符间也是有空格的。一开始方法是在判断次级引用的地方判断第二个字符是不是 &gt; ，后来发现了格式上的小差异，遂改用正则匹配。我发现正则在大多数时候都是匹配字符串的最佳选择（不接受反驳，我就爱正则），为了方便测试，我在自己的博客中简单做了一个[测试工具（点这里）](https://www.informatrix.space/tool.html?tool=%E6%AD%A3%E5%88%99%E8%A1%A8%E8%BE%BE%E5%BC%8F%E5%9C%A8%E7%BA%BF%E6%B5%8B%E8%AF%95%E5%B7%A5%E5%85%B7)，欢迎使用。

由于正则表达式的使用，把原先的格式差异在一定程度上避免掉了，至于更多 markdown 编辑器的格式是否适用，有待进一步验证。