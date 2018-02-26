var http = require('http')
var cheerio = require('cheerio')
var request = require('request')
var fs = require('fs')

var result = {
    http: [],
    https: []
}

function filltxt(txt,type) {
    fs.unlink('./ip_'+ type +'.json',function(err){
        if(!err){
            fs.appendFile('./ip_'+ type +'.json', txt, 'utf-8', function (err) {
                if (!err) {
                    console.log(type + ' ippool updated~');
                }
            })
        }else{
            console.log(err)
        }
    })
}
function ObjtoTxt(obj,type) {
    let txt = JSON.stringify(obj);
    return filltxt(txt,type);
}
function fileterHtml(html) {
    var $ = cheerio.load(html);
    var tr = $('#ip_list').find('tr');
    tr.each(function (item) {
        var type = $(this).find('td').eq(5).text();
        if (type === 'HTTP') {
            result.http.push( $(this).find('td').eq(1).text() + ':' + $(this).find('td').eq(2).text() )
        } else if (type === 'HTTPS') {
            result.https.push( $(this).find('td').eq(1).text() + ':' + $(this).find('td').eq(2).text() )
        }
    })
    // ObjtoTxt(result.http,'http');   
    ObjtoTxt(result.https,'http');   //目前只需要http的代理，故先隐藏
}
function getHtml(url) {
    request(url, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            fileterHtml(body)
        } else {
            console.log(err);
        }
    })
}

var ourl = 'http://www.xicidaili.com/';
var guonei = 'http://www.xicidaili.com/nn/';
getHtml(guonei);