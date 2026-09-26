import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    property: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    renter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String },
    phone: { type: String, default: "" },
    moveInDate: { type: Date, required: true },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "Cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);