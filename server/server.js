const express = require('express');
const app = express();
const multer = require('multer');
const cors = require('cors');
const port = 8000;
const path = require('path');
const fs = require('fs');

app.use(cors());
app.use(express.static('public'))


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
    fs.readdir(filesFolder, (err, files) => {
        if (err) throw err;
        res.send(files);
        //console.log(files)
     });
});


const upload = multer({ storage: storage }).single('file')
app.post('/upload', (req, res) => {
    upload(req, res,  (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
            return res.status(200).send(req.file)
    })
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


app.delete('/upload/:fileName', (req, res) => {
    const fileToDelete = path.join(__dirname, '../public/uploads/', req.params.fileName);
    fs.unlink(fileToDelete,  (err) => {
        if (err) throw err;
    });
    res.sendStatus(204);               
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});