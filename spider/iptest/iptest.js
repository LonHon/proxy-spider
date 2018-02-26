"use strict";
var http = require('http')
var cheerio = require('cheerio')
var request = require('request')

var url = 'http://www.ipip.net/ip/ajax/';

//发送请求，成功写入文件，失败换代理
var getHtml = function (url) {
    console.log(url)
    return new Promise(function (resolve, reject) {
        let prox = {    //设置代理
            url: url,
            methods: 'POST',
            proxy: 'http://202.91.87.129:8080',
            timeout: 8000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36'
            },
            body: JSON.stringify({
                'type':'taobao',
                'ip': '122.10.64.216'
            })
        };
        request(prox, function (err, res, body) {
            if (err) {
                console.log(err)
                reject(err)//失败，回传当前请求的页面url
            } else {
                console.log('down')
                resolve(body)//成功回传html和url
            }
        })
    })
}
//解析doc
function filterHtml(html) {
    //let res = [];//存放结果集
    //var $ = cheerio.load(html);
    console.log(html);

}
//请求封装为promise
function lhlh(url) {
    getHtml(url).then((html) => {
        filterHtml(html);
    })
        .catch((url) => {
            //lhlh(url);
        })
}
lhlh(url);