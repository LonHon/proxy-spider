
"use strict";
var http = require('http')
var fs = require('fs')
const superagent = require('superagent');

var iplist = require('../ip_https.json') //代理池

var ourl = 'https://www.lagou.com/jobs/positionAjax.json?px=new&city=%E6%88%90%E9%83%BD&needAddtionalResult=false&isSchoolJob=0'

let options = {
    'Host': 'www.lagou.com',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': 1,
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate,sdch, br',
    'Accept-Language': 'zh-CN,zh;q=0.8',    
    'Cookie':'JSESSIONID=ABAAABAAAGGABCB839F52598471D1C01A9E7F58CDDE20B4; user_trace_token=20170911215023-288bac00-96f8-11e7-8f54-525400f775ce; LGUID=20170911215023-288bb265-96f8-11e7-8f54-525400f775ce; X_HTTP_TOKEN=570bf82e3037eacff00ec8e8f736e55b; showExpriedIndex=1; showExpriedCompanyHome=1; showExpriedMyPublish=1; hasDeliver=36; _putrc=0724A0F8D2DB987C; login=true; unick=%E9%BE%99%E6%B4%AA; TG-TRACK-CODE=search_code; _gid=GA1.2.1252298881.1505137836; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1505137836; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1505141880; _ga=GA1.2.1358094728.1505137836; LGRID=20170911225746-92a0b60f-9701-11e7-8f76-525400f775ce; SEARCH_ID=89c9d4657a5b4400a559cf60006f8707; index_location_city=%E6%88%90%E9%83%BD'
};

var mark = 0;
get(ourl,mark)
function get(url,mm){
    superagent
        .post(url)
        .send({
            'pn': 2,
            'kd': 'web前端',
            'first': true
        })
        .set(options)
        // 请求成功处理接收数据
        .end((err, res) => {
            if (err) throw err;
            console.log(JSON.stringify(res));            
        });
}