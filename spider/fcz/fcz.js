"use strict";
var http = require('http')
var cheerio = require('cheerio')
var request = require('request')
var fs = require('fs')
var Promise = require('bluebird')//虽然原生已经支持，但bluebird效率更高
var iplist = require('../ip_http.json') //代理池

var ooo = 'http://www.variflight.com/flight/fnum/G52909.html?AE71649A58c77&fdate=20170914';
var xxx = 'http://www.variflight.com/flight/fnum/G52909.html?AE71649A58c77&fdate=20170915';
var url = 'http://www.variflight.com/flight/fnum/G52909.html?AE71649A58c77&fdate=';