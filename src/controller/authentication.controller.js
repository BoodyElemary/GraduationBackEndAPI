const mongoose = require("mongoose");
const CustomerModel = mongoose.model("Customer");
const AdminModel = mongoose.model("Admin");
const SuperAdminModel = mongoose.model("SuperAdmin");
const jwt = require("../util/jwt");
const mailer = require("nodemailer");
const { body } = require("express-validator");
const createError = require(path.join(__dirname, "..", "util", "error"));
const passwordHandle = require(path.join(
  __dirname,
  "..",
  "util",
  "password-handle"
));

exports.login = async (req, res, next) => {
  try {
    const customer = await CustomerModel.findOne({ email: req.body.email });
    if (
      !customer ||
      !(await passwordHandle.compare(req.body.password, customer.password))
    )
      next(createError("Email or password is wrong.", 401));
    if (!customer.isActive)
      next(createError("Activate your email please.", 401));
    const token = jwt.create({ id: customer._id, role: "customer" });
    res.status(200).json({
      message: "success",
      customer,
      token,
    });
  } catch (err) {
    next(err);
  }
};

exports.loginAdmin = async (req, res, next) => {
  try {
    let admin;
    req.body.role === "admin"
      ? (admin = await AdminModel.findOne({ fullName: req.body.fullName }))
      : (admin = await SuperAdminModel.findOne({
          fullName: req.body.fullName,
        }));
    if (
      !admin ||
      !(await passwordHandle.compare(req.body.password, admin.password))
    )
      next(createError("Email or password is wrong.", 401));
    const token = jwt.create({ id: admin._id, role: req.body.role });
    res.status(200).json({
      message: "success",
      admin,
      token,
    });
  } catch (err) {
    next(err);
  }
};

exports.passwordReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      next(err);
    }
    const token = buffer.toString("hex");
    teacherModel
      .findOne({ email: req.body.email })
      .then((teacher) => {
        if (!teacher) {
          let error = new Error("Email Not found");
          error.status = 401;
          throw error;
        }
        teacher.activateToken = token;
        teacher.activateTokenExp = Date.now() + 3600000;
        return teacher.save();
      })
      .then(() => {
        let transporter = mailer.createTransport({
          service: "outlook",
          auth: {
            user: "ahmedketa12@gmail.com", //ToDo
            pass: "Nonoman23", //ToDo
          },
        });
        let mailOptions = {
          type: "OAUTH2",
          from: "ahmedketa12@gmail.com",
          to: req.body.email,
          subject: "Password reset",
          html:
            // fs.readFileSync(
            //   path.join(__dirname, "..", "view", "email-validation.html")
            // ) +
            `<a href="localhost:8080/active/${token}">localhost:8080/active/${token}</a>`,
          // text: "Welcome from Node.js",
        };
        transporter.sendMail(mailOptions, (err) => {
          if (err) {
            next(err);
          } else {
            res.status(200).json({ message: "Email sent" });
          }
        });
      })
      .catch((err) => next(err));
  });
};

exports.getReset = (req, res, next) => {
  teacherModel
    .findOne({ activateToken: req.params.token })
    .then((teacher) => {
      if (!teacher) {
        let error = new Error("No teacher with this reset token");
        error.status(401);
        throw error;
      } else if (teacher.activateTokenExp < Date.now) {
        let error = new Error("Expired Token");
        error.status(401);
        throw error;
      } else if (teacher.active) {
        let token = jwt.sign(
          {
            id: teacher._id,
            role: "teacher",
          },
          tokenKey,
          { expiresIn: "8h" }
        );
        res.status(200).json({ message: "ok", token }); //ToDo (Direct to reset Page with token)
      } else {
        let error = new Error("Activate your email please.");
        error.status = 401;
        throw error;
      }
    })
    .catch((err) => {
      next(err);
    });
};
