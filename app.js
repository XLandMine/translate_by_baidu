const fs = require("fs");
const MD5 = require("js-md5");
const axios = require("axios");

var zh = require("./lang/zh.js");
var old = require("./lang/zh_old.js");

// 百度翻译的key
const KEY = ""
// 百度翻译的app_id
const APP_ID = ""

// 待翻译的语言列表
// 支持的语言列表  https://fanyi-api.baidu.com/doc/21
var langList = [
  "en",
  // "jp",
];
main(langList);

async function main(langList) {
  for (var i = 0; i < langList.length; i++) {
    // var zhData = require("./lang/zh");
    let to = langList[i];
    let temp = JSON.parse(JSON.stringify(zh));
    let translateObj = await translate(temp, to, old);
    let filename = `./lang/${to}.js`;
    isFileExisted(filename)
      .then(() => {
        let langObj = require(filename);
        // 合并新旧数据
        deepMerge(langObj, translateObj);

        // 保存合并完毕的数据
        saveJs(`${to}.js`, langObj);
      })
      .catch(() => {
        // 保存翻译好的文字
        saveJs(`${to}.js`, translateObj);
      });
  }
  // 保存本次翻译内容
  saveJs("zh_old.js", zh);
}

async function translate(data, to, dataOld) {
  for (let k in data) {
    // 翻译过的不再翻译
    if (data[k] == dataOld[k]) {
      delete data[k];
      break;
    }
    if (typeof data[k] == "string") {
      console.log("正在翻译:" + data[k]);
      try {
        var from = await ajax(data[k], to);
        // 打印日志
        // console.log(data[k], " 翻译成 ", from);
        data[k] = from;
      } catch (e) {
        console.log(e);
        console.log(`翻译${to}失败=====${data[k]}`);
      }
    } else {
      if (!dataOld[k]) copyType(data, dataOld, k);
      await translate(data[k], to, dataOld[k]);
    }
  }
  return data;
}

async function ajax(q, to) {
  var salt = new Date() * 1;
  q = q.replace(/\n\s*/g, " ");
  var str = APP_ID + q + salt + KEY;
  var sign = MD5(str);
  // 1秒只能调用一次
  res = await sleep(async () => {
    return axios({
      url: "http://api.fanyi.baidu.com/api/trans/vip/translate",
      method: "get",
      // dataType: "jsonp",
      params: {
        q: q,
        appid: APP_ID,
        salt: salt,
        from: "zh",
        to: to,
        sign: sign,
      },
    });
  });
  // console.log(res)
  return res.data.trans_result[0].dst;
}

// 延迟一定时间
async function sleep(fn, time) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(fn()), time || 1200);
  });
}

// 同步o1和o2的类型
function copyType(o1, o2, key) {
  if (o1[key] instanceof Array) {
    o2[key] = [];
  } else {
    o2[key] = {};
  }
}

// 保存js
function saveJs(filename, data) {
  var str = "module.exports = " + JSON.stringify(data);
  fs.writeFile(`./lang/${filename}`, str, function (err) {
    if (err) {
      throw err;
    }
    console.log(
      `\n ===================${filename} save success.==========================\n`
    );
  });
}

// 合并两个对象
function deepMerge(obj1, obj2) {
  let key;
  for (key in obj2) {
    obj1[key] =
      obj1[key] && obj1[key].toString() === "[object Object]"
        ? this.deepMerge(obj1[key], obj2[key])
        : (obj1[key] = obj2[key]);
  }
  return obj1;
}

// 判断文件是否存在
function isFileExisted(filename) {
  return new Promise(function (resolve, reject) {
    fs.access(filename, (err) => {
      if (err) {
        reject(err.message);
      } else {
        resolve();
      }
    });
  });
}
