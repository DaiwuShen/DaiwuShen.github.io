---
title: "[C++]狗屁不通文章生成器2.0"
date: 2024-03-22T03:00:00+08:00
lastmod: 2026-05-04T21:17:00+08:00
tags: ["C++", "文章生成器", "随机算法"]
categories: ["计算机","Cpp"]
description: "狗屁不通文章生成器2.0版本，改进了模块化设计、中文乱码处理，采用随机数策略从语料库中生成无意义但语法连贯的文章。"
draft: false
toc: true
math: false
---

## 1 前言

继上次[【C++】狗屁不通文章生成器](/posts/cpp-nonsense-article-generator/)之后，很久不想看一眼这个代码，因为当时写这个代码深受中文字符的处理烦恼。而且现在回看，程序的模块化、可读性使我大受震惊，实在想不到当时的我为什么要这样做。于是昨天无心工作，想到了把这堆乐色改进一下，至少做到能看的水平。遂记之。

## 2 改进

### 2.1 字词的前后关系

为了表示字词的前后关系，即将句子划分为前缀词+后缀词的关系，依然需要定义一个 class `wordpair`，这里去除一些数据上的冗余，强化了类的封闭性。

```cpp
class wordpair
{
private:
    string preword;              // 前缀
    map<string, int> sufwords;   // 后缀，次数
    int count;                   // 总次数

public:
    wordpair(string pre);
    wordpair(string pre, string suf);
    wordpair(string pre, map<string, int> suf);
    ~wordpair();
    string getPreword() const;
    map<string, int> getSufwords() const;
    void setPreword(string pre);
    void setSufwords(map<string, int> suf);
    string toJson() const;

    void addSufword(string suf);
    string chooseSufword() const;
};
```

采用 `map` 记录后缀的出现次数，数据的结构性更强，也易于查找。记录所有后缀出现的总次数是为了在生成文章时选择后缀提供方便。

### 2.2 文章生成系统

将太多的操作塞进 `main()` 函数的做法不够美观，且容易忘记各个部分的功能。于是这里将文章生成的功能抽象出来，作为一个类。主要的工作是记录所有的字词对、记录生成的、文件流操作、文章生成等逻辑。

```cpp
class createArticle
{
private:
    vector<wordpair> wordpairlist;
    string article;

public:
    createArticle();
    ~createArticle();

    void importWords(string filename, int len_pre = 1, int len_suf = 1);
    void exportWords(string filename);
    void addWordPair(string pre, string suf);
    void generateArticle(string startword, int lenout = 10000);
    void printArticle(string filename);
};
```

## 3 实现（部分）

由于大多函数都很简单，这里只贴出部分比较重要的函数。

### 3.1 class wordpair

除去构造函数、类成员输出输入等函数，我们直接进入主题。

#### 3.1.1 转化为 JSON

这个函数主要是为了输出格式化的词对，而文本文件中 json 格式的结构性且简单。

ps：其实这个函数不太重要，主要目的是检查。不过也可以为直接读词对做准备（虽然这里没有从文件导入词对的功能）

```cpp
string wordpair::toJson() const
{
    string str = "\"";
    str += this->preword + "\" : {";

    for (auto &it : this->sufwords)
    {
        str += "\"" + it.first + "\"" + ":" + to_string(it.second) + ",";
    }
    str += "}";
    return str;
}
```

#### 3.1.2 添加后缀词

添加后缀的函数，逻辑是：

- 如果这个后缀已经有记录，则 `count++`
- 否则，添加新的后缀到 map 中

```cpp
void wordpair::addSufword(string suf)
{
    for (auto &it : this->sufwords)
    {
        if (it.first == suf)
        {
            it.second++;
            return;
        }
    }
    this->sufwords[suf] = 1;
}
```

#### 3.1.3 选择后缀词

这个函数的主要功能是从众多后缀词中选取一个（语料库大的话就会多啦），选择的策略是随机数的方案，类似于**转盘抽奖**。

```cpp
string wordpair::chooseSufword() const
{
    if (this->sufwords.size() == 1)
    {
        return this->sufwords.begin()->first;
    }
    else
    {
        random_device rd;
        ranlux48 engine(rd());
        uniform_int_distribution<> dist(0, this->count);
        int random_number = dist(engine);

        string result;
        for (auto &it : this->sufwords)
        {
            if (random_number < it.second)
            {
                result = it.first;
            }
            else
                random_number -= it.second;
        }
        return result;
    }
}
```

实现思路：

1. 如果只有一个后缀词就直接输出，减少算力负担
2. 否则，生成一个 `[0, count)` 范围内的随机数
3. 遍历所有后缀词，逐个减去出现次数，直到停在某个词上（类似轮盘赌）

### 3.2 class createArticle

#### 3.2.1 文本分割

```cpp
vector<string> charlist = splitchar(filestr);
string preword = "", sufword = "";
for (int i = 0; i < charlist.size() - len_suf - len_pre; i++)
{
    preword = "", sufword = "";
    for (int j = i; j < i + len_pre + len_suf; j++)
    {
        if (j - i < len_pre)
        {
            preword += charlist[j];
        }
        else
        {
            sufword += charlist[j];
        }
    }
    this->addWordPair(preword, sufword);
}
```

每次向后移动一个字符，进行切割：
- 从第 `i` 个字符开始，到第 `i + len_pre` 个字符连接起来作为**前缀**
- 从第 `i + len_pre` 个字符开始，到第 `i + len_pre + len_suf` 个字符连接作为**后缀**

#### 3.2.2 生成文章

```cpp
void createArticle::generateArticle(string startword, int lenout)
{
    this->article += startword;
    bool stop;
    int prewordlen = this->wordpairlist.front().getPreword().length();
    int sufwordlen = this->wordpairlist.front().getSufwords().begin()->first.length();
    string lastword;

    for (int i = 0; i < lenout; ++i)
    {
        stop = true;
        if (this->article.length() >= prewordlen)
        {
            lastword = this->article.substr(this->article.length() - prewordlen, prewordlen);
            for (auto &it : this->wordpairlist)
            {
                if (it.getPreword() == lastword)
                {
                    this->article += it.chooseSufword();
                    stop = false;
                    break;
                }
            }
            if (stop)
                break;
        }
        else
        {
            lastword = this->article;
            for (auto &it : this->wordpairlist)
            {
                int position = it.getPreword().find(lastword);
                if (position != string::npos)
                {
                    this->article += (it.getPreword() + it.chooseSufword()).substr(
                        position + lastword.length(), sufwordlen);
                    stop = false;
                    break;
                }
            }
            if (stop)
                break;
        }
    }
}
```

参数说明：

- `startword`——启动词
- `lenout`——长度限制（避免无限循环）

**匹配策略：**

- 如果文章长度 ≥ 前缀长度：取文章末尾最后 `len_pre` 个字符作为前缀，遍历词对列表匹配
- 如果启动词长度小于词对前缀（例如词对分割为 3+2 时启动词只给 2 个字）：在词对的前缀中查找包含启动词的词对，找到后拼接并截取

当遍历完整个词对列表仍无法匹配时，停止生成。

## 4 演示

### 4.1 wordpair(3×2)，启动词「春天」

![使用 3 字前缀 + 2 字后缀划分语料，启动词为「春天」](https://i-blog.csdnimg.cn/blog_migrate/9c6404598bab2d6301d4cff2e3893c29.png)

### 4.2 wordpair(2×1)，启动词「春天」

![使用 2 字前缀 + 1 字后缀划分，粒度更细。](https://i-blog.csdnimg.cn/blog_migrate/a1d8f576ae4d8067bbe6a89daf796c3f.png)

### 4.3 wordpair(2×2)，启动词「春天」

![使用 2 字前缀 + 2 字后缀，兼顾单词与短语的连贯性。](https://i-blog.csdnimg.cn/blog_migrate/af1f2283ca74eb5316e663fc7278ef31.png)

## 5 总结

目前，这个版本的处理方法不会出现中文乱码，即使是中英文混合字符串也能正确读取和分割。而且拼接时采用的随机数策略，在语料库足够大的情况下可以有较好的灵活性。但是仍然无法产出具备可读性的文章。
