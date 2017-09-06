var http = require('http')
var cheerio = require('cheerio')
var fs = require('fs')
function filterhtml(html){
    var $ = cheerio.load(html)
    var oparent = $('.chapter')
    var result = {
        courseName : '',
        courseList: []
    }
    oparent.each(function(item) {
        var partitle = $(this).find('strong').text().replace(/[ ]+/g,' ').replace(/\n/g,'')
        var meta = $(this).find('.video').children('li')
        var picedata = {
            title : partitle,
            meta: []
        }
        meta.each(function(item){
            var subdom = $(this).find('.J-media-item')
            var subtitle = subdom.text().replace(/\s+/g,"").replace(/\n/g,'')
            var subhref = subdom.attr('href')
            picedata.meta.push({
                title: subtitle,
                subhref: subhref
            })
        })
        result.courseList.push(picedata)
    });
    result.courseName = $('h2.l').text()
    return result;
}
function savedTxt(data, name){
    fs.appendFile('./data/'+ name +'.txt', data, 'utf-8', function(err){
        //console.log(err);
    })
}
var printthis = function (data,id){
    //id暂时无用
    var x = ''
    data.courseList.forEach(function(item){
        x += item.title + '\r\n'
        var submta = item.meta
        submta.forEach(function(iitem){
            x += '    【' + iitem.subhref + '】'+ iitem.title +'\r\n'
        })
    })
    savedTxt(x, id+'-'+data.courseName)
}

function getCourse(url,id){
    http.get(url, function (res) {
        var html = ''
        res.on('data', function (data) {
            html += data
        })
        res.on('end', function () {
            if(res.statusCode === 404){
                return false;
            }
            printthis(filterhtml(html),id)
            return console.log(id+ 'has be spidered!')
        })
    }).on('error', function () {
        //console.log(new Date() - startTIme)
    })
}
for(var i = 9 ; i< 20; i++){
    var url = 'http://www.imooc.com/learn';
    url = url + '/' + i;
    getCourse(url, i)
}