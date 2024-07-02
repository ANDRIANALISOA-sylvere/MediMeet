const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const User = require("../models/User.model");

const Register = async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      name,
      email,
      password,
      role,
      phone,
      emailVerified: false,
      phoneVerified: false,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 360000 },
      (err, token) => {
        if (token) {
          if (err) throw err;
          res.json({ token,user });
        }
      }
    );
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server error");
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: 360000,
      },
      (err, token) => {
        if (err) throw err;
        res.json({ token,user });
      }
    );
  } catch (error) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

const GoogleAuth = async (req, res) => {
  const payload = {
    user: {
      id: req.user.id,
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: 360000 },
    (err, token) => {
      if (err) throw err;
      res.redirect(`/?token=${token}`);
    }
  );
};

module.exports = {
  Register,
  Login,
  GoogleAuth
};
