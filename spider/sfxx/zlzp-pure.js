"use strict";
var target = 'http://shenfenzheng.293.net/?_t_t_t=0.0596391458529979';

var http = require('http')
var fs = require('fs')
const superagent = require('superagent');
var cheerio = require('cheerio')
var request = require('request')
var Promise = require('bluebird')//虽然原生已经支持，但bluebird效率更高
var iplist = require('../ip_http.json') //代理池

let options = {
    'Host': 'shenfenzheng.293.net',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': 1,
    'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
    'Content-Type': 'application/x-www-form-urlencoded',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Encoding': 'gzip, deflate',
    'Accept-Language': 'zh-CN,zh;q=0.8',    
};

function filterHtml(html,source){    
    var $ = cheerio.load(html);
    console.log(html);
    var addr = $('#show_table').text();
    console.log(addr)
}
function get(url){
    superagent
        .post(url)
        .send({
            'id':'511522199405023276',
            'submits':'身份证查询'
        })
        .set(options)
        // 请求成功处理接收数据
        .end((err, res) => {
            if (err){
                return console.log(err);
            };
            filterHtml(res,0);            
        });
}

get(target)