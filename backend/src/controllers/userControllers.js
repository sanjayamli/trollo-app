// backend/controllers/userController.js
import User from "../models/users.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register user
export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    console.log(user.save())
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: "Registration failed" });
  }
};

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "12h",
    });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};

export const googleLogin = async (req, res) => {
  const { tokenId } = req.body;
  console.log ("tokenId:", tokenId)
  console.log("req.body",req.body);
  try {
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    // console.log( "ticket 1 ",ticket);
    // console.log(" ticket.getPayload():", ticket.getPayload())
    const { name, email } = ticket.getPayload();
    console.log("name:",name)
    console.log("email:",email);
    
    console.log("we are here")
    try {
      const user = await User.findOne({ email });
    
      console.log("user:", user);
    } catch (err) {
      console.error("Error with User.findOne:", err);
    }
    try {
      const token = jwt.sign({ id: User._id }, process.env.JWT_SECRET, {
        expiresIn: "12h",
      });
      console.log("token:", token);
      res.json({ token: token });
    } catch (tokenError) {
      console.error("Error generating token:", tokenError);
      res.status(500).json({ error: "Token generation failed" });
    }
  } catch (error) {
    res.status(400).json({ error: "Google login failed" });
  }
};
