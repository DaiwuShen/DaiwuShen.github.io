""" python解析markdown文本 """
import re
import os


# 定义几个正则表达式，用于匹配markdown格式
title_re = re.compile("^\#+\x20")
code_re = re.compile("```(.|\n|\r)+```")
quote_re = re.compile("^>\x20.*")
list_re = re.compile("^([\d]+\.|\-)\x20.+")
sublist_re = re.compile("^(\t|\x20{2,3})+")
table_re = re.compile("\|\x20.*?\x20\|")
image_re = re.compile("\!\[.*\]\(.+\)")
link_re = re.compile("\!?\[.+\]\(.+\)")
html_re = re.compile("^<.+?>")
strong_re = re.compile("__[^\*_]+?__|\*\*[^\*_]+?\*\*")
highlight_re = re.compile("={2}.+?={2}")
italic_re = re.compile("_[^\*_]+?_|\*[^\*_]+?\*")


# 解析特殊格式
def parseMdstrong(line: str):
    strong_text = strong_re.findall(line)
    for word in strong_text:
        line = line.replace(
            word, "<strong>"+word[2:-2]+"</strong>")
    return line


# 解析高亮格式
def parseMdhighlight(line: str):
    highlight_text = highlight_re.findall(line)
    for word in highlight_text:
        line = line.replace(word, "<mark>"+word[2:-2]+"</mark>")
    return line


# 解析斜体格式
def parseMditalic(line: str):
    italic_text = italic_re.findall(line)
    for word in italic_text:
        line = line.replace(word, "<em>"+word[1:-1]+"</em>")
    return line


# 综合解析特殊样式
def parseMdspecial(line: str):
    return parseMditalic(parseMdhighlight(parseMdstrong(line)))


# 转义字符替换
def replaceSymbol(line: str, space: str = "&nbsp;"):
    return line.replace("&", "&amp").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;").replace(" ", space).replace("\t", space*2)


# 解析超链接
def parseMdlink(line: str):
    links = link_re.findall(line)
    for link in links:
        text_url = re.compile("[^\!\[\]\(\)]+").findall(link)
        if link[0] == "[":
            line = line.replace(link, "<a href=\"" +
                                text_url[1] + "\">" + text_url[0] + "</a>")
        else:
            line = line.replace(link, "<img src=\"" +
                                text_url[1]+"\" alt=\""+text_url[0]+"\">")
    return line


# 解析引用块
def parseMdquote(string: str):
    quote_html = "<blockquote>"
    lines = string.split("\n")
    i = 0
    subquote = ""
    length = len(lines)-1 if lines[-1] == "" else len(lines)
    while i < length:
        if re.match(r"^(>\x20){2}", lines[i]) != None:
            while re.match(r"^(>\x20){2}", lines[i]) != None:
                subquote += re.sub(r"^[>]\x20", "", lines[i])
                i += 1
                if i == length:
                    break
            quote_html += parseMdquote(subquote)
        else:
            if len(lines[i]) > 2:
                quote_html += "<p>" + \
                    parseMdlink(parseMdspecial(
                        replaceSymbol(lines[i][2:])))+"</p>"
            i += 1
    return quote_html+"</blockquote>"


# 解析列表
def parseMdlist(string: str):
    list_type = "ul" if string[0] == "-" else "ol"
    list_html = "<"+list_type+">"
    lines = string.split("\n")
    sublist = ""
    i = 0
    length = len(lines)-1 if lines[-1] == "" else len(lines)
    while i < length:
        if sublist_re.match(lines[i]) != None:
            while sublist_re.match(lines[i]) != None:
                sublist += re.sub(r"^(\t|\x20{2,3})", "", lines[i])+"\n"
                i += 1
                if i == length:
                    break
            list_html += parseMdlist(sublist)
        else:
            lines[i] = re.sub(r"^([\d]+\.|-)\x20", "", lines[i])
            list_html += "<li>" + \
                parseMdlink(parseMdspecial(replaceSymbol(lines[i]))) + "</li>"
            i += 1
    list_html += "</"+list_type+">"
    return list_html


# 解析表格
def parseMdtable(string: str):
    lines = string.split("\n")
    table_html = "<table><thead><tr>"
    tablehead = lines[0].replace(" | ", "|").replace(
        "| ", "").replace(" |", "").split("|")
    for thead in tablehead:
        table_html += "<th>"+parseMdlink(thead)+"</th>"
    table_html += "</tr></thead><tbody>"
    if lines[-1] == "":
        del lines[-1]
    for line in lines[2:]:
        tdata = re.sub(r"\x20+\|\x20+", "|", line[2:-2]).split("|")
        table_html += "<tr>"
        for td in tdata:
            table_html += "<td>"+parseMdlink(td)+"</td>"
        table_html += "</tr>"
    return table_html+"</tbody></table>"


# 将markdown分割为块
def markdown2block(alticle: str):
    if alticle == "":
        return None
    block_list = []
    block = ""
    for line in alticle.split("\n"):
        if line != "":
            block += line + "\n"
        else:
            if block != "":
                block_list.append(block[:-1])
                block = ""
    if block != "":
        block_list.append(block)
    return block_list


# 对每一块的处理
def parseMdblock(blocks: list):
    if blocks == None:
        return None
    # 开始解析
    alticle_html = ""
    title_num = [0, 0, 0]
    if image_re.match(blocks[0]) != None:
        alticle_html += parseMdlink(blocks[0])
    alticle_html += "<div class=\"alticle-detail\">"
    description = ""
    for block in blocks[1:]:
        block_html = ""
        # 解析标题
        if title_re.match(block) != None:
            title = parseMdspecial(replaceSymbol(
                block.replace(title_re.match(block)[0], ""), "&emsp;"))
            level = block.index(" ")
            if level == 1:
                title_num[0] += 1
                title_num[1] = title_num[2] = 0
                block_html += "<div class=\"alticle-title\"><h1 id=\"_title" + \
                    str(title_num[0]) + "\">" + title + \
                    "</h1></div><div class=\"paragraph\">"
            elif level == 2:
                title_num[1] += 1
                title_num[2] = 0
                block_html += "<h2 id=\"_title" + \
                    str(title_num[0]) + "-" + \
                    str(title_num[1]) + "\">" + title + "</h2>"
            elif level == 3:
                title_num[2] += 1
                block_html += "<h3 id=\"_title" + \
                    str(title_num[0]) + "-" + str(title_num[1]) + "-" + \
                    str(title_num[2]) + "\">" + title + "</h3>"
            else:
                block_html += "<h" + level + ">" + title + "</h" + level + ">"
        # 解析代码块
        elif code_re.match(block) != None:
            code_type = block.split("\n")[0].replace("```", "")
            if code_type == "":
                code_type = "less"
            codes = block.split("\n")[1:-1]
            block_html += "<pre><ul class=\"line-number\">"
            for i in range(len(codes)):
                block_html += "<li>"+str(i)+"</li>"
            block_html += "</ul><code class=\"language-"+code_type + \
                "\" style=\"padding:0.5em\">"
            for code in codes:
                block_html += replaceSymbol(code, "&ensp;")+"\n"
            block_html += "</code></pre>"
        # 解析引用
        elif quote_re.match(block) != None:
            block_html = parseMdquote(block)
        # 解析列表
        elif list_re.match(block) != None:
            block_html += parseMdlist(block)
        # 解析表格
        elif table_re.match(block) != None:
            block_html += parseMdtable(block)
        # 解析图片
        elif image_re.match(block) != None:
            block_html += parseMdlink(block)
        # 解析分割线
        elif "---" in block:
            block_html += "<hr style=\"border: double 1px deepskyblue; width: 80%;\"/>"
        # 对html格式的文本不解析
        elif html_re.match(block) != None:
            block_html = block
        # 普通文本
        else:
            block_html += "<p>" + \
                parseMdlink(parseMdspecial(replaceSymbol(block)))+"</p>"
            description += block
        alticle_html += block_html
    description = description.replace("\n", "").replace(
        "==", "").replace("**", "").replace("__", "").replace("_", "")
    return [alticle_html+"</div></div>", description[:200]]


if __name__ == "__main__":
    markdown_dir = "/home/evelden/文档/SDW_Notes/陆柒Blog/"
    html_dir = "/home/evelden/文档/CodeProject/LineMatrix/alticle-list/"
    markdown_list = os.listdir(markdown_dir)
    with open("/home/evelden/文档/CodeProject/LineMatrix/static/templates/alticle-detail.html", "r") as fin:
        alticle_template = fin.read()
    for inpath in markdown_list:
        with open(markdown_dir+inpath, "r") as fin:
            alticle_html, description = parseMdblock(
                markdown2block(fin.read()))
        title = inpath.split("/")[-1].split(".")[0]+"&ensp;|&ensp;陆柒的个人博客"
        html = alticle_template.replace("{{alticle}}", alticle_html).replace(
            "{{title}}", title).replace("{{description}}", description)
        filename = inpath.split(".")[0]
        with open(html_dir+filename+".html", "w") as fout:
            fout.write(html)
