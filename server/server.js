const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const port = 8000;
const path = require('path');
const fs = require('fs');

app.use(cors());

//app.use(express.static(__dirname + './public')); // added
app.use(express.static('public'))
// can get files this way http://localhost:8000/uploads/1570724313793-UML.png

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads') // it works HA! file saved at ./public/files
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



app.get('/upload', function(req, res) {
    const filesFolder = './public/uploads/';
    
    fs.readdir(filesFolder, (err, files) => {
        if (err) throw err;
        res.send(files);
     });
});
  

app.delete('/upload/:fileName', (req, res) => {
    const fileToDelete = path.join(__dirname, '../public/uploads/', req.params.fileName);
     
    fs.unlink(fileToDelete,  (err) => {
        if (err) throw err;
        //console.log('File deleted!');
    });
    res.sendStatus(204);                   
});

app.get('/download/:fileName', (req, res) => {
    const file = path.join(__dirname, '../public/uploads/', req.params.fileName);
    res.download(file, (err) => {
        if (err) {
            console.log(err)
          } else {
            console.log('File downloaded')
          }
    }); 
})



app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});