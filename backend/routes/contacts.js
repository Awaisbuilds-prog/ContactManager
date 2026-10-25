const express = require("express");
const mongoose = require("mongoose");
const Contact = require("../models/Contact");

const router = express.Router();

// Validate MongoDB contact ID
function validateId(req, res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid contact ID.",
    });
  }

  next();
}

// Validate and normalize contact fields
function validateContact(req, res, next) {
  let { name, email, phone, company } = req.body;

  if (typeof name !== "string" || !name.trim()) {
    return res.status(400).json({
      success: false,
      message: "Contact name is required.",
    });
  }

  if (typeof email !== "string" || !email.trim()) {
    return res.status(400).json({
      success: false,
      message: "Contact email is required.",
    });
  }

  name = name.trim();
  email = email.trim().toLowerCase();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email address.",
    });
  }

  if (
    phone !== undefined &&
    phone !== null &&
    typeof phone !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Phone must be a string.",
    });
  }

  if (
    company !== undefined &&
    company !== null &&
    typeof company !== "string"
  ) {
    return res.status(400).json({
      success: false,
      message: "Company must be a string.",
    });
  }

  req.contactData = {
    name,
    email,
    phone: typeof phone === "string" ? phone.trim() : "",
    company: typeof company === "string" ? company.trim() : "",
  };

  next();
}

// GET /api/contacts
// Retrieve all contacts
router.get("/", async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/contacts/:id
// Retrieve one contact
router.get("/:id", validateId, async (req, res, next) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/contacts
// Create a contact
router.post("/", validateContact, async (req, res, next) => {
  try {
    const contact = await Contact.create(req.contactData);

    res.status(201).json({
      success: true,
      message: "Contact created successfully.",
      data: contact,
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/contacts/:id
// Update a contact
router.put(
  "/:id",
  validateId,
  validateContact,
  async (req, res, next) => {
    try {
      const contact = await Contact.findOneAndUpdate(
        { _id: req.params.id },
        req.contactData,
        {
          returnDocument: "after",
          runValidators: true,
        }
      );

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: "Contact not found.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Contact updated successfully.",
        data: contact,
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/contacts/:id
// Delete a contact
router.delete("/:id", validateId, async (req, res, next) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: "Contact not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contact deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;