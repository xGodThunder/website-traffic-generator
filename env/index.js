'use strict';
//independent libs
const {colors} = require('./../src/utils/logger-utils');
const {getUserInfo,initializeDB,visitCounterHandler,saveToDb} = require('./helper');
//express
const express = require('express');
const path = require('path');
const app = express();
const useragent = require('express-useragent');
const expressip = require('express-ip');
app.use(useragent.express());
app.use(expressip().getIpInfoMiddleware);
app.engine('pug', require('pug').__express);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'pug');

//middleware for website visitor
app.use(function (req, res, next) {
    initializeDB();
    visitCounterHandler();
    next();
  });

/*
routes - end points
*/
//main entry to store the data
app.get('/',(req,res)=>{
    const info = getUserInfo({ip:req.ipInfo,headers:req.useragent});
    res.status(200).render('index', { title: 'UA PARSER', info});
});

//see all the data
app.get('/record',(req,res)=>{
    const info = getUserInfo({ip:req.ipInfo,headers:req.useragent});
    const flag = saveToDb(info);
    res.status(200).render('index', { title: 'Saving', info: flag ? 'succesfully stored' : 'somnething went wrong'});
});

// starting server
app.listen(process.env.PORT || 5000,()=>{
    console.log(colors.fg.Green,`Server started on localhost:5000
    ::: Routes :::
    /       -> send the request  
    /record -> save the request             
    `,colors.Reset);
});