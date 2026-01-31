// isAdmin isStudent 2 types ka auth banayenge

//jwt is instance lena hoga

const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req, res, next) => {
  try {
    //JWT token ko extract krenge
    //req ki body me token h, cookies se nikal skte, header se nikal skte
    const token = req.body.token || 
                  (req.cookies && req.cookies.babbarCookie) || 
                  req.headers.authorization?.replace('Bearer ', '');

    console.log('Auth middleware - token found:', !!token);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }

    //verify the token
    try {
      const payLoad = jwt.verify(token, process.env.JWT_SECRET); // decrypt
      console.log('Token payload:', payLoad);
      req.user = payLoad;
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

exports.isStudent = (req, res, next) => {
  try {
    if (req.user.role !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for student",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role is not matching",
    });
  }
};

exports.isAdmin = (req, res, next) => {
  try {
    console.log('isAdmin middleware - user role:', req.user?.role);
    if (req.user.role !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for admin",
      });
    }
    next();
  } catch (error) {
    console.error('isAdmin middleware error:', error);
    return res.status(500).json({
      success: false,
      message: "User role is not matching",
    });
  }
};
