var express = require("express"); 
var bodyParser = require("body-parser"); 

const crypto = require('crypto'); 
var app = express(); 
var mongoose=require('mongoose');

app.use(bodyParser.urlencoded({ extended: true })); 
app.use(express.static("public")); 
mongoose.connect('mongodb://localhost:27017/isaa_prj', function (err) {
   if (err) throw err; 
   console.log('Successfully connected'); 
}); 


var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
}); 


var user = mongoose.model("user", userSchema); 


app.get("/", function (req, res) {
    res.render("index"); 

})



function encrypt(text) { 

const key = 'keykeykeykeykeykeykeykey';
const nonce = crypto.randomBytes(12);

const aad = Buffer.from('0123456789', 'hex');
const cipher = crypto.createCipheriv('aes-192-ccm', key, nonce, {
  authTagLength: 16
});
cipher.setAAD(aad, {
  plaintextLength: Buffer.byteLength(text)
});
const ciphertext = cipher.update(text, 'utf8');

encrypted = Buffer.concat([ciphertext, cipher.final()]); 
return { encryptedData: encrypted.toString('hex') }; 

} 

app.post("/", function (req, res) {

    console.log(req.body);
    var username=req.body.username;
    var password =  encrypt(req.body.password); 
    var email=req.body.email;

    console.log(username)
    console.log(password)
    console.log(email)


    // PUSHING DATA INTO THE DATABASE
    user.create(
        {
            username: username,
            password: password.encryptedData,
            email: email

        },
        function (err, yolo) {
            if (err) {
                res.send("SOME ERROR OCCURRED, TRY AGAIN.")
            } else {
                res.send(`<h1> A new login is created for ${req.body.username} </h1>`)

            }
        }
    ); 


}); 


app.listen(process.env.PORT || 8000, function () {
    console.log("SERVER 8000 HAS STARTED"); 

}); 

