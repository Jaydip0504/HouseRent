import Booking from "../models/Booking.js";
import Property from "../models/Property.js";

export const createBooking = async (req, res, next) => {
  try {
    const { propertyId, moveInDate, message, phone, renter, userName } = req.body;
    
    const renterId = req.user?._id || renter || req.headers["x-user-id"];

    if (!renterId) {
      return res.status(400).json({ message: "Renter ID is required. Please login again." });
    }

    const property = await Property.findOne({ _id: propertyId });

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    if (String(property.owner) === String(renterId)) {
      return res.status(400).json({ message: "You cannot book your own property" });
    }

    const booking = await Booking.create({
      property: propertyId,
      renter: renterId,
      userName: req.user?.name || userName || "Renter",
      phone: phone || req.user?.phone || "",
      moveInDate: moveInDate || new Date(),
      message: message || "",
      status: "pending",
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
};

export const getMyBookings = async (req, res, next) => {
  try {
    const renterId = req.user?._id || req.query.renterId || req.headers["x-user-id"];
    
    let query = {};
    if (renterId) {
      query = {
        $or: [{ renter: renterId }, { "renter._id": renterId }],
      };
    }

    const bookings = await Booking.find(query)
      .populate("property", "title location price rentAmount propertyAddress propertyType propertyAdType imageUrl")
      .populate("renter", "name email phone")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

export const getOwnerBookings = async (req, res, next) => {
  try {
    const ownerId = req.user?._id || req.query.ownerId || req.headers["x-user-id"];

    if (!ownerId) {
      return res.status(400).json({ message: "Owner ID required" });
    }

    const ownerProperties = await Property.find({
      $or: [{ owner: ownerId }, { "owner._id": ownerId }],
    }).select("_id");

    const propertyIds = ownerProperties.map((p) => p._id);

    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate("property", "title location price rentAmount propertyAddress propertyType propertyAdType imageUrl")
      .populate("renter", "name email phone")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("property", "title location price rentAmount owner")
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
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (err) {
    next(err);
  }
};