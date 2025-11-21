const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');

// 🎯 JOI schemas
const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('user', 'admin').default('user'),
  password: Joi.string().min(6).max(50).required()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// 📌 REGISTER
exports.register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ answer: "0", comment: error.details[0].message });

    const { name, email, password , role } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const exist = await User.findOne({ email });
    if (exist) return res.status(409).json({ answer: "0", comment: "Email already registered" });

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : undefined;
    const user = await User.create({
      name,
      email,
      role,
      password: hashedPassword,
      avatar: avatarPath,
    });

    res.status(201).json({ answer: "1", comment: "User registered successfully", result: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    } });
  } catch (error) {
    res.status(500).json({ answer: "0", comment: "Server error", error });
  }
};

// 📌 LOGIN
exports.login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ answer: "0", comment: error.details[0].message });

    const { email, password } = req.body;

    // Vérifier email
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ answer: "0", comment: "Invalid email or password" });

    // Vérifier mot de passe
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(403).json({ answer: "0", comment: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
         answer: "1",
      comment: "Login successful",
      result: {
        id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
     
      },
         token,
      
    });

  } catch (error) {
    res.status(500).json({ answer: "0", comment: "Server error", error });
  }
};
