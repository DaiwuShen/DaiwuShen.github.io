import os
import re
import datetime


default_img = "https://cdn.staticaly.com/gh/DaiwuShen/daiwuImageBed@main/webP/informatrixspace-informatrix-16.27y0r3eip9mo.webp"
sitemap = "/home/evelden/文档/CodeProject/LineMatrix/urls.txt"
siteurls = ["http://informatrix.space", "https://informatrix.space", "https://www.informatrix.space",
            "http://informatrix.space/index.html", "https://informatrix.space/index.html", "https://www.informatrix.space/index.html",
            "http://informatrix.space/alticle-list.html", "https://informatrix.space/alticle-list.html", "https://www.informatrix.space/alticle-list.html",
            "http://informatrix.space/class.html", "https://informatrix.space/class.html", "https://www.informatrix.space/class.html",
            "http://informatrix.space/tags.html", "https://informatrix.space/tags.html", "https://www.informatrix.space.html",
            "http://informatrix.space/404.html", "https://informatrix.space/404.html", "https://www.informatrix.space/404.html"]
data_count = "static/data/json/data_count.json"
alticle_count = "static/data/json/alticle_count.json"
tool_count = "static/data/json/tools_count.json"
htmlDir = "alticle-list/"
alticle_list = "alticle-list/"
toolDir = "tool/"
MDdata_re = re.compile(">\x20.+:\x20.*")
HTMLdata_re = re.compile(
    "<blockquote>.+?</blockquote>")
TOOLdata_re = re.compile(
    "<meta[\x20\s\n\r]*name=\"description\"[\x20\s\n\r]*content=\".*?\">")
key_re = re.compile("[^\>]+")
img_re = re.compile("\(.+[^\)]")
alticlelist = {}
date_format = "%Y-%m-%d"


def getMetadata(path):
    """ 获取文章元数据 """
    metadata = {}
    with open(path, "r", encoding="utf8") as fh:
        filedata = fh.read()
    quote_block = HTMLdata_re.findall(filedata, re.M)[0]
    for key_value in re.findall(r"<p>.+?<\/p>", quote_block):
        key_value = key_value.replace("<p>", "").replace(
            "</p>", "").replace("&nbsp;", "").split(":")
        metadata[key_value[0]] = key_value[1]
    classi = metadata["classification"].split(".")
    metadata["classification"] = {classi[0]: classi[1]}
    metadata["tag"] = metadata["tag"].split(",")
    metadata["image"] = re.findall(r"src=\".+?\"", re.findall(r"<img\x20.+?>", filedata)[0])[0].replace(
        "src=\"", "").replace("\"", "") if re.findall(r"<img\x20.+?>", filedata) != [] else default_img
    metadata["title"] = path.split("/")[-1].split(".")[0]
    metadata["description"] = re.findall(
        r"<meta name=\"description\" content=\".*?\">", filedata, re.M)[0].replace("<meta name=\"description\" content=\"", "").replace("\">", "")
    return metadata


def createAlticlelistpage(alticlelist):
    html_list = ""
    for title in alticlelist.keys():
        main_classi = list(alticlelist[title]["classification"].keys())[0]
        sub_classi = alticlelist[title]["classification"][main_classi]
        html_list += "<div class=\"data-block\"><a href=\"alticle-list/" + title + \
            ".html\"><div class=\"alticle-info\"><div class=\"alticle-img\" style=\"background-image:url(" + alticlelist[title]["image"] + \
            ");\"></div><div class=\"alticle-baseinfo\"><h1>" + title + \
            "</h1><div class=\"description\">"+alticlelist[title]["description"]+"</div><div class=\"alticle-meta\"><span>"+main_classi+"</span><span>"+sub_classi+"</span></div><div class=\"alticle-meta\"><span>发布于</span><span>" + \
            alticlelist[title]["date"] + "</span></div></div></div></a></div>"
    html = ""
    with open("./static/templates/alticle-list.html", "r") as fin:
        for line in fin.readlines():
            if "{{alticle-list}}" in line:
                line = html_list
            html += line
    with open("./alticle-list.html", "w") as fout:
        fout.write(html)


def updateAlticlelist(alticlelist, path, metadata):
    """ 更新文章信息列表 """
    if path.split("/")[-1].split(".")[0] not in alticlelist.keys():
        # 如果是新的文章，需要通过比较时间来将决定文章插入的位置
        alticlelist_newer = {}  # 存储比新文章更新的文章
        alticlelist_older = {}  # 存储更旧的
        for key in alticlelist.keys():
            # 如果时间更新，则拷贝到newer
            if datetime.datetime.strptime(alticlelist[key]["date"], date_format) > datetime.datetime.strptime(metadata["date"], date_format):
                alticlelist_newer[key] = alticlelist[key]
            else:
                # 否则存储到older
                alticlelist_older[key] = alticlelist[key]
        title = metadata["title"]
        del metadata["title"]
        alticlelist = {**alticlelist_newer, **
                       {title: metadata}, **alticlelist_older}
    else:
        for alticle in alticlelist.keys():
            if alticlelist[alticle] == path.split("/")[-1].split(".")[0]:
                for key in alticlelist[alticle].keys():
                    if alticlelist[alticle][key] != metadata[key]:
                        alticlelist[alticle][key] = metadata[key]
    return alticlelist


def updateAlticlecount():
    """ 更新文章列表 """
    with open(alticle_count, "r", encoding="utf8") as fh:
        filedata = fh.read()
        if(filedata != ""):
            alticlelist = eval(filedata)
        else:
            alticlelist = {}
    for path in [htmlDir+i for i in os.listdir(htmlDir)]:
        metadata = getMetadata(path)
        alticlelist = updateAlticlelist(alticlelist, path, metadata)
    with open(alticle_count, "w") as ofh:
        ofh.write(str(alticlelist).replace("\'", "\""))
    createAlticlelistpage(alticlelist)
    return alticlelist


def updateTag(alticlelist):
    tags = {}
    for title in alticlelist.keys():
        # 记录tag
        for tag in alticlelist[title]["tag"]:
            if tag not in tags.keys():
                tags[tag] = 1
            else:
                tags[tag] += 1
        # tag排序
        tags_num = sorted(tags.values(), reverse=True)
        tags_copy = tags
        tags = {}
        for num in tags_num:
            for key in tags_copy.keys():
                if tags_copy[key] == num:
                    tags[key] = num
                    del tags_copy[key]
                    break
    return tags


def updateClass(alticlelist):
    classi = {}
    for title in alticlelist.keys():
        # 添加class
        # item大类
        classisExist = False
        for item in classi.keys():
            # 如果文章的大类已经存在
            if item in alticlelist[title]["classification"].keys():
                subitem = alticlelist[title]["classification"][item]
                classisExist = True
                # print(f"subitem:{subitem}\tclass[item]:{classi[item]}")
                # 如果文章的次class也已经有记录
                if subitem in classi[item].keys():
                    classi[item][subitem] += 1
                else:
                    # 如果文章的次class没有记录
                    classi[item][subitem] = 1
                # 如果文章的主class没有记录
        if not classisExist:
            classkey = list(alticlelist[title]["classification"].keys())[0]
            classi[classkey] = {alticlelist[title]
                                ["classification"][classkey]: 1}
    return classi


def updateAchive(alticlelist):
    achive = {}
    for title in alticlelist.keys():
        year, month, day = alticlelist[title]["date"].split("-")
        if year not in achive.keys():
            achive[year] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        achive[year][int(month)-1] += 1
    return achive


def updateDatacount(alticlelist, tools):
    with open(data_count, "r") as fh:
        filedata = fh.read()
    if filedata != "":
        site_data = eval(filedata)
    else:
        site_data = {
            "site-setuptime": "2023-03-01",
            "announce": [],
            "avatar": "https://cdn.staticaly.com/gh/DaiwuShen/daiwuImageBed@main/daiwus-龙猫.7bls3arxkmf4.gif",
            "alticles-count": 0,
            "classifications-count": 0,
            "tags-count": 0,
            "tags": {},
            "classification": {},
            "achive": {},
            "tools": {}}
    site_data["alticles-count"] = len(alticlelist)
    alticle_count = {}
    for title in alticlelist.keys():
        alticle_count[title] = alticlelist[title]["date"]
    classi = updateClass(alticlelist)
    tags = updateTag(alticlelist)
    achive = updateAchive(alticlelist)
    site_data["alticles"] = alticle_count
    site_data["classifications-count"] = len(classi)
    site_data["tags-count"] = len(tags)
    # strftime返回一个元组
    site_data["last-update"], = datetime.date.today().strftime(date_format),
    site_data["classification"] = classi
    site_data["tags"] = tags
    site_data["achive"] = achive
    site_data["tools"] = tools
    with open(data_count, "w") as ofh:
        ofh.write(str(site_data).replace("\'", "\""))
    return site_data


def getToolmetadata():
    toollist = [toolDir+i for i in os.listdir(toolDir)]
    tools = {}
    for path in toollist:
        with open(path, "r") as fin:
            filedata = fin.read()
        description = TOOLdata_re.findall(filedata, re.M)[0][:-2]
        metadata_list = re.sub(
            r"<meta[\x20\s\n\r]*name=\"description\"[\x20\s\n\r]*content=\"", "", description).split(";")
        metadata = {}
        metadata["image"] = default_img
        for line in metadata_list:
            [key, value] = line.split(": ")
            metadata[key] = value
        tools[metadata["name"]] = metadata
    return tools


def updateTools(toollist):
    tools = {}
    for name in toollist.keys():
        tools[name] = {}
        tools[name]["version"] = toollist[name]["version"]
        tools[name]["description"] = toollist[name]["description"]
    return tools


def updateToolcount():
    toollist = getToolmetadata()
    with open(tool_count, "w") as fout:
        fout.write(str(toollist).replace("\'", "\""))
    return toollist


def siteMap(sitedata: dict):
    for name in sitedata["alticles"].keys():
        siteurls.append(
            "http://informatrix.space/alticle-list/"+name+".html")
        siteurls.append("https://informatrix.space/alticle-list/"+name+".html")
        siteurls.append(
            "https://www.informatrix.space/alticle-list/"+name+".html")
    for name in sitedata["tools"].keys():
        siteurls.append("http://informatrix.space/tool/"+name+".html")
        siteurls.append("https://informatrix.space/tool/"+name+".html")
        siteurls.append("https://www.informatrix.space/tool/"+name+".html")
    with open(sitemap, "w") as fout:
        for url in siteurls:
            fout.write(url+"\n")


if __name__ == "__main__":
    alticlelist = updateAlticlecount()
    toollist = updateToolcount()
    sitedata = updateDatacount(alticlelist=alticlelist, tools=toollist)
    siteMap(sitedata)
