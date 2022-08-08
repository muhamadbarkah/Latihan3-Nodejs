var express = require ('express');
var app = express ();
var logger = require ('morgan');

var expressku = require ('./routes/expressku');

var conn = require('express-myconnection');
var mysql = require('mysql');

app.set('port', process.env.port || 8080);
app.set('view engine', 'ejs');


app.use(logger('dev'));
app.use('/public', express.static(__dirname + '/public'));
app.use(
    conn(mysql, {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        port: 3306,
        database: 'express_db'
    }, 'single')
);

app.get('/', function (req, res) {
    res.send('Server is Running on Port ' + app.get('port'));
});
app.get('/express', expressku.home);
app.get('/express/product_detail/:id_product', expressku.product_detail);

app.listen(app.get('port'), function () {
    console.log('Server is Running on Port ' + app.get('port'));
});