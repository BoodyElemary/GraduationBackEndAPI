const path = require('path');
const mongoose = require('mongoose');
const Admin = mongoose.model('Admin');
const createError = require(path.join(__dirname, '..', 'util', 'error'));
const passwordHandle = require(path.join(
  __dirname,
  '..',
  'util',
  'password-handle',
));
const jwt = require('jsonwebtoken');

// Get all admins
const getAllAdmins = async (req, res, next) => {
  try {
    const admins = await Admin.find({}).populate('store').sort({ createdAt: -1 });
    res.status(200).json(admins);
  } catch (error) {
    next(error);
  }
};

// Add a new admin
const addNewAdmin = async (req, res, next) => {
  try {
    const { fullName, password, store } = req.body;
    const admin = new Admin({ fullName, password, store });
    const result = await admin.save();
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// Update an admin
const updateAdmin = async (req, res, next) => {
  try {
    const { id, ...data } = req.body;
    const updatedAdmin = await Admin.findByIdAndUpdate(id, data, { new: true });
    res.status(201).json(updatedAdmin);
  } catch (error) {
    next(error);
  }
};

// Delete an admin
const deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Admin.findByIdAndDelete(id);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// Get admin data by ID
const getAdminData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findById(id).populate('store');
    res.status(200).json(admin);
  } catch (error) {
    next(error);
  }
};

// Get admin data by profile path
const getAdminDataByProfilePath = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(
      token.replace('Bearer ', ''),
      process.env.SECRET_KEY,
    );
    const user = decodedToken;
    const admin = await Admin.findById(user.id).populate('store'); // To be stored in auth middleware
    res.status(200).json(admin);
  } catch (error) {
    next(error);
  }
};

// Get all admins for a specific store
const getStoreAdmins = async (req, res, next) => {
  try {
    const { store } = req.params;
    const admins = await Admin.find({ store });
    res.status(200).json(admins);
  } catch (error) {
    next(error);
  }
};

// Search for admin
const adminSearch = async (req, res, next) => {
  try {
    const { query } = req.params;
    const admins = await Admin.find({ $text: { $search: query } });
    res.status(200).json(admins);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllAdmins,
  addNewAdmin,
  updateAdmin,
  deleteAdmin,
  getAdminData,
  getAdminDataByProfilePath,
  getStoreAdmins,
  adminSearch,
};
