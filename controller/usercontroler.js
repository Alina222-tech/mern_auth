const model = require("../model/usermodel.js");
const { v4: uuid } = require("uuid");
const fs = require("fs");
const path = require("path");
const cloudinary = require("../config/cloudinary.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



const register = async (req, res) => {
  try {
    const { First_Name, Last_Name, email, password } = req.body;

    if (!First_Name || !Last_Name || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await model.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already registered." });
    }

    let profileurl = "";
    if (req.files && req.files.profile_image) {
      const image = req.files.profile_image;

      const filename = `${uuid()}_${image.name}`;
      const uploadDir = path.join(__dirname, "_", "uploads");

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const uploadpath = path.join(uploadDir, filename);
      await image.mv(uploadpath);

      const uploadresult = await cloudinary.uploader.upload(uploadpath, {
        folder: "user_profile",
        public_id: uuid(),
        use_filename: true,
        unique_filename: true,
      });

      profileurl = uploadresult.secure_url;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await model.create({
      First_Name,
      Last_Name,
      email,
      password: hashedPassword,
      profile_image: profileurl,
    });

    return res.status(201).json({ message: "User created successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const user = await model.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "User login successful.",
      user: {
        id: user._id,
        First_Name: user.First_Name,
        Last_Name: user.Last_Name,
        email: user.email,
        profile_image: user.profile_image,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production"
     
    });
 

    return res.status(200).json({ message: "User logged out successfully." });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
};
