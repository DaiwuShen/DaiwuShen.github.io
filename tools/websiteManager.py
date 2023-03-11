import os
import re
import uuid
import datetime
import time


default_img = "https://cdn.staticaly.com/gh/DaiwuShen/daiwuImageBed@main/daiwus-logo.6d00ht13f0n4.png"
data_count = "static/data/json/data_count.json"
alticle_count = "static/data/json/alticle_count.json"
markdownDir = "static/data/markdown/"
htmlDir = "static/data/html/" 
MDdata_re = re.compile(">\x20.+:\x20.*")
HTMLdata_re = re.compile("\"author\:.+\"")
key_re = re.compile("[^\>]+")
img_re = re.compile("https?:\/\/.+[^\)]")
alticlelist = {}
date_format = "%Y-%m-%d"

with open(alticle_count, "r", encoding="utf8") as fh:
    filedata = fh.read()
    if(filedata != ""):
        alticlelist = eval(filedata)

# 获取文章元数据
def getMetadata(path):
    metadata = {}
    with open(path, "r", encoding="utf8") as fh:
        filedata = fh.read()
        # 如果是md文件
        if path.split(".")[1] == "md":
            metadata_list = [i.replace(" ", "") for i in MDdata_re.findall(filedata)[:4]]
            metadata["image"] = img_re.findall(filedata.split("\n")[0])[0] if img_re.findall(filedata.split("\n")[0])!=None else default_img
        # 如果是html文件
        elif path.split(".")[1] == "html":
            metadata_list = HTMLdata_re.findall(filedata.split("\n")[0])[0].replace("\"", "").split("|")
        else:
            print(f"文件{path}既不是markdown也不是html.")
            return False
    for line in metadata_list:
        metadata[key_re.findall(line.split(":")[0])[0]] = line.split(":")[1]
    metadata["classification"] = { metadata["classification"].split(".")[0] : metadata["classification"].split(".")[1] }
    metadata["tag"] = metadata["tag"].split(",")
    if metadata["image"] == "":
        metadata["image"] = default_img
    metadata["path"] = path
    return metadata

# 更新文章信息列表
def updateAlticlelist(alticlelist, path):
    if path not in [alticlelist[i]["path"] for i in alticlelist.keys()]:
        # 如果是新的文章，需要通过比较时间来将决定文章插入的位置
        alticlelist_newer = {}#存储比新文章更新的文章
        alticlelist_older = {}# 存储更旧的
        for key in alticlelist.keys():
            # 如果时间更新，则拷贝到newer
            if datetime.datetime.strptime(alticlelist[key]["date"], date_format) > datetime.datetime.strptime(metadata["date"],date_format):
                alticlelist_newer[key] = alticlelist[key]
            else:
                # 否则存储到older
                alticlelist_older[key] = alticlelist[key]
        alticlelist = {**alticlelist_newer,**{str(uuid.uuid4()):metadata},**alticlelist_older}
    else:
        for alticle in alticlelist.keys():
            if alticlelist[alticle]["path"] == path:
                for key in alticlelist[alticle].keys():
                    if alticlelist[alticle][key] != metadata[key]:
                        alticlelist[alticle][key] = metadata[key]
    return alticlelist


for path in [markdownDir+i for i in os.listdir(markdownDir)] + [htmlDir+i for i in os.listdir(htmlDir)]:
    metadata = getMetadata(path)
    alticlelist = updateAlticlelist(alticlelist, path)
    

with open(alticle_count, "w") as ofh:
    ofh.write(str(alticlelist).replace("\'", "\""))


with open(data_count, "r") as fh:
    filedata = fh.read()
    if filedata != "":
           site_data = eval(filedata)
    else:
        site_data = {
            "site-setuptime":"2023-03-01",
            "announce":[],
            "avatar" : "https://cdn.staticaly.com/gh/DaiwuShen/daiwuImageBed@main/daiwus-龙猫.7bls3arxkmf4.gif",
            "alticles-count":0,
            "classifications-count":0,
            "tags-count":0,
            "tags" : {},
            "classification": {},
            "achive": {}}

# tags = site_data["tags"]
# classi = site_data["classification"]
# achive = site_data["achive"]

tags = {}
classi = {}
achive = {}

for uid in alticlelist.keys():
    # 记录tag
    for tag in alticlelist[uid]["tag"]:
        if tag not in tags.keys():
            tags[tag] = 1
        else:
            tags[tag] += 1
    # tag排序
    tags_num = sorted(tags.values(), reverse = True)
    tags_copy = tags
    tags = {}
    for num in tags_num:
        for key in tags_copy.keys():
            if tags_copy[key] == num:
                tags[key] = num
                del tags_copy[key]
                break
            
    # 添加class
    # item大类
    classisExist = False
    for item in classi.keys():
        # 如果文章的大类已经存在
        if item in alticlelist[uid]["classification"].keys():
            subitem = alticlelist[uid]["classification"][item]
            classisExist = True
            # print(f"subitem:{subitem}\tclass[item]:{classi[item]}")
    #         # 如果文章的次class也已经有记录
            if subitem in classi[item].keys():
                classi[item][subitem] += 1
            else:
        #         # 如果文章的次class没有记录
                classi[item][subitem] = 1
        #     # 如果文章的主class没有记录
    if not classisExist:
        classkey = list(alticlelist[uid]["classification"].keys())[0]
        classi[classkey] = {alticlelist[uid]["classification"][classkey] : 1}
    # 归档
    year, month, day = alticlelist[uid]["date"].split("-")
    if year not in achive.keys():
        achive[year] = [0,0,0,0,0,0,0,0,0,0,0,0]
    achive[year][int(month)-1] += 1;

site_data["alticles-count"] = len(alticlelist)
site_data["classifications-count"] = len(classi)
site_data["tags-count"] = len(tags)
site_data["last-upate"], = datetime.date.today().strftime(date_format), # strftime返回一个元组
site_data["classification"] = classi
site_data["tags"] = tags
site_data["achive"] = achive

with open(data_count, "w") as ofh:
    ofh.write(str(site_data).replace("\'", "\""))

