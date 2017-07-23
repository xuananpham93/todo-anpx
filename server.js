const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;


var db;

MongoClient.connect('mongodb://admin:admin@ds161742.mlab.com:61742/zellwk-crud', function (err, database) {
    if (err) return console.log(err);
    db = database.collection('quotes');
    app.listen(3000, function () {
        console.log('listening on 3000')
    })
});



app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
    var cursor = db.find().toArray(function (err, result) {
        if (err)
            console.log(err);

        res.render('index.ejs', {quotes: result});
    });

});

app.post('/add', function (req, res) {
    db.save(req.body, function (err, result) {
        if (err)
            return console.log(err);

        console.log('saved to database');
        res.redirect('/');
    })
});

app.get('/success/:id', function(req, res){

    var update;
    
    db.findOne({_id: ObjectId(req.params.id)}, function(err, result){
        if (result.status == 0) {
            update = {$set: {status:1}};
        }else{
            update = {$set: {status:0}};
        }

        var query = {_id: ObjectId(req.params.id)};
        var options = {new: true};

        db.findOneAndUpdate(query, update, options, function(err, kq) {
            if (err)  
                console.log(err);

            console.log('Updated');
            res.redirect('/');
        });

    });

});


app.get('/delete/:id', function(req, res){
    var query = {_id: ObjectId(req.params.id)};

    db.findOneAndDelete(query, function(err, result){
        if (err) 
            console.log(err);

        console.log('Deleted');
        res.redirect('/');
    });

});

