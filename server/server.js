const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');

app.use(cors());

//app.use(express.static(__dirname + '/public/files')); // added
app.use(express.static('public'))
// can get files this way http://localhost:8000/files/1570724313793-UML.png

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/files') // it works HA! file saved at ./public/files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname )
    }
});







const upload = multer({ storage: storage }).single('file')

app.post('/upload', function(req, res){
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
       
 })
});

/*
let arr = [];
const testFolder = './public/files/';
const fs = require('fs');
fs.readdir(testFolder, (err, files) => {
    
   for(let i = 0; i<files.length; i++){
   arr.push(files[i]);
   }
    console.log(arr[0]);

 files.forEach(file => {
  arr.push(file)

 });
 console.log(arr);
});*/


app.get('/api', (req, res) => {
 
    const testFolder = './public/files/';
    const fs = require('fs');

    let arr = [];
    fs.readdir(testFolder, (err, files) => {
        files.forEach(file => {
            arr.push(file)
        });
        console.log(arr);
        res.send(arr)
    });
});






app.listen(8000, function() {

    console.log('App running on port 8000');

});