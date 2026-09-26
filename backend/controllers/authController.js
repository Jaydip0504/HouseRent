import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "default_secret", {
    expiresIn: "30d",
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, userType, type, phone } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const selectedType = (userType || type || "Renter").trim();

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      type: selectedType.toLowerCase() === "owner" ? "owner" : "user",
      userType: selectedType,
      role: selectedType.toLowerCase() === "admin" ? "admin" : "user",
      isOwnerApproved: selectedType.toLowerCase() === "owner" ? true : false,
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        type: user.type,
        userType: user.userType,
        role: user.role,
        isOwnerApproved: user.isOwnerApproved,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

  
    let resolvedRole = "Renter";
    if (user.role === "admin" || user.type === "admin" || user.email === "admin@houserent.com") {
      resolvedRole = "Admin";
    } else if (
      user.type === "owner" ||
      user.type === "Owner" ||
      user.type === "Landlord" ||
      user.userType === "Owner"
    ) {
      resolvedRole = "Owner";
    }

    res.json({
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        type: resolvedRole.toLowerCase(),
        userType: resolvedRole,
        role: resolvedRole === "Admin" ? "admin" : "user",
        isOwnerApproved: user.isOwnerApproved || false,
      },
    });
  } catch (err) {
    next(err);
  }
};