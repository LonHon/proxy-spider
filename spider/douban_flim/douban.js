var http = require('http')
var cheerio = require('cheerio')
var request = require('request')
var fs = require('fs')
var url = 'https://movie.douban.com/top250?start='

var data = []
var filterHtml = function (html) {
    var $ = cheerio.load(html)
    var list = $('.item')
    list.each(function (item) {
        // var title = $(this).find('.title').eq(0).text();
        // var proc = $(this).find('.bd').find('p').eq(0).text().replace(/\s+/g,"").split('\n');
        // var start = $(this).find('.star').find('.rating_num').text()
        // var pers = parseInt($(this).find('.star').find('span').eq(3).text())
        // var one = $(this).find('.bd').find('.inq').text().replace(/\s+/g,"").replace(/\n/g,'')
        //console.log($(this).find('.bd').find('.inq').text().replace(/\s+/g,"").replace(/\n/g,''))
        data.push({
            flimName: $(this).find('.title').eq(0).text(),
            start: $(this).find('.star').find('.rating_num').text(),
            one: $(this).find('.bd').find('.inq').text().replace(/\s+/g, "").replace(/\n/g, ''),
            plnum: parseInt($(this).find('.star').find('span').eq(3).text()),
            proctor: $(this).find('.bd').find('p').eq(0).text().replace(/\s+/g, "").split('\n')
        })
    })
}

var formatdata = function(data){
    var txt = '';
    for(i in data){
        txt += data[i].flimName + ',' + data[i].proctor + ',' + data[i].start + ',' + data[i].plnum + ',' + data[i].one +'\r\n';
    }
    return txt;
}
var filltxt = function (text) {
    fs.appendFile('./data/' + 'douban.txt', text, 'utf-8', function (err) {
        if(!err){
            console.log(err);
        }
    })
}


var flag = 0;
var getHtml = function (url) {
    if (flag > 49) {
        filltxt(formatdata(data));
        return false;
    }
    request(url, function (err, res, body) {
        if (!err && res.statusCode == 200) {
            filterHtml(body)
            flag += 25;
            getHtml(url + flag);
        } else {
            console.log('err')
        }
    })
}

 for (var i = 0; i < 51; i += 25) {
     getHtml(url + i)
 }