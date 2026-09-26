import mongoose from "mongoose";

const propertySchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    location: { type: String, required: true },
    propertyAddress: { type: String, default: "" },
    ownerContact: { type: String, default: "" },
    price: { type: Number, required: true },
    rentAmount: { type: Number },
    propertyType: {
      type: String,
      enum: ["Residential", "Commercial", "Apartment", "House", "1BHK", "2BHK", "3BHK"],
      default: "Residential",
    },
    propertyAdType: {
      type: String,
      enum: ["Rent", "Sale"],
      default: "Rent",
    },
    imageUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Property", propertySchema);