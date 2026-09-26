import Property from "../models/Property.js";

export const getProperties = async (req, res, next) => {
  try {
    const { location, type, adType } = req.query;
    let query = { status: "approved" };

    if (location) {
      query.$or = [
        { location: { $regex: location, $options: "i" } },
        { propertyAddress: { $regex: location, $options: "i" } },
      ];
    }
    if (type && type !== "All") query.propertyType = type;
    if (adType && adType !== "All") query.propertyAdType = adType;

    const properties = await Property.find(query)
      .populate("owner", "name email phone")
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (err) {
    next(err);
  }
};

export const getMyProperties = async (req, res, next) => {
  try {
    const ownerId = req.user?._id || req.query.ownerId || req.headers["x-user-id"];

    if (!ownerId) {
      return res.status(400).json({ message: "Owner ID required" });
    }

    const properties = await Property.find({
      $or: [{ owner: ownerId }, { "owner._id": ownerId }],
    }).sort({ createdAt: -1 });

    res.json(properties);
  } catch (err) {
    next(err);
  }
};

export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "owner",
      "name email phone"
    );
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (err) {
    next(err);
  }
};

export const createProperty = async (req, res, next) => {
  try {
    const {
      title,
      propertyType,
      propertyAdType,
      location,
      propertyAddress,
      ownerContact,
      price,
      rentAmount,
      description,
      imageUrl,
      image,
      owner,
    } = req.body;

    const ownerId = req.user?._id || owner || req.headers["x-user-id"];

    if (!ownerId) {
      return res.status(400).json({ message: "Owner ID is required to create a property." });
    }

    const savedImage = imageUrl || image || "";

    const prop = await Property.create({
      owner: ownerId,
      title: title || `${propertyType || "Residential"} in ${propertyAddress || location || "City"}`,
      propertyType: propertyType || "Residential",
      propertyAdType: propertyAdType || "Rent",
      location: location || propertyAddress || "Unknown",
      propertyAddress: propertyAddress || location || "Unknown",
      ownerContact: ownerContact || "",
      price: Number(price || rentAmount) || 0,
      rentAmount: Number(rentAmount || price) || 0,
      description: description || "",
      imageUrl: savedImage,
      status: "approved",
      isAvailable: true,
    });

    res.status(201).json(prop);
  } catch (err) {
    next(err);
  }
};

export const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json(property);
  } catch (err) {
    next(err);
  }
};

export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }
    res.json({ message: "Property deleted successfully" });
  } catch (err) {
    next(err);
  }
};