'use strict';

var express = require('express');
var cors = require('cors');
var multer = require('multer');
var log = require('npmlog');
var fs = require('fs');
var upload = multer({ dest: "uploads/" });
const mongoose = require('mongoose');
var app = express();


const MONGO_CREDENTIALS = 'mongodb+srv://dbUserMongo:q1w2e3r4t5@cluster0.h4ukd.mongodb.net/urlshort?retryWrites=true&w=majority';
const uri = MONGO_CREDENTIALS;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
});

const connection = mongoose.connection;

connection.once('open', () => {
        console.log("MongoDB database connection established successfully");
    })
    // define schema

var Schema = mongoose.Schema;
var fileSchema = new Schema({
    name: String,
    size: Number,
    date: String
});

var File = mongoose.model('File', fileSchema);


app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/hello', function(req, res) {
    res.json({ greetings: "Hello, API" });
});


app.post('/api/fileanalyse', upload.single("upfile"), function(req, res) {

    console.log(req.file)

    const theFile = req.file

    if (theFile) {
        var fileDetails = {
            name: theFile.originalname,
            size: theFile.size,
            date: new Date().toLocaleString(),
            file: theFile.filename
        };

        return res.send(fileDetails)
    }

    return res.send({ error: 'file must be present' })

});


app.listen(process.env.PORT || 3000, function() {
    console.log('Node.js listening ...');
});