const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

//generate jwt token
const generateToken = (userId) =>{
  return jwt.sign({id: userId},process.env.JWT_SECRET, {expiresIn: "1d"});
};

//generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

//Register User
const registerUser = [
  // First Name validation
  check("name")
    .notEmpty()
    .withMessage("Name is required")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters long")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters"),

  // Email validation
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail()
    .custom(async (value) => {
      try {
        const existingUser = await User.findOne({ email: value });
        if (existingUser) {
          throw new Error("User already exists with this email");
        }
        return true;
      } catch (error) {
        throw new Error(error.message);
      }
    }),

  // Password validation
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage("Password must contain at least one special character")
    .trim(),

  // Confirm password validation
  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match"); // Fixed grammar
      }
      return true;
    }),

  // User Type validation
  check("role")
    .notEmpty()
    .withMessage("role type is required")
    .isIn(["admin", "student"])
    .withMessage("Invalid role type"),

async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
     const errorsMsg = validationResult(req);
      if (!errorsMsg.isEmpty()) {
  return res.status(400).json({ errors: errorsMsg.array() });
}
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //call generate OTP
    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role,
      otp,
      otpExpires
    });

    await user.save();

   try {
  await sendEmail(email, otp);
} catch (err) {
  console.error("Email error:", err.message);
  return res.status(500).json({ message: "Failed to send OTP", error: err.message });
}
    return res.status(201).json({ message: "OTP sent to email. Please verify."});
    
  } catch (error) {
    console.error("Register Error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}
]

//login User
const loginUser = async (req,res) =>{
      try{
       const {email, password} = req.body;

       const user = await User.findOne({email}) ;
       if(!user){
         return res.status(401).json({message: "Invalid email or password"});
       }
       // Prevent login if user hasn't verified their email via OTP
       if (!user.isVerified) {
         return res.status(403).json({ message: "Account not verified. Please verify your email (OTP) before logging in." });
       }
        //Match Password
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
         return res.status(401).json({message: "Invalid email or password"});
       }
     //Return user data with JWT
        res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        })
  }catch(error){
      return res.status(500).json({message: "server error",error: error.message});
  }

}
const userProfile = async (req, res) => {
  try {
    // Make sure req.user exists and has an id (added by auth middleware)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user ID in request" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


module.exports = {registerUser, loginUser, userProfile};

// Additional OTP endpoints
const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOTP();
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    user.otp = otp;
    user.otpExpires = otpExpires;
    await user.save();

    try {
      await sendEmail(email, otp);
    } catch (err) {
      console.error("Email error:", err.message);
      return res.status(500).json({ message: "Failed to send OTP", error: err.message });
    }

    return res.status(200).json({ message: "OTP resent to email." });
  } catch (error) {
    console.error("sendOTP Error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP are required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otp !== otp || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    // Optionally return token so user is logged in immediately
    const token = generateToken(user._id);
    return res.status(200).json({ message: "Account verified successfully", token });
  } catch (error) {
    console.error("verifyOTP Error:", error.message);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {sendOTP, verifyOTP};