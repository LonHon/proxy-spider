/*
 * @Author: Lonhon 
 * @Date: 2017-09-10 01:37:15 
 * @Last Modified by: github/Lonhon
 * @Last Modified time: 2017-09-10 01:37:53
 * 使用回调爬取，每次需要单独设置需要爬取的页面
 */
"use strict";
var http = require('http')
var cheerio = require('cheerio')
var request = require('request')
var fs = require('fs')
var Promist = require('bluebird')

//代理池
var iplist = require('../ip_http.json')
var result = [];

//写入本地
function creatfile(list) {
    var ttxt = 'page:' + page + '\r\n';//每页标题
    list.forEach(function(el) {
        ttxt += el.zwmc + ','+ el.gsmc + ','+ el.zwyx + ','+ el.gzdd + ','+ el.gxsj + '\r\n';
    });
    return new Promise(function (resolve, reject) {
        fs.appendFile('./' + 'zlzp.txt', ttxt, 'utf-8', function (err) {
            if (!err) {          
                console.log(page+'is spidering');   
                page++
                console.log(result.length)
                result = [];
                spdNext();
                resolve();
            }
        })
    })
}
//提取数据
var filterHtml = function (html,url) {
    var $ = cheerio.load(html);
    if($('title').text().indexOf('招聘') === -1) {    //根据title判断是否被重定向
        console.log('已删除假代理网站:'+ iplist[ipacc] + $('title').text());
        iplist.splice(ipacc,1);
        return getHtml(url);
    }
    $('.newlist').each(function(item){
        var zwmc = $(this).find('.zwmc').find('div').text().replace(/\s+/g,"").replace(/\n/g,'');
        var gsmc = $(this).find('.gsmc').find('a').eq(0).text().replace(/\s+/g,"").replace(/\n/g,'');
        var zwyx = $(this).find('.zwyx').text().replace(/\s+/g,"").replace(/\n/g,'');
        var gzdd = $(this).find('.gzdd').text().replace(/\s+/g,"").replace(/\n/g,'');
        var gxsj = $(this).find('.gxsj').find('span').text().replace(/\s+/g,"").replace(/\n/g,'');
        result.push({
            zwmc,
            gsmc,
            zwyx,
            gzdd,
            gxsj,
        })
    })
    result.shift();
    creatfile(result);
}





function spdNext(){
    page = page++;
    let url = target + page;    
    getHtml(url)
}

//发送请求，成功写入文件，失败换代理
var getHtml = function (url) {
    console.log(url);
    if(page > 30){        
        return console.log('all done!');
    }
    if (ipacc >= iplist.length) {
        ipacc = 0;
        console.log('used all ip.')
        return spdNext();
    }
    //设置代理
    let prox = {
        url: url,
        proxy: 'http://' + iplist[ipacc],
        timeout: 4000,
        headers: {
            'Host': 'sou.zhaopin.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36'
        }
    }    
    request(prox, function (err, res, body) {
        if (err) {
            console.log('err:'+ipacc);
            ipacc++;
            getHtml(url);
        } else {
            ipacc = 0;
            filterHtml(body,url);
        }
    })
}

var target = 'http://sou.zhaopin.com/jobs/searchresult.ashx?jl=%e6%88%90%e9%83%bd&kw=web%e5%89%8d%e7%ab%af&isadv=0&sg=8cd66893b0d14261bde1e33b154456f2&p='
var page = 1;
var ipacc = 0;
var nowUrl = target + page;
getHtml(nowUrl);