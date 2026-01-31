//bcrypt library se password hash larenge
const bcrypt = require("bcrypt");
//models ko import karana hoga taki db se interact kar paye using models
const User = require("../models/Users");
const jwt = require("jsonwebtoken");
require("dotenv").config(); //JWT Secret .env file se lene ke liye ye krna hoga


//signup ka route handler
exports.signup = async (req,res) =>{
    try{
        //get data
        const {name,email,password,role} = req.body; // req ki body se ye chaaro data fetch krlo
        //check if user already exost
        //iske liye to db interaction krni pdegi
        //db ki call h toh await use kr lena, interact krna chatte hoto model use kr lena
        const existingUser = await User.findOne({email}); //kya is email ke corr koo entry hai, agar hai toh first entry ko return karl=do
        //agar ek valid entry mil gyi, toh aage process krne ki koi need nhi, throw krdo

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User already exists',
            });
        }
        //password ko secure karo
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password,10); //hashedpassword create krte h using .hash func, hash ke andar 2 arguments pass krte h, ek password and second number of rounds 
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:'Error in hashing Password'
            })
        }
        //create entry for User
        const user = await User.create({ //db se interact kr rhe h toh await
            name,email,password:hashedPassword,role // jo bhi vyakti entry kr raha tha, uski entry db me store ho chuki h
        })

        return res.status(200).json({
            success:true,
            message:'User created successfully'
        })
    }
    catch(error){       //agar pure logic me code kahi faat gaya toh catch me aa jaengr
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered, please try again later'
        })
    }
}

//login
//1 {email,password} = req.body;
//2 valid -> if(!email || !password) return res
//3 email -> user exist -> db call -> findOne({email})
//4 validate password -> 
//yes {create json webtoken -> jwt ka instance nikala hoga, uske liye import karenge, uske liye install karna hoga
//}
// |-> no return 

//login
exports.login = async(req,res) => {
    try{
        //data fetch
        const {email,password} = req.body;
        //validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:'Please fill all the details carefully',
            });
        }
        //check for registered user
        let user = await User.findOne({email});
        //if not registered
        if(!user){
            return res.status(401).json({
                success:false,
                message:'User is not registered',
            });
        }

        const payLoad = {
            email:user.email,
            id:user._id,
            role:user.role,
        };

        //verify password and generate a JWT token
        if(await bcrypt.compare(password,user.password)){
            //jwt token create krne se pehle uska instance lena hoga, import krne ke liye usko install krna hoga
            //password match
            let token = jwt.sign(payLoad,
                                process.env.JWT_SECRET,
                                {
                                    expiresIn:"2h",
                                });
            
            user = user.toObject();
            user.token = token; //user ki entry jo nikale h, usme alagse field banadi token naamki and usme ye token insert kr diye
            //user ke andar password bhi h, toh usko hata denge
            user.password = null; //password ko user ke object se hataya h, database se nhi
            //ab cookie create krenge
            // jo hamara response hoga usme ek cookie add krenge
            //cookie ke andar 3 paramaters pass krne hote h, 1. cookie ka naam, 2. cookie ka data, 3. kuch options
            const options = {
                expires: new Date(Date.now() + 3*24*60*60*1000), //abhi se leke 3 din baad cookie expire hogi
                httpOnly:true, //client site pe cookie ko change nhi kr skte
            }
            //ye options hame banane parenge
            res.cookie("babbarCookie",token,options).status(200).json ({
                success:"true",
                token,
                user,
                message:'User Logged in successfully',
            });

        }else{
            //password do not match
            return res.status(403).json({
                success:false,
                message:"Password incorrect",
            });
        }

    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Login failure',
        })
    }
}

//email pass fetch from req body
//validation -> email/pass
//check is user is registered or not
//compare password, no-> return yes->create jwt token using sign method, user.token, user.password->invalid, res.cookie(__,__,__) status, 



//middlewares
//req and server ke bich me req ko intercept krke execute hota
