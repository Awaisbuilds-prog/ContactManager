
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters."],
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
      lowercase: true,
      maxlength: [254, "Email cannot exceed 254 characters."],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address.",
      ],
    },

    phone: {
      type: String,
      trim: true,
      maxlength: [30, "Phone cannot exceed 30 characters."],
      default: "",
    },

    company: {
      type: String,
      trim: true,
      maxlength: [100, "Company cannot exceed 100 characters."],
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent contacts from having duplicate email addresses.
contactSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("Contact", contactSchema);
