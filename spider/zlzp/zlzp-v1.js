/*
 * @Author: Lonhon 
 * @Date: 2017-09-10 01:28:50 
 * @Last Modified by: github/Lonhon
 * @Last Modified time: 2017-09-10 13:35:39
 * 使用异步爬取数据
 */
"use strict";
var http = require('http')
var cheerio = require('cheerio')
var request = require('request')
var fs = require('fs')
var Promise = require('bluebird')//虽然原生已经支持，但bluebird效率更高
    

var iplist = require('../ip_http.json')
var spiderList=[];

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

//发送请求，成功写入文件，失败换代理
var getHtml = function (url,ipac,ppp) {
    if (ipac >= iplist.length){        
        return console.log('page:'+ppp+'all died');
    }
    //设置代理
    let prox = {
        url: url,
        proxy: 'http://' + iplist[ipac],
        timeout: 4000,
        headers: {
            'Host': 'sou.zhaopin.com',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36'
        }
    }    
    return new Promise(function(resolve,reject){
        request(prox, function (err, res, body) {
            if (err) {
                reject(url)//继续请求当前页
            } else {
                resolve(body, url)
            }
        })
    }) 
}

//解析doc
function filterHtml(html,p,noww){
    let res = [];
    var $ = cheerio.load(html);
    if($('title').text().indexOf('招聘') === -1) {    //根据title判断是否被重定向
        //console.log('删除假代理:'+ iplist[noww[2]] + $('title').text());       
        //iplist.splice(noww[2],1);
        return lhlh(noww[0],noww[1],noww[2]+1);
    }
    $('.newlist').each(function(item){
        var zwmc = $(this).find('.zwmc').find('div').text().replace(/\s+/g,"").replace(/\n/g,'');
        var gsmc = $(this).find('.gsmc').find('a').eq(0).text().replace(/\s+/g,"").replace(/\n/g,'');
        var zwyx = $(this).find('.zwyx').text().replace(/\s+/g,"").replace(/\n/g,'');
        var gzdd = $(this).find('.gzdd').text().replace(/\s+/g,"").replace(/\n/g,'');
        var gxsj = $(this).find('.gxsj').find('span').text().replace(/\s+/g,"").replace(/\n/g,'');
        res.push({
            zwmc,
            gsmc,
            zwyx,
            gzdd,
            gxsj,
        })
    })
    res.shift();
    if(res.length < 60){
        return lhlh(noww[0],noww[1],noww[2]+1);
    }

    return creatfile(res,p);
}

//写入本地
function creatfile(list,page) {
    var ttxt = 'page:' + page + '\r\n';//每页标题
    list.forEach(function(el) {
        ttxt += el.zwmc + ','+ el.gsmc + ','+ el.zwyx + ','+ el.gzdd + ','+ el.gxsj + '\r\n';
    });
    fs.appendFile('./' + 'zlzp-v1.txt', 'page:'+ttxt+'\r\n' , 'utf-8', function (err) {
        if (!err) {    
            spiderList.push(page);
            //console.log(spiderList.length);
            //console.log(page+'is spidering:'+ list.length);
        }
    })
}

var source = 'http://sou.zhaopin.com/jobs/searchresult.ashx?jl=%e6%88%90%e9%83%bd&kw=web%e5%89%8d%e7%ab%af&isadv=0&sg=8cd66893b0d14261bde1e33b154456f2&p=1'
var target = 'http://sou.zhaopin.com/jobs/searchresult.ashx?jl=%e6%88%90%e9%83%bd&kw=web%e5%89%8d%e7%ab%af&isadv=0&sg=8cd66893b0d14261bde1e33b154456f2&p='

let ipacc = 0;
for(let i =1;i<31;i++){
    let ourl = target + i;
    lhlh(ourl,i,0);
}

/*
promise的目的1：把异步需要回调的东西放在异步操作外面，比如：
function b(){  放一些异步操作，返回 Promise   }
function a(){
    调用异步方法b
    b().then(function(val:resolve的返回值){
        这时候就可以直接使用c(val)
        使用原来的回调函数就必须把c方法放在async方法中执行，当回调过多的时候函数调用就会变成a(b(c(d(e(f(...))))))，层层嵌套
        而使用Promise函数调用就可以扁平为a()->b()->c()...，特别是当理解了Promise的运行步骤后，
    })
}

function c(val){
    本函数需要async的返回值val作为参数才能正确执行
}


闭包是个好东西，在异步操作的时候通过闭包可以获取同一个变量，而不会改变其它线程在使用的变量。
比如本次爬虫中每次filterHtml解析网页完成后的结果集res，如果放在外层，则会被正在运行的其它异步操作影响，导致传入creatfile的res被影响,
再比如每次爬取的page，如果取for循环里面的i，那最后得到的是i最后的值，所以需要将i传入方法，通过闭包实现每次输出到txt文件的page是当前爬取的page。
当A在异步层时
            异步A    异步B
00:01       A=1      
00:02                A=2
00:03       A===2
*/