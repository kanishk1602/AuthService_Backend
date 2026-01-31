//sbse pehle mongoose ka instance leke aayenge
const mongoose = require("mongoose");

require("dotenv").config(); // jo bhi .env configuration h usko load kardo

exports.connect = () => { // lets se method ka naam connect rakh diya, and then arrow func create kiya
    return mongoose.connect(process.env.MONGODB_URL) // connect ke liye 2 chiz dalte h, pehla DB ka url jo .env se aayega
    .then( () => {console.log("DB connected successfully")})
    .catch( (err) => {
        console.log("DB CONNECTION ISSUES");
        console.error(err);
        process.exit(1); // kuch fata tha isiliye bahar nikal rhe
    });
}