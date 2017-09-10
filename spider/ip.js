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

function filltxt(txt,type) {
    fs.appendFile('./ip_'+ type +'.json', txt, 'utf-8', function (err) {
        if (!err) {
            console.log('ippool updated~');
        }
    })
}
function ObjtoTxt(obj,type) {
    var text = 'type: http \r\n';
    // obj.http.forEach(function (element) {
    //     text += `'${element.ip}:${element.port}',\r\n`;
    // });
    // text += '\r\ntype: https \r\n';
    // obj.https.forEach(function (element) {
    //     text += `'${element.ip}:${element.port}',\r\n`;
    // });
    var txt = JSON.stringify(obj)
    filltxt(txt,type);
}
function fileterHtml(html) {
    var $ = cheerio.load(html);
    var tr = $('#ip_list').find('tr');
    tr.each(function (item) {
        var type = $(this).find('td').eq(5).text();
        if (type === 'HTTP') {
            result.http.push(
                $(this).find('td').eq(1).text() + ':' + $(this).find('td').eq(2).text()
                // {
                // ip: $(this).find('td').eq(1).text(),
                // port: $(this).find('td').eq(2).text()
                // }
                
            )
        } else if (type === 'HTTPS') {
            result.https.push(
                $(this).find('td').eq(1).text() + ':' + $(this).find('td').eq(2).text()
                // {
                // ip: $(this).find('td').eq(1).text(),
                // port: $(this).find('td').eq(2).text()
                // }
            )
        }
    })
    ObjtoTxt(result.http,'http');
    //ObjtoTxt(result.https,'https');
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