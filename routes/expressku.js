exports.home = function(req, res) {
    req.getConnection(function (err, connect){
        var query = connect.query('SELECT * FROM product', function (err, rows) {
            if (err) {
                console.log('Error massage: %', err);
            }
            res.render('home', {
                page_tittle: "Express-Home",
                data: rows
            });
        });
    });
}

exports.product_detail = function(req, res) {
    var id_product = req.params.id_product;
    req.getConnection(function (err, connect){
        var query = connect.query('SELECT * FROM product WHERE id_product=?', id_product, function (err, rows) {
            if (err) {
                console.log('Error massage: %', err);
            }
            res.render('product_detail', {
                page_tittle: "Express Produk Detail",
                data: rows
            });
        });
    });
    // res.render('detail_product');
}