const express = require("express");
const bodyParser=require("body-parser");
const formidable = require("formidable");
const { PythonShell } = require("python-shell");
const fs = require("fs");
const path = require("path");
const cors = require("cors");

// set up the app using express framework
const app = express();

// setup the global middlewares for the app for accessing static folder 
app.use(express.static("public"));

// setup the global middleware for parsing JSON data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// use cors as a global middleware
app.use(cors());

const uploadDir = path.join(__dirname, "input_images");
// function to delete all files inside test images folder
function deleteFiles(filePath) {
    fs.readdir(uploadDir, (err, files) => {
        if (err) throw err;
        for (let file of files) {
            // delete only recently uploaded file
            if (file == filePath){
                console.log("Deleted!!!");  
                fs.unlink(path.join(uploadDir, file), err => {
                    if (err) throw err;
                });
            }
           
        }
    });
}

// File Upload Route 
app.post("/file_upload", (req, res) => {    
    
    // set up the formidable package to handle images from request parameter
    const form = formidable({ multiples: true, uploadDir: __dirname + "/input_images", keepExtensions:true});
     
    var fileName, fileType, fileUploadPath;
     
     // parse the incoming request object with multiform type data
     form.parse(req, (err, fields, files) => {
         if (err) {
             next(err);
             return;
         }
          
         if(files.file == undefined){
             res.send("No Input File");
             return;
         }   
         
         // get access to required file details (name, path and type)
         
         fileName = files.file.name;
         fileType = files.file.type;
         fileUploadPath = files.file.path;
 
         
         const newFileName = fileName.split('.').join('-' + Date.now() + '.');
         const newPath = __dirname + "/input_images" + "/" + newFileName;
         
         fs.rename(fileUploadPath, newPath, () => {
             console.log("Renamed File");
         });
 
         // check to support images types
         const supportTypes = ["image/jpeg", "image/png", "image/jpg"];
    
        // error check if incoming data is image (with limited types above)
        if (supportTypes.includes(fileType)) {

            console.log("File Format Supported.")
            
            // spawn out python script with required arguments
            K = 9
            let options={
                args: [newPath, K]
            }  
            
            console.log(options)

            PythonShell.run('get_k_images.py', options, function(err,data){
                if(err){
                    console.log(err)
                    // delete processed files
                    deleteFiles(newFileName)
                    res.send("Choose Images ONLY From MNIST Dataset.");
                    return;
                }
                deleteFiles(newFileName)
                res.send(data);
             });
        }
    });
});

// Some Test Routes

app.get("/image0", (req, res) => {
    res.sendFile(path.join(__dirname, "./output_images/output_image_0.png"));
});

app.get("/image1", (req, res) => {
    res.sendFile(path.join(__dirname, "./output_images/output_image_1.png"));
});

app.get("/image2", (req, res) => {
    res.sendFile(path.join(__dirname, "./output_images/output_image_2.png"));
});

app.get("/image3", (req, res) => {
    res.sendFile(path.join(__dirname, "./output_images/output_image_3.png"));
});

app.get("/image4", (req, res) => {
    res.sendFile(path.join(__dirname, "./output_images/output_image_4.png"));
});

app.get("/image5", (req, res) => {
    res.sendFile(path.join(__dirname, "./output_images/output_image_5.png"));
});

app.get("/image6", (req, res) => {
    res.sendFile(path.join(__dirname, "./output_images/output_image_6.png"));
});

app.get("/image7", (req, res) => {
    res.sendFile(path.join(__dirname, "./output_images/output_image_7.png"));
});

app.get("/image8", (req, res) => {
    res.sendFile(path.join(__dirname, "./output_images/output_image_8.png"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server app listening on port: ${PORT}!`);
});