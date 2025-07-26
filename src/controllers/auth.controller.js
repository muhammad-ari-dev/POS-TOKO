// src/controllers/auth.controller.js
import prisma from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ENV
const JWT_SECRET = process.env.JWT_SECRET || "secret";

// 👉 Register User
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  // Cek jika email sudah digunakan
  const existed = await prisma.user.findUnique({ where: { email } });
  if (existed)
    return res.status(400).json({ message: "Email sudah terdaftar" });

  // Hash password sebelum simpan
  const hashed = await bcrypt.hash(password, 10);

  // Simpan user baru
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashed,
    },
  });

  res.status(201).json({
    message: "Register berhasil",
    user: { id: user.id, name: user.name, email: user.email },
  });
};

// 👉 Login User
export const login = async (req, res) => {
  const { email, password } = req.body;

  // Cari user
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ message: "Email tidak ditemukan" });

  // Cocokkan password
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ message: "Password salah" });

  // Buat JWT Token
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

  // Simpan token di cookie
  res.cookie("token", token, {
    httpOnly: true, // Tidak bisa diakses oleh JavaScript di browser
    secure: false, // true kalau pakai HTTPS
    sameSite: "strict", // Hanya bisa dikirim dari origin yang sama
    maxAge: 24 * 60 * 60 * 1000, // 1 hari
  });

  res.json({ message: "Login berhasil" });
};

// 👉 Logout User
export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logout berhasil" });
};
