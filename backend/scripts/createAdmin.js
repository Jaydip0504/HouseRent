import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config({ path: "./.env" });

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "admin@houserent.com";
  const exists = await User.findOne({ email });

  if (exists) {
    console.log("Admin already exists.");
  } else {
    const password = await bcrypt.hash("Admin@1234", 10);
    await User.create({
      name: "HouseRent Admin",
      email,
      password,
      role: "admin"
    });
    console.log("Admin created: admin@houserent.com / Admin@1234");
  }

  await mongoose.disconnect();
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
