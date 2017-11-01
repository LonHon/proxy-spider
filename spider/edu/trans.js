var http = require('http')
var cheerio = require('cheerio')
var request = require('request')
var fs = require('fs')
var Promise = require('bluebird')//虽然原生已经支持，但bluebird效率更高
var msource = require('./edu.json');

const mmap = require('./map.json')
console.log(mmap.length)
var iplist = require('../ip_http.json') //代理池

// var url = 'http://apis.map.qq.com/jsapi?qt=poi&wd=%E5%8C%97%E4%BA%AC%E5%A4%A7%E5%AD%A6&pn=0&rn=10&rich_source=qipao&rich=web&nj=0&c=1&key=FBOBZ-VODWU-C7SVF-B2BDI-UK3JE-YBFUS&output=jsonp&pf=jsapi&ref=jsapi&cb=qq.maps._svcb3.search_service_0'
var url = `http://apis.map.qq.com/jsapi`



function filltxt(txt, type) {
    fs.appendFile('edu_ip.txt', txt, 'utf-8', function (err) {
        if (!err) {
            console.log(type + ' updated~');
        }
    })
}

var txt = ''
var result = [];

function fort(name, data, type) {
    result.push({
        name,
        coord: [data.detail.pois[0].pointx, data.detail.pois[0].pointy],
        coletype: type
    })
    txt = JSON.stringify(result);
    txt += '\r\n'
    filltxt(txt, type);
}


function getip(name, opt, type) {
        var option = {
            url: url,
            methods: 'GET',
            timeout: 5000,
            qs: opt,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.96 Safari/537.36'
            }
        }
        request(option, function (err, res, body) {
            if (!err && res.statusCode == 200) {
                // console.log(body)
                var x = String(body).replace('qq.maps._svcb3.search_service_0 && qq.maps._svcb3.search_service_0(', '')
                x = x.replace('qq.maps._svcb3.search_service_0&&qq.maps._svcb3.search_service_0(', '')
                x = x.substr(0, x.length - 1);
                var obj = JSON.parse(x);
                // console.log(obj)
                fort(name, obj, type);
            } else {
                console.log(err+'\n err')
            }
        })

}
var op = {
    'qt': 'poi',
    'wd': '清华大学',
    'pn': 0,
    'rn': 10,
    'rich_source': 'qipao',
    'rich': 'web',
    'nj': 0,
    'c': 1,
    'key': 'FBOBZ-VODWU-C7SVF-B2BDI-UK3JE-YBFUS',
    'output': 'jsonp',
    'pf': 'jsapi',
    'ref': 'jsapi',
    'cb': 'qq.maps._svcb3.search_service_0'
}
// var mark = 0 ;
// for(let item in msource){
//     for(let i of msource[item]){
//         if(i == '第四军医大学'){//30-40
//             if(mark > msource.length) return;
//             op.wd = i;
//             getip(i, op, item);
//         }
//     }
// }
// var aaa = []
// mmap.map((item)=>{
//     aaa.push(item.name);
// })
// Array.prototype.diff = function(a) {
//     return this.filter(function(i) {return a.indexOf(i) < 0;});
// };
// console.log(bbb.diff(aaa))
console.log(mmap.length);