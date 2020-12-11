## 简介

> 利用百度接口将lang/zh.js翻译成多语言(例如en.js，jp.js等)。需自己准备百度翻译的key与appid
> 翻译完毕后会将本次翻译内容保存至zh_old.js中，防止翻译内容更新后重复翻译

## 如何使用


1. 申请一个调用百度翻译api的key

详情请看文档 [https://fanyi-api.baidu.com/doc/11](https://fanyi-api.baidu.com/doc/11)

2. 准备待翻译的zh.js.顺带一提，项目使用的是vue-i18n，所以导出的是一个对象

``` javascript
module.exports = {
  test1: "首页",
  test2: ["首页", "首页"],
  test3: {
    a: ["首页", "首页"],
    b: "首页",
  },
};
```

3. 配置app.js中的一些参数

``` javascript
// 百度翻译的key
const KEY = "xxxxx"
// 百度翻译的app_id
const APP_ID = "xxxxx"

// 待翻译的语言列表
// 支持的语言列表  https://fanyi-api.baidu.com/doc/21
var langList = [
  "en",
  // "jp",
];
```

4. 安装类库并执行app.js文件

``` bash
npm install

node app.js
```

最后可以在lang文件夹下看到生成的js文件