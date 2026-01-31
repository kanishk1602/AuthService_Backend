const express = require("express"); // route wali file me route create krne ke liye hame router chahiye, uske liye express ka instance chahiye
const router = express.Router();

//hame 2 handler chahiye,
//ek login ke liye aur ek signup ke liye
const {login, signup} = require("../Controllers/Auth") // dono handler ko import karayenge, wo Controller me pare honge
// import kara liye aur

//authorisation ke liye import karao
const{auth, isStudent,isAdmin} = require("../middlewares/auth");

router.post("/login",login); //login request ko login handler se map kardo
router.post("/signup",signup); //signup request ko signup handler se map kardo

//testing protected routes for single middleware
router.get("/test", auth, (req,res) => {
    res.json({
        success:true,
        message:'Welcome to the Protected route for TESTS',
    })
})

//ab ek protected route banayenge
//tumko batana parega is route me kitne middleware use hinge
// /student naamki req aayegi toh auth ka req chalega, then isStudent ka req chalega
//token pakarke role nikalo
router.get("/student", auth, isStudent, (req,res) => {
    res.json({
        success:true,
        message:'Welcome to the Protected route for students',
    });
});

router.get("/admin",auth, isAdmin, (req,res) => {
    res.json({
        success:true,
        message:'Welcome to the Protected route for admin',
    });
});

//export karado
module.exports = router;

