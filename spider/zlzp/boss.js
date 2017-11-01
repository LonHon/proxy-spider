"use strict";
var http = require('http')
var cheerio = require('cheerio')
var request = require('request')
var fs = require('fs')
var Promist = require('bluebird')


//代理池
var ipacc = 0;
var iplist = require('../ip_http.json')


var result = [];
function creatfile(obj) {
    return new Promise(function (resolve, reject) {
        var txt = obj[0].position + '---' + obj[0].companyName + '\r\n';

        obj.forEach(function (item) {
            txt += item.position + ',l,' + item.salary + ',l,' + item.companyName + ',l,' + item.zptime + ',l,' + item.edu[0] + ',l,' + item.edu[1] + ',l,' + item.edu[2] + '\r\n';
        });
        fs.appendFile('./' + 'boss.txt', txt, 'utf-8', function (err) {
            if (!err) {
                resolve()
            }
        })


    })
}

//提取数据
var filterHtml = function (html) {
    var $ = cheerio.load(html);
    $('.job-list li').each(function (item) {
        var position = $(this).find('.info-primary').find('a').eq(0).contents().filter(function () {
            return this.nodeType == 3; //不取后代本文
        }).text().replace(/ /g,'');
        var salary = $(this).find('.info-primary').find('a').eq(0).find('.red').text().replace(/K/g, '000');
        var theedu = []
        $(this).find('.info-primary').find('p').eq(0).contents().filter(function () {
            if (this.data) {
                theedu.push(this.data);
            }
            return this.nodeType == 3; //不取后代本文
        });
        var companyName = $(this).find('.info-company').find('.name').text();
        var comPerson = $(this).find('.info-company').find('p').text();
        var zptime = $(this).find('.time').text().replace('发布于', '');
        var label = '';
        $(this).find('.job-tags').find('span').each(function (itemm) {
            label += $(this).text() + ',';
        })
        var hr = $(this).find('.job-tags').find('p').text();
        result.push({
            position,
            salary,
            companyName,
            comPerson,
            label,
            edu: theedu,
            zptime,
        })
    })
    creatfile(result);
}




//发送请求，成功写入文件，失败换代理
var getHtml = function (url) {
    return new Promise(function(resolve,reject){
        if (ipacc >= iplist.length) {
            console.log('ip all failed');
            reject(false)
        }

    })
    //设置代理
    let prox = {
        url: url,
        proxy: 'http://' + iplist[ipacc],
        timeout: 5000,
    }
    request(prox, function (err, res, body) {
        if (err) {
            ipacc++;
            console.log('---' + ipacc);
            getHtml(url);
        } else {
            ipacc = 0;
            console.log('doing:page-' + mark);
            filterHtml(body);
        }
    })
}

var urlMoudle = 'http://www.zhipin.com/c101270100/d_203/?query=%E4%BA%92%E8%81%94%E7%BD%91&page='


var mark = 15
var realUrl = urlMoudle + mark + '&ka=page-' + mark;
getHtml(realUrl);