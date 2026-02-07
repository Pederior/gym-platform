const Class = require("../models/Class");
const Equipment = require("../models/Equipment");
const ClubSettings = require("../models/ClubSettings");
const Room = require('../models/Room')

// --- Classes ---
const getClasses = async (req, res) => {
  try {
    const classes = await Class.find()
      .populate("coach", "name")
      .sort({ dateTime: -1 });
    res.status(200).json({ success: true, classes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Equipment ---
const getEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, equipment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Settings ---
const getSettings = async (req, res) => {
  try {
    let settings = await ClubSettings.findOne();
    if (!settings) {
      // ایجاد تنظیمات پیش‌فرض اگر وجود نداشت
      settings = await ClubSettings.create({});
    }
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    const settings = await ClubSettings.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
    });
    res.status(200).json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --- Pricing ---
const getPricing = async (req, res) => {
  try {
    let settings = await ClubSettings.findOne();
    if (!settings) {
      settings = await ClubSettings.create({});
    }
    res.status(200).json({ success: true, pricing: settings.pricing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const updatePricing = async (req, res) => {
  try {
    const settings = await ClubSettings.findOneAndUpdate(
      {},
      { pricing: req.body },
      { new: true, upsert: true },
    );
    res.status(200).json({ success: true, pricing: settings.pricing });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, rooms });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ success: true, room });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const createEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.create(req.body);
    res.status(201).json({ success: true, equipment });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getClasses,
  getEquipment,
  getSettings,
  updateSettings,
  getPricing,
  updatePricing,
  getRooms,
  createRoom,
  createEquipment,
};
