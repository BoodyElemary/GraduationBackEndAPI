const mongoose = require("mongoose");
const Customer = mongoose.model("Customer");
const Voucher = mongoose.model("Voucher");
const uuid = require("uuid");
const { setConfirmView } = require("../view/email-form");
const { sendEmail } = require("../util/nodemailer");
const { verify } = require("../util/jwt");
const jwt = require("jsonwebtoken");

// Create a new customer
const createCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone } = req.body;
    const activationToken = uuid.v4();
    const customer = new Customer({
      firstName,
      lastName,
      email,
      password,
      phone,
      activationToken,
    });
    await customer.save();
    await sendActivationEmail(email, activationToken);
    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get a customer by ID and populate the referenced documents
const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate(
      "voucherList"
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a customer
const updateCustomer = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        customerOrders: req.body.consoleOrders,
        voucherList: req.body.voucherList,
      },
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a customer
const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Add a voucher to a customer's voucherList
const addVoucherToCustomer = async (req, res) => {
  try {
    const { id, voucherId } = req.params;
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const voucher = await Voucher.findById(voucherId);
    if (!voucher) {
      return res.status(404).json({ message: "Voucher not found" });
    }
    customer.voucherList.push(voucher);
    await customer.save();
    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Send activation email
const sendActivationEmail = async (email, activationToken) => {
  try {
    const mailTemplateWithActivation = setConfirmView(
      `localhost:8081/api/customers/activate/${activationToken}`
    );

    sendEmail(email, mailTemplateWithActivation);
  } catch (error) {
    throw new Error("Failed to send activation email.");
  }
};

//activate user account

const activateAccount = async (req, res) => {
  try {
    const { token } = req.params;
    console.log(req.params);

    // Find the customer with the provided activation token
    const customer = await Customer.findOne({ activationToken: token });

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }
    // Activate the customer account
    // customer.isActive = true;
    // customer.activationToken = null;
    const updatedCustomer = await Customer.findByIdAndUpdate(customer.id, {
      $unset: { activationToken: "" },
      isActive: true,
    });
    // await customer.save();

    // Redirect the customer to the frontend URL
    const frontendUrl = "http://localhost:4200"; // Replace with your frontend URL
    return res.redirect(`${frontendUrl}/account-activated`);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

const getCustomerProfile = async (req, res) => {
  try {
    // Assuming you have a token in the request headers
    const token = req.headers.authorization;

    // Verify the token and extract the user ID
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedToken.id;

    // Retrieve the customer using the user ID
    const customer = await Customer.findById(userId).populate("voucherList");

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res.json(customer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createCustomer,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  addVoucherToCustomer,
  getAllCustomers,
  activateAccount,
  getCustomerProfile,
};
