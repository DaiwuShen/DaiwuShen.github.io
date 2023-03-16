import os
import re
import uuid
import datetime


default_img = "https://cdn.staticaly.com/gh/DaiwuShen/daiwuImageBed@main/webP/informatrixspace-informatrix-16.27y0r3eip9mo.webp"
data_count = "static/data/json/data_count.json"
alticle_count = "static/data/json/alticle_count.json"
tool_count = "static/data/json/tools_count.json"
markdownDir = "static/data/markdown/"
htmlDir = "static/data/html/"
toolDir = "static/tool/"
MDdata_re = re.compile(">\x20.+:\x20.*")
HTMLdata_re = re.compile("\"author\:.+\"")
TOOLdata_re = re.compile("<!--(.|\n|\r)*-->")
key_re = re.compile("[^\>]+")
img_re = re.compile("\(.+[^\)]")
alticlelist = {}
date_format = "%Y-%m-%d"


def getMetadata(path):
    """ 获取文章元数据 """
    metadata = {}
    with open(path, "r", encoding="utf8") as fh:
        filedata = fh.read()
        # 如果是md文件
        if path.split(".")[1] == "md":
            metadata_list = [i.replace(" ", "")
                             for i in MDdata_re.findall(filedata)[:4]]
            metadata["image"] = img_re.findall(filedata.split("\n")[0])[0].replace("(", "").replace(
                ")", "") if img_re.findall(filedata.split("\n")[0]) != None else default_img
        # 如果是html文件
        elif path.split(".")[1] == "html":
            metadata_list = HTMLdata_re.findall(filedata.split("\n")[0])[
                0].replace("\"", "").split("|")
        else:
            print(f"文件{path}既不是markdown也不是html.")
            return False
    for line in metadata_list:
        metadata[key_re.findall(line.split(":")[0])[0]] = line.split(":")[1]
    metadata["classification"] = {metadata["classification"].split(
        ".")[0]: metadata["classification"].split(".")[1]}
    metadata["tag"] = metadata["tag"].split(",")
    if metadata["image"] == "":
        metadata["image"] = default_img
    metadata["path"] = path
    return metadata


def updateAlticlelist(alticlelist, path, metadata):
    """ 更新文章信息列表 """
    if path not in [alticlelist[i]["path"] for i in alticlelist.keys()]:
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
        alticlelist = {**alticlelist_newer, **
                       {str(uuid.uuid4()): metadata}, **alticlelist_older}
    else:
        for alticle in alticlelist.keys():
            if alticlelist[alticle]["path"] == path:
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
    for path in [markdownDir+i for i in os.listdir(markdownDir)] + [htmlDir+i for i in os.listdir(htmlDir)]:
        metadata = getMetadata(path)
        alticlelist = updateAlticlelist(alticlelist, path, metadata)
    with open(alticle_count, "w") as ofh:
        ofh.write(str(alticlelist).replace("\'", "\""))
    return alticlelist


def updateTag(alticlelist):
    tags = {}
    for uid in alticlelist.keys():
        # 记录tag
        for tag in alticlelist[uid]["tag"]:
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
    for uid in alticlelist.keys():
        # 添加class
        # item大类
        classisExist = False
        for item in classi.keys():
            # 如果文章的大类已经存在
            if item in alticlelist[uid]["classification"].keys():
                subitem = alticlelist[uid]["classification"][item]
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
            classkey = list(alticlelist[uid]["classification"].keys())[0]
            classi[classkey] = {alticlelist[uid]
                                ["classification"][classkey]: 1}
    return classi


def updateAchive(alticlelist):
    achive = {}
    for uid in alticlelist.keys():
        year, month, day = alticlelist[uid]["date"].split("-")
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
    classi = updateClass(alticlelist)
    tags = updateTag(alticlelist)
    achive = updateAchive(alticlelist)
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


def getToolmetadata():
    toollist = [toolDir+i for i in os.listdir(toolDir)]
    tools = {}
    for path in toollist:
        with open(path, "r") as fin:
            filedata = fin.read()
        metadata_list = TOOLdata_re.match(filedata)[0].split("\n")[1:-1]
        metadata = {}
        metadata["image"] = default_img
        for line in metadata_list:
            key, value = line.replace(" ", "").split(":")
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


if __name__ == "__main__":
    alticlelist = updateAlticlecount()
    toollist = updateToolcount()
    updateDatacount(alticlelist=alticlelist, tools=toollist)
