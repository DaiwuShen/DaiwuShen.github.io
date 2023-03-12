![informatrixspace-informatrix-7](https://cdn.staticaly.com/gh/DaiwuShen/daiwuImageBed@main/webP/informatrixspace-informatrix-7.6sblxdx8qhkw.webp)

# [C++]狗屁不通文章生成器

> author: DaiwuShen
> date: 2023-03-12
> class: 计算机 . C++
> tag: C++, 文件流, 变长数组

## 1 概况

由用户输入启动词，根据语料库中统计的词语前后缀关系，自动生成一片新的文章。
比如：*春天来了，大地妈妈穿上了碧绿的衣裳。嫩绿的小草从地下探出头来，陶醉在美丽的春天里。*

前后缀关系：[前缀，后缀]。上面这段话的前后缀关系有：[春天，来/里]，[天来，了]，[天里，。]，[来了，，]等。
==说明：==
1. **启动词：**用户输入的一个词，由这个词开始生成文章所有内容。
2. **前/后缀：**一个词前后连续的n个字符。比如前缀为“春天”，由例句中得到后缀可为“来”或“里”，即表示一种==语言的前后关系==。

---
## 2 基本要求
1. **准备语料库：**准备相关文章，存为文件。利用程序读取文章内容，获取文章语句中词语的前后关系，即语料库。==语料库的丰富程度由文章的数量决定==，==语料库又决定程序运行的时间和生成的文章质量==。
2. **构建前后缀关系：**根据语料库，依据设定的前后缀长度，构建字词的前后缀关系。
3. **生成文章：**用户输入启动词，根据==启动词为前缀生成后缀==得到文段，再根据文段生成新的前缀，以新前缀生成新后缀以此类推，得到一片文章。
4. **应尽量避免循环：**有时语料库中可能出现类似“为所欲为”的接龙结构，造成死循环，同时生成的内容也没有了意义。
5. **输入输出形式：**
```cpp
//输入：
	2	//前缀词长度
	2	//后缀词长度
	春天	//启动词
//输出：
	[一篇文章]
```

---
## 3 程序分析
### 3.1 文件流读写
1. **读文件：**从多篇文章中读取文件内容为字符串，以前/后缀的长度遍历获取前/后缀，并建立前后缀关系。
2. **写文件：**为观察程序执行情况，将前/后缀字符对和生成的文章写入文件。
### 3.2 建立前后缀关系
当需要在两种数据间建立一种关系时，可以使用结构化数据进行存储，比如建立前后缀关系可以采用字典类结构进行存储，C++也有相应的头文件。
除此之外，还可以将其抽象为一种类，可以定制类的行为和结构。这里选择自建一个类进行存储。
类设计：
1. 一个类记录一个前缀和它的所有后缀，
2. 记录后缀的出现次数
3. 记录后缀的个数
```cpp
class wordpair{
	private:
		char **suffix	//后缀字符串数组，一个后缀存为一个字符串
		int *freq		//一个后缀出现的次数
	public:
		char *prefix	//前缀字符串，声明为公共成员，方便外部查找
		int length		//记录后缀的个数
}
```
### 3.3 字符串切片
在C++的头文件<string>中，可以使用string类型代替char类型的字符串，而且对于字符串的操作也更方便。比如
```cpp
string str1 = "abcd";
string str2 = "efghijk";
string str3 = str1 + str2;	// = “abcdefghijk”; 字符串拼接
string str4 = str3.substr(3,2);	// = "de"; 从下标为3的字符开始，截取长度为2的子字符串
```
以前一直觉得C语言和C++处理字符串很麻烦，现在倒觉得还是很方便的。
### 3.4 变长数组
C语言和C++中，基础的数组长度相对固定，但也不是不能改变，只是相对麻烦一些。在这个程序中，一个wordpair只存储一个前缀和它的后缀们，所以需要创建一个wordpair类型的列表来存储全部的前后缀。
我用的方法是来回地复制

```cpp
int main(){
	int len;
	int list[len];	//假设有一个长度为len的整型数组
	int p[len+1];	//开辟一个len+1个整型长度的空间
	//	把 list 复制到 p，然后
	list = new int[len+1];	//将list长度+1
    //把 p 复制过来
}
```

---
## 4 代码实现
### 4.1 函数：数组加长
由于数组加长在程序中多次调用，且需要增长的数组各不相同，所以在这里我定义了一个函数模板，以尽可能少的代码完成相同的任务。

```cpp
template<class T>
T *append2list(T *list, T t, int len){
	T copy[len + 1];			// 用于备份的空间
	for(int i=0; i<len; i++){
		copy[i] = list[i];}
	copy[len] = t;				//在末尾增加元素
	len++;
	list = new T[len];			//变长
	for(int i=0; i<len; i++){	//拷贝回来
		list[i] = copy[i];}
	return list;
}
```

### 4.2 类wordpair定义

首先是类成员，应该有：

```cpp
class Wordpair
{
	private:
		string *suffix;	//后缀列表，一个前缀可能对应多个后缀 
		int   *freq;	// 整型数组，依此记录后缀的频率
	public:
		string prefix;	// 前缀 
		int length;		// 记录长度 , 一个前缀对应size个后缀 
		Wordpair(string prefix, string suffix){	//构造函数
			this->prefix = prefix;
			this->suffix = new string[1];
			this->suffix[0] = suffix;
			this->freq = new int[1];
			this->freq[0] = 1;
			this->length = 1;
		}
		Wordpair(){								//构造函数
			this->prefix = "",
			this->suffix = new string[1];
			this->suffix[0] = "";
			this->freq = new int[1];
			this->freq[0] = 0;
			this->length = 0;
		}
		/* 判断这个后缀是否已经有记录，有返回下标，没有则返回-1 */
		int hasRecorded(string word){}
		
		/* 添加一个后缀 */
		bool push(string word){}
		
		/* 找出出现次数最多的后缀的下标，采用更可信的后缀 */
		 string maxFrequency(){}
		
		/* 转化为字符串，方便输出 */
		string to_String()const{}
		/* 重载赋值运算符，方便与其他类型的列表共用函数 */
		Wordpair& operator=(Wordpair &pair){}
};

```

除此之外，还可以重载输出运算符<<，便于调试时在函数中输出wordpair值：

```cpp
ostream& operator<<(ostream& out, const Wordpair& w){
	out<<w.to_String();
	return out;
}
```

### 4.3 函数：读取文件

程序运行时，需要读取文件为字符串，当文件较多时把这个功能抽象出来，调用很方便。

```cpp
// 读文件 
string getfile(char *path){
  string alticle = "";			//初始化字符串
  ifstream fin(path, ios::in);	//打开文件
  if(!fin.is_open()){
    cout<<"文件读取错误！"<<endl;
    return NULL;
  }
  string buffer;
  while(getline(fin,buffer)){		//读取
    alticle.append(buffer);			//新的行添加到alticle尾部
  }
  fin.close();
  return alticle;
}
```

### 4.4 函数：写入文件

主要是写入生成的字符对，方便调试

```cpp
// 写文件，记录词组对 
void exportData(Wordpair *pairlist, int len, int prelen, int suflen){
	char path[32];
	sprintf(path,"./word-pairs(%dx%d).txt",prelen,suflen);
	ofstream fout(path, ios::out);
	for(int i=0; i<len; i++){
		fout<<pairlist[i];		//在这里就体现了重载<<运算符的好处
	}
	fout.close();
	cout<<"词组对已经写入文件< "<<path<<" >"<<endl; 
}
```

### 4.5 核心函数：字符串分割

读取到文件后，将字符串从下标0开始，读取前缀+后缀的长度，然后从1开始读取前缀+后缀的长度。==循环的次数应该是字符串总长度 - （前缀长度 + 后缀长度 -1）==，以保证下标不会溢出。

```cpp
Wordpair *alticle2Wordpair(Wordpair *pairlist, int &length,string alticle, int prefix_len, int suffix_len){
	for(int i=0; i<alticle.length()/2-prefix_len-suffix_len+1; i++){
		bool hasrecord = false;
		string prefix=alticle.substr(i*2,prefix_len*2);				// i为什么要×2？因为在devcpp中发现一个中文字符相当于两个英文字符，不乘2会乱码。 
		string suffix=alticle.substr((i+prefix_len)*2,suffix_len*2);
		for(int j=0;j<length;j++){
			if(pairlist[j].prefix == prefix){	// 如果已经有了这个前缀，则添加后缀 
				pairlist[j].push(suffix);
				hasrecord = true;
				break;
			}
		}
		if(!hasrecord){							//	没有这个前缀则词组对列表长度增加 
			Wordpair pair(prefix, suffix);
			pairlist = append2list(pairlist, pair, length);
			length++;
		}
	}
	return pairlist;
}
```

在此基础上，对每次读文件都进行一次，就能获取全部文件的字符对。

### 4.6 核心函数：文章拼接

得到语料库之后，需要根据语料库拼接出文章。我这里采用的方法有点问题，当完全防止出现循环文本的时候，文章过短，当放开一点对循环文本的时候，循环文本总是出现，算法上想不通。希望有大佬提供一点思路。

```cpp
// 判断前缀是否在列表内，有则返回下标，没有则返回-1
int hasrecord(Wordpair *pairlist, int len, string preword){
	for(int i=0; i<len; i++){
		if(preword == pairlist[i].prefix){
			return i;
		}
	}
	return -1;
}
// 拼接文章 
void createAlticle(Wordpair *pairlist, int len, string startword, int prefix_len, int suffix_len){
	string preword = startword;
	int i=0;
	int index = hasrecord(pairlist, len, preword);
	string alticle = preword;
	int alticle_len = prefix_len;			//长度（中文字符标准） 
	while(index != -1){
		string newword = pairlist[index].maxFrequency();
		// 避免循环 
		if(alticle.find(newword)==string::npos	//表示这个前缀没有在文章中出现过 
//		 || alticle_len - alticle.rfind(newword) > 600	//表示相同的词之间最少间隔多少。加上这个条件后有循环，注释后文章显著变短 
		 ){
			alticle.append(pairlist[index].maxFrequency());
			alticle_len += suffix_len;
			preword = alticle.substr((alticle_len-prefix_len)*2, alticle_len*2);}
		else{
			preword = pairlist[index+1].maxFrequency();
		}
		index = hasrecord(pairlist, len, preword);
	}
	cout<<alticle<<endl;
	ofstream fout(CREATE_ALTICLE, ios::out);
	fout<<alticle;
	fout.close();
	cout<<"文章写入文件 < "<<CREATE_ALTICLE<<" >"<<endl;
}
```

## 5 总结

在没有机器学习的支持下，这种拼接的文章十分粗糙，无法准确的给出最优的选择。另一方面，代码写的过于拖沓，算法有待优化。

