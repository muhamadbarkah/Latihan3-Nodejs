var express = require ('express');
var app = express ();
var logger = require ('morgan');
var path = require ('path');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('express-flash');

var expressku = require ('./routes/expressku');
var adminku = require ('./routes/adminku');

var conn = require('express-myconnection');
var mysql = require('mysql');

app.set('port', process.env.port || 8080);
app.set('view engine', 'ejs');

// app.use(bodyparser.urlencoded({extended: false}));
app.use(logger('dev'));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(flash());

app.use(
    conn(mysql, {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        port: 3306,
        database: 'express_db'
    }, 'single')
);

// SESIION TEST
app.use(
    session({
        secret: 'babastudio',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 120000}
    })
);

app.get('/', function (req, res) {
    res.send('Server is Running on Port ' + app.get('port'));
});
app.get('/express', expressku.home);
app.get('/express/product_detail/:id_product', expressku.product_detail);

app.get('/express/admin', adminku.home);
app.get('/express/admin/login', adminku.login);
app.get('/express/admin/home', adminku.home);
app.post('/express/admin/add_produk', adminku.process_add_produk);
app.get('/express/admin/add_produk', adminku.add_produk);
app.get('/express/admin/edit_produk/:id_product', adminku.edit_produk);
app.post('/express/admin/edit_produk/:id_product', adminku.process_edit_produk);
app.get('/express/admin/delete_produk/:id_product', adminku.delete_produk);
app.get('/express/admin/logout', adminku.logout);
app.listen(app.get('port'), function () {
    console.log('Server is Running on Port ' + app.get('port'));
});