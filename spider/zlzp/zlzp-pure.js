"use strict";
var http = require('http')
var cheerio = require('cheerio')
var request = require('request')
var fs = require('fs')
var Promise = require('bluebird')//虽然原生已经支持，但bluebird效率更高
var iplist = require('../ip_http.json') //代理池

//发送请求，成功写入文件，失败换代理
var getHtml = function (url,ipac,ppp) {
    return new Promise(function(resolve,reject){
        if (ipac >= iplist.length){        
            console.log('page:'+ppp+'all died'); //代理用完，取消当前页面ppp的请求
            reject(url,false);
        }
        let prox = {    //设置代理
            url: url,
            proxy: 'http://' + iplist[ipac],
            timeout: 5000,
            headers: {
                'Host': 'sou.zhaopin.com',
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36'
            }
        };
        request(prox, function (err, res, body) {
            if (err) {
                reject(url)//失败，回传当前请求的页面url
            } else {
                resolve(body, url)//成功回传html和url
            }
        })
    }) 
}
//解析doc
function filterHtml(html,p,noww){
    let res = [];//存放结果集
    var $ = cheerio.load(html);
    if($('title').text().indexOf('招聘') === -1) {    //根据title判断是否被代理重定向
        iplist.splice(noww[2],1);   //删除假代理。
        return lhlh(noww[0],noww[1],noww[2]+1);
    }
    $('.newlist').each(function(item){
        res.push({
            zwmc: $(this).find('.zwmc').find('div').text().replace(/\s+/g,"").replace(/\n/g,''),
            gsmc: $(this).find('.gsmc').find('a').eq(0).text().replace(/\s+/g,"").replace(/\n/g,''),
            zwyx: $(this).find('.zwyx').text().replace(/\s+/g,"").replace(/\n/g,''),
            gzdd: $(this).find('.gzdd').text().replace(/\s+/g,"").replace(/\n/g,''),
            gxsj: $(this).find('.gxsj').find('span').text().replace(/\s+/g,"").replace(/\n/g,'')
        })
    })
    res.shift();//删除表头行
    if(res.length < 60){
        return lhlh(noww[0],noww[1],noww[2]+1);
    }
    return creatfile(res,p);
}
//写入本地
function creatfile(list,page) {
    var ttxt = 'page:' + page + '\r\n';//每页标题
    list.forEach(function(el) {  //遍历数据为文本
        ttxt += el.zwmc + ','+ el.gsmc + ','+ el.zwyx + ','+ el.gzdd + ','+ el.gxsj + '\r\n';
    });
    fs.appendFile('./' + 'zlzp-pure.txt', 'page:'+ttxt+'\r\n' , 'utf-8', function (err) {
        if (!err) {
            let currTime = Math.round((Date.parse(new Date()) - startTime) / 1000); 
            console.log('page:' + page +' is ok:' +list.length + ',spend:' + currTime + 's' ); // page:1 is ok
        }
    })
}

//请求封装为promise
function lhlh(url,page,ipac){
    getHtml(url,ipac,page).then((html,oldurl)=>{
        let noww= [url,page,ipac]
        filterHtml(html,page,noww);
    })
    .catch((url,type = true)=>{
        if(type){
            ipac += 1;
            lhlh(url,page,ipac);
        }
    })
} 
var target = 'http://sou.zhaopin.com/jobs/searchresult.ashx?jl=%e6%88%90%e9%83%bd&kw=web%e5%89%8d%e7%ab%af&isadv=0&sg=8cd66893b0d14261bde1e33b154456f2&p=';
let ipacc = 0;
var startTime = Date.parse(new Date());
for(let i=1; i<31; i++){
    let ourl = target + i;
    lhlh(ourl, i, 0);
}