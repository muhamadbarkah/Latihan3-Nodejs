var multer = require('multer');

exports.login = function(req, res) {
    var message = '';
    res.render('./admin/index', {
        message:message
    });
}

exports.home = function(req, res) {
    // CARA SUPAYA TIDAK BISA AUTO LOGIN REDIRECT
    // var admin = req.session.admin;
    // var adminId = req.session.adminId;
    // console.log('id_admin=' + adminId);

    // if (adminId == null) {
    //     res.redirect('/express/admin/login');
    //     return;
    // }

    req.getConnection(function(err, connect) {
        var sql = "SELECT * FROM product ORDER BY createdate DESC";

        var query = connect.query(sql, function(err, results){
            res.render('./admin/home', {
                pathname: 'home',
                data: results
            });
        });
    });

}

exports.add_produk = function(req, res) {
    // CARA SUPAYA TIDAK BISA AUTO LOGIN REDIRECT
    // var admin = req.session.admin;
    // var adminId = req.session.adminId;
    // console.log('id_admin=' + adminId);

    // if (adminId == null) {
    // res.redirect('/express/admin/login');
    // return;
    // }
    res.render('./admin/home', {
        pathname: 'add_produk'
    });
}

exports.process_add_produk = function(req, res) {
    var storage = multer.diskStorage({
        destination: './public/news_images',
        filename: function(req, file, callback) {
            callback(null, file.originalname);
        }
    });

    var upload = multer({ storage:storage }).single('image');
    var date = new Date(Date.now());

    upload(req, res, function(err) {
        if (err) {
            return res.end('Error Uploading Image!!!');
        }
        console.log(req.file);
        console.log(req.body);

        req.getConnection(function(err, connect) {
            // Tangkap Nilai atau Value dari body
            var post = {
                nama_produk: req.body.nama,
                harga_product: req.body.harga,
                des_product: req.body.description,
                gambar_produk: req.file.filename,
                createdate: date
            }
            console.log(post);
            var sql = "INSERT INTO product SET ?";

            var query = connect.query(sql, post, function(err, results) {
                if (err) {
                    console.log('Error Input Produk: %s', err);
                }
                req.flash('info', 'Yeayh Produk Berhasil Di Tambahkan !!!');
                res.redirect('/express/admin/home');
            });
        });
    });
}

exports.edit_produk = function(req,res) {
    // CARA SUPAYA TIDAK BISA AUTO LOGIN REDIRECT
    // var admin = req.session.admin;
    // var adminId = req.session.adminId;
    // console.log('id_admin=' + adminId);

    // if (adminId == null) {
    //     res.redirect('/express/admin/login');
    //     return;
    // }
    var id_product = req.params.id_product;

    req.getConnection(function(err, connect) {
        var sql = "SELECT * FROM product WHERE id_product=?";

        var query = connect.query(sql, id_product, function(err, results) {
            if (err) {
                console.log('Error show news: %s', err);
            }
            res.render('./admin/home', {
                pathname: 'edit_produk',
                data: results
            });
        });
    });
}

exports.process_edit_produk = function(req, res) {
    var id_product = req.params.id_product;

    var storage = multer.diskStorage({
        destination: './public/news_images',
        filename: function(req, file, callback) {
            callback(null, file.originalname);
        }
    });

    var upload = multer({ storage:storage }).single('image');
    var date = new Date(Date.now());

    upload(req, res, function(err) {
        if (err) {
            var iamge = req.body.image_old;
            console.log("Error uploading image!");
        } else if (req.file == undefined) {
            var image = req.body.image_old;
        } else {
            var image = req.file.filename;
        }

        console.log(req.file);
        console.log(req.body);

        req.getConnection(function(err, connect) {
            var post = {
                nama_produk: req.body.title,
                harga_product: req.body.harga,
                des_product: req.body.description,
                gambar_produk: image,
                createdate:date
            }

            var sql = "UPDATE product SET ? WHERE id_product=?";

            var query = connect.query(sql, [post, id_product], function(err, results) {
                if (err) {
                    console.log("Error Edit Product: %s", err);
                }
                req.flash('info', 'Yeayh Berhasil Di Update !!!');
                res.redirect('/express/admin/home');
            });
        });
    });
}

exports.delete_produk = function(req, res) {
    var id_product = req.params.id_product;

    req.getConnection(function(err, connect) {
        var sql = "DELETE FROM product WHERE id_product=?";

        var query = connect.query(sql, id_product, function(err, results) {
            if (err) {
                console.log("Error delete produk: %s", err);
            }

            req.flash('info', 'Yeayh Berhasil Di Hapus Produk !!!');
            res.redirect('/express/admin/home');
        });
    });
}

exports.logout = function(req, res) {
    req.session.destroy(function(err) {
        res.redirect('/express/admin/login');
    });
}