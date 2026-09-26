import User from "../models/User.js";
import Property from "../models/Property.js";
import Booking from "../models/Booking.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

export const grantOwnerPermission = async (req, res, next) => {
  try {
    const { isOwnerApproved } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isOwnerApproved },
      { new: true }
    );
    res.json(user);
  } catch (err) {
    next(err);
  }
};

export const getAllPropertiesAdmin = async (req, res, next) => {
  try {
    const properties = await Property.find().populate("owner", "name email phone").sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    next(err);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("property", "title location rentAmount price owner")
      .populate("renter", "name email phone")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(booking);
  } catch (err) {
    next(err);
  }
};