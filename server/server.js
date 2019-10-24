const express = require('express'); // web app framework which provides simple API to build web apps
const app = express();              // framework  to help organize web application
const multer = require('multer'); //node.js middleware for handling multipart/form-data
const cors = require('cors'); // to handle cross origin http requests between client n server
const port = 8000;
const path = require('path');
const fs = require('fs'); // API to wotk with file system 

app.use(cors());
app.use(express.static('public'))   // let us load files located in public folder


let storage = multer.diskStorage({
    destination:  (req, file, cb) => {
        cb(null, './public/uploads')                    // it works HA! file saved at ./public/uploads
    },
    filename:  (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.toLowerCase().replace(/[^a-z0-9.()]/g, "-") )
    }
});


app.get('/', (req, res) => {
    res.send('Hello people');
});


app.get('/upload', (req, res) => {
    const filesFolder = './public/uploads/';
    fs.readdir(filesFolder, (err, files) => {  // reads the content of a folder. return object { files: ['','','']}
        if (err) throw err;
        res.send(files);
        //console.log(typeof files)
        //console.log( {files} )
     });
});


const upload = multer({ storage: storage }).single('file')          //upload instance and receive a single file

app.post('/upload', (req, res) => {
    upload(req, res,  (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)    // 500 Internal Server Error
        } else if (err) {
            return res.status(500).json(err)
        }
            return res.status(200).send(req.file) //request has succeeded.
    })
});


app.get('/download/:fileName', (req, res) => {
    const file = path.join(__dirname, '../public/uploads/', req.params.fileName);

    //req.params.fileName validation
    let regex = /[^a-z0-9.()-]/
    let notValid = regex.test(req.params.fileName);
   
    // if notValid is true means url contains not valid characters
    if (notValid) {
        res.send('Nice try');
    } else {
        res.download(file, (err) => {
            if (err) {
                console.log(err)
            } else {
                console.log('File downloaded')
            }
        });  
    }
})


app.delete('/upload/:fileName', (req, res) => {
    
    const fileToDelete = path.join(__dirname, '../public/uploads/', req.params.fileName); // __dirname - tells  the absolute path of the directory containing the currently executing file
   
    fs.unlink(fileToDelete,  (err) => {
        if (err) throw err;
    });
    res.sendStatus(204);               
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});