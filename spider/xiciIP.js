var http = require('http')
var cheerio = require('cheerio')
var request = require('request')
var fs = require('fs')

var ourl = 'http://www.xicidaili.com/';
var guonei = 'http://www.xicidaili.com/nn/';

var result = {
    http: [],
    https: []
}


function filltxt(txt) {
    var date = new Date().Format("yyyy-MM-dd HH-mm-ss");
    fs.appendFile('./' + 'ip'+date+'.txt', txt, 'utf-8', function (err) {
        if (!err) {
            console.log(err);
        }
    })
}
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "H+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
function ObjtoTxt(obj) {
    var text = 'type: http \r\n';
    obj.http.forEach(function (element) {
        text += `'${element.ip}:${element.port}',\r\n`;
    });
    text += '\r\ntype: https \r\n';
    obj.https.forEach(function (element) {
        text += `'${element.ip}:${element.port}',\r\n`;
    });
    filltxt(text);
}
function fileterHtml(html) {
    var $ = cheerio.load(html);
    var tr = $('#ip_list').find('tr');
    tr.each(function (item) {
        var type = $(this).find('td').eq(5).text();
        if (type === 'HTTP') {
            result.http.push({
                ip: $(this).find('td').eq(1).text(),
                port: $(this).find('td').eq(2).text()
            })
        } else if (type === 'HTTPS') {
            result.https.push({
                ip: $(this).find('td').eq(1).text(),
                port: $(this).find('td').eq(2).text()
            })
        }
    })
    ObjtoTxt(result);
}

function findguonei(url) {
    request(url, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            fileterHtml(body)
            //console.log(body);
        } else {
            console.log(err);
        }
    })
}
findguonei(guonei);